import React, { useState, useEffect } from "react";
import {
  Text,
  Flex,
  HStack,
  Box,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
  Grid,
  GridItem,
  SimpleGrid,
} from "@chakra-ui/react";
import moment from "moment";
import Button from "../Components/Button";
import Input from "../Components/Input";
import PreviewCardV2 from "../Components/PreviewCardV2";
import ShowToast from "../Components/ToastNotification";
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import { GetDentalEncountersByPatientIdApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";
import { useNavigate, useLocation } from "react-router-dom";
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import { BsCalendar2DateFill } from "react-icons/bs";

export default function Dental() {
  const [IsLoading, setIsLoading] = useState(true);
  const [All, setAll] = useState(true);
  const [Data, setData] = useState([]);
  const [FilterData, setFilterData] = useState([]);
  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null);
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  // Pagination settings
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage] = useState(configuration.sizePerPage);
  const indexOfLastSra = CurrentPage * PostPerPage;
  const indexOfFirstSra = indexOfLastSra - PostPerPage;
  const PaginatedData = (FilteredData || FilterData).slice(
    indexOfFirstSra,
    indexOfLastSra
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  let id = localStorage.getItem("patientId");
  const nav = useNavigate();
  const { pathname } = useLocation();

  const getAllDentalEncounters = async () => {
    setIsLoading(true);
    try {
      const result = await GetDentalEncountersByPatientIdApi(id);
      if (result.status === true) {
        setIsLoading(false);
        setData(result.queryresult.encounters);
        setFilterData(result.queryresult.encounters);
      }
    } catch (e) {
      console.error(e.message);
      activateNotifications("Failed to load dental encounters", "error");
    }
  };

  const filterBy = (title) => {
    if (title === "chiefComplaint") {
      let filter = Data.filter((item) =>
        item.chiefComplaint
          ?.join(", ")
          .toLowerCase()
          .includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "gingivalAssessment") {
      let filter = Data.filter((item) =>
        item.examinations?.gingivalAssessment
          ?.toLowerCase()
          .includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "oralCancerScreening") {
      let filter = Data.filter((item) =>
        item.examinations?.oralCancerScreening
          ?.toLowerCase()
          .includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "date") {
      if (StartDate && EndDate) {
        let endDateObj = new Date(EndDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        const formattedEndDate = endDateObj.toISOString().split("T")[0];
        const filtered = Data.filter((item) => {
          const createdDate = item.createdAt.split("T")[0];
          return createdDate >= StartDate && createdDate <= formattedEndDate;
        });
        setFilteredData(filtered);
      }
    }
  };

  const clearFilter = () => {
    setFilteredData(null);
    setSearchInput("");
    setByDate(false);
    setStartDate("");
    setEndDate("");
    setFilterData(Data);
  };

  const filterAll = () => {
    setAll(true);
    setFilterData(Data);
    setFilteredData(null);
    setSearchInput("");
    setByDate(false);
    setStartDate("");
    setEndDate("");
  };

  const activateNotifications = (message, status) => {
    setShowToast({
      show: true,
      message: message,
      status: status,
    });
    setTimeout(() => {
      setShowToast({ show: false });
    }, 5000);
  };

  const AddDentalEncounter = () => {
    nav(`/dashboard/add-dental-encounter/${id}`);
    localStorage.setItem("pathname", pathname);
  };

  const handleEdit = (item) => {
    // Store the complete dental encounter object in localStorage
    localStorage.setItem("DentalEncounter", JSON.stringify(item));
    nav(`/dashboard/edit-dental-encounter/${item._id}`);
    localStorage.setItem("pathname", pathname);
  };

  useEffect(() => {
    getAllDentalEncounters();
  }, [pathname]); // Changed to watch pathname instead of isOpen/Trigger

  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px={["18px", "18px"]}
      rounded="10px"
    >
      {IsLoading && <Preloader />}
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      {/* Filter Section */}
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Flex
          alignItems="center"
          flexWrap="wrap"
          bg="#E4F3FF"
          rounded="7px"
          py="3.5px"
          px="5px"
          cursor="pointer"
          mt={["10px", "10px", "0px", "0px"]}
        >
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAll}>
            <Text
              py="8.5px"
              px="12px"
              bg={All ? "#fff" : "transparent"}
              rounded="7px"
              color={"#1F2937"}
              fontWeight={"500"}
              fontSize={"13px"}
            >
              All{" "}
              <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                ({Data?.length})
              </Box>
            </Text>
          </Box>
        </Flex>

        <Flex
          flexWrap="wrap"
          mt={["10px", "10px", "0px", "0px"]}
          alignItems="center"
          justifyContent={"flex-end"}
        >
          <HStack flexWrap={["wrap", "nowrap"]}>
            {ByDate === false ? (
              <Input
                label="Search"
                onChange={(e) => setSearchInput(e.target.value)}
                value={SearchInput}
                bColor="#E4E4E4"
                leftIcon={<BiSearch />}
              />
            ) : (
              <HStack>
                <Input
                  label="Start Date"
                  type="date"
                  onChange={(e) => setStartDate(e.target.value)}
                  value={StartDate}
                  bColor="#E4E4E4"
                  leftIcon={<FaCalendarAlt />}
                />
                <Input
                  label="End Date"
                  type="date"
                  onChange={(e) => setEndDate(e.target.value)}
                  value={EndDate}
                  bColor="#E4E4E4"
                  leftIcon={<FaCalendarAlt />}
                />
                <Flex
                  onClick={() => filterBy("date")}
                  cursor="pointer"
                  px="5px"
                  py="3px"
                  rounded="5px"
                  bg="blue.blue500"
                  color="#fff"
                  justifyContent="center"
                  alignItems="center"
                >
                  <BiSearch />
                </Flex>
              </HStack>
            )}
            <Menu isLazy>
              <MenuButton as={Box}>
                <HStack
                  border="1px solid #EA5937"
                  rounded="7px"
                  cursor="pointer"
                  py="11.64px"
                  px="16.98px"
                  bg="#f8ddd1"
                  color="blue.blue500"
                  fontWeight="500"
                  fontSize="14px"
                >
                  <Text>Filter</Text>
                  <IoFilter />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => setByDate(true)}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>by Date</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => filterBy("chiefComplaint")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>by Chief Complaint</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => filterBy("gingivalAssessment")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>by Gingival Assessment</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => filterBy("oralCancerScreening")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>by Oral Cancer Screening</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={clearFilter}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>clear filter</Text>
                  </HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Flex>

      <Flex
        justifyContent="space-between"
        flexWrap="wrap"
        mt={["10px", "10px", "10px", "10px"]}
        w={["100%", "100%", "50%", "37%"]}
      >
        <Button
          rightIcon={<SlPlus />}
          w={["100%", "100%", "154px", "154px"]}
          px={"120px"}
          onClick={AddDentalEncounter}
        >
          Add Dental Encounter
        </Button>
      </Flex>

      {/* Dental Encounters List */}
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="15px"
        px="15px"
        rounded="10px"
      >
        <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">
          Dental Encounter History
        </Text>

        {PaginatedData.length === 0 && !IsLoading && (
          <Text fontSize="14px" color="gray.500" textAlign="center">
            No dental encounters found.
          </Text>
        )}

        <VStack spacing={4}>
          {PaginatedData.map((item, i) => (
            <Box
              key={i}
              border="1px solid #E2E8F0"
              borderRadius="md"
              p={4}
              boxShadow="sm"
              w="100%"
            >
              <HStack
                bg="orange.orange500"
                py="10px"
                px="10px"
                rounded="10px"
                color="blue.blue500"
                justifyContent="space-between"
                fontStyle="italic"
                fontSize="14px"
                fontWeight="500"
                mb={4}
              >
                <HStack>
                  <Box color="blue.blue500">
                    <BsCalendar2DateFill />
                  </Box>
                  <Text textAlign="center">
                    {moment(item.createdAt).format("L")}
                  </Text>
                  <Box color="blue.blue500">
                    <FaClock />
                  </Box>
                  <Text textAlign="center">
                    {moment(item.createdAt).format("LT")}
                  </Text>
                </HStack>
                <Text
                  textAlign="center"
                  cursor="pointer"
                  fontWeight="600"
                  onClick={() => handleEdit(item)}
                >
                  Edit Encounter
                </Text>
              </HStack>

              {/* Two-column layout for dental encounter data */}
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {/* Column 1 */}
                <GridItem>
                  {/* Chief Complaint */}
                  {item.chiefComplaint?.length > 0 && (
                    <Box mb={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="blue.blue500"
                        mb={2}
                      >
                        Chief Complaint
                      </Text>
                      {item.chiefComplaint.map((complaint, j) => (
                        <PreviewCardV2
                          key={`chief-complaint-${j}`}
                          title=""
                          value={complaint}
                          size="sm"
                        />
                      ))}
                    </Box>
                  )}

                  {/* Dental History */}
                  {item.dentalHistoryNotes?.length > 0 && (
                    <Box mb={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="blue.blue500"
                        mb={2}
                      >
                        Dental History Notes
                      </Text>
                      {item.dentalHistoryNotes.map((note, j) => (
                        <PreviewCardV2
                          key={`dental-history-${j}`}
                          title=""
                          value={note}
                          size="sm"
                        />
                      ))}
                    </Box>
                  )}

                  {/* Medical History */}
                  {item.medicalHistory && (
                    <Box mb={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="blue.blue500"
                        mb={2}
                      >
                        Medical History
                      </Text>
                      {item.medicalHistory.medicalConditions && (
                        <PreviewCardV2
                          title="Medical Conditions"
                          value={item.medicalHistory.medicalConditions}
                          size="sm"
                        />
                      )}
                      {item.medicalHistory.alerts && (
                        <PreviewCardV2
                          title="Alerts"
                          value={item.medicalHistory.alerts}
                          size="sm"
                        />
                      )}
                    </Box>
                  )}

                  {/* Allergies */}
                  {item.allergies?.length > 0 && (
                    <Box mb={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="blue.blue500"
                        mb={2}
                      >
                        Allergies
                      </Text>
                      {item.allergies.map((allergy, j) => (
                        <PreviewCardV2
                          key={`allergy-${j}`}
                          title=""
                          value={allergy}
                          size="sm"
                        />
                      ))}
                    </Box>
                  )}
                </GridItem>

                {/* Column 2 */}
                <GridItem>
                  {/* Examinations */}
                  {item.examinations && (
                    <Box mb={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="blue.blue500"
                        mb={2}
                      >
                        Examinations
                      </Text>
                      <SimpleGrid columns={2} spacing={2} mb={3}>
                        {item.examinations.gingivalAssessment && (
                          <PreviewCardV2
                            title="Gingival Assessment"
                            value={item.examinations.gingivalAssessment}
                            size="sm"
                          />
                        )}
                        {item.examinations.oralCancerScreening && (
                          <PreviewCardV2
                            title="Oral Cancer Screening"
                            value={item.examinations.oralCancerScreening}
                            size="sm"
                          />
                        )}
                        {item.examinations.tmjAssessment && (
                          <PreviewCardV2
                            title="TMJ Assessment"
                            value={item.examinations.tmjAssessment}
                            size="sm"
                          />
                        )}
                        {item.examinations.periodontalProbing && (
                          <PreviewCardV2
                            title="Periodontal Probing"
                            value={item.examinations.periodontalProbing}
                            size="sm"
                          />
                        )}
                      </SimpleGrid>
                    </Box>
                  )}

                  {/* General Oral Exam */}
                  {item.generalOralExam && (
                    <Box mb={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="blue.blue500"
                        mb={2}
                      >
                        General Oral Exam
                      </Text>
                      {item.generalOralExam.intraOral && (
                        <PreviewCardV2
                          title="Intra Oral"
                          value={item.generalOralExam.intraOral}
                          size="sm"
                        />
                      )}
                      {item.generalOralExam.tongue && (
                        <PreviewCardV2
                          title="Tongue"
                          value={item.generalOralExam.tongue}
                          size="sm"
                        />
                      )}
                      {item.generalOralExam.mucosa && (
                        <PreviewCardV2
                          title="Mucosa"
                          value={item.generalOralExam.mucosa}
                          size="sm"
                        />
                      )}
                      {item.generalOralExam.notes?.length > 0 && (
                        <Box>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            Notes
                          </Text>
                          {item.generalOralExam.notes.map((note, j) => (
                            <PreviewCardV2
                              key={`oral-exam-note-${j}`}
                              title=""
                              value={note}
                              size="sm"
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}
                </GridItem>
              </Grid>

              {/* Full-width sections below the two columns */}
              {/* Quadrant Notes */}
              {item.quadrant && (
                <Box mb={4}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="blue.blue500"
                    mb={2}
                  >
                    Quadrant Notes
                  </Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {item.quadrant.firstQuadrantNote?.length > 0 && (
                      <Box mb={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          First Quadrant Notes
                        </Text>
                        {item.quadrant.firstQuadrantNote.map((note, j) => (
                          <PreviewCardV2
                            key={`first-quadrant-${j}`}
                            title=""
                            value={note}
                            size="sm"
                          />
                        ))}
                      </Box>
                    )}
                    {item.quadrant.secondQuadrantNote?.length > 0 && (
                      <Box mb={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          Second Quadrant Notes
                        </Text>
                        {item.quadrant.secondQuadrantNote.map((note, j) => (
                          <PreviewCardV2
                            key={`second-quadrant-${j}`}
                            title=""
                            value={note}
                            size="sm"
                          />
                        ))}
                      </Box>
                    )}
                    {item.quadrant.thirdQuadrantNote?.length > 0 && (
                      <Box mb={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          Third Quadrant Notes
                        </Text>
                        {item.quadrant.thirdQuadrantNote.map((note, j) => (
                          <PreviewCardV2
                            key={`third-quadrant-${j}`}
                            title=""
                            value={note}
                            size="sm"
                          />
                        ))}
                      </Box>
                    )}
                    {item.quadrant.fourthQuadrantNote?.length > 0 && (
                      <Box mb={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          Fourth Quadrant Notes
                        </Text>
                        {item.quadrant.fourthQuadrantNote.map((note, j) => (
                          <PreviewCardV2
                            key={`fourth-quadrant-${j}`}
                            title=""
                            value={note}
                            size="sm"
                          />
                        ))}
                      </Box>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Diagnosis */}
              {item.diagnosis && (
                <Box mb={4}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="blue.blue500"
                    mb={2}
                  >
                    Diagnosis
                  </Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {item.diagnosis.diagnosisList?.length > 0 && (
                      <Box mb={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          Diagnosis List
                        </Text>
                        {item.diagnosis.diagnosisList.map((diagnosis, j) => (
                          <PreviewCardV2
                            key={`diagnosis-${j}`}
                            title=""
                            value={diagnosis}
                            size="sm"
                          />
                        ))}
                      </Box>
                    )}
                    {item.diagnosis.diagnosisNotes?.length > 0 && (
                      <Box mb={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          Diagnosis Notes
                        </Text>
                        {item.diagnosis.diagnosisNotes.map((note, j) => (
                          <PreviewCardV2
                            key={`diagnosis-note-${j}`}
                            title=""
                            value={note}
                            size="sm"
                          />
                        ))}
                      </Box>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Treatment Plan */}
              {item.treatmentPlan && (
                <Box mb={4}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="blue.blue500"
                    mb={2}
                  >
                    Treatment Plan
                  </Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {item.treatmentPlan.proposedTreatments?.length > 0 && (
                      <Box mb={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          Proposed Treatments
                        </Text>
                        {item.treatmentPlan.proposedTreatments.map(
                          (treatment, j) => (
                            <PreviewCardV2
                              key={`treatment-${j}`}
                              title=""
                              value={treatment}
                              size="sm"
                            />
                          )
                        )}
                      </Box>
                    )}
                    {item.treatmentPlan.priorityAndUrgency && (
                      <PreviewCardV2
                        title="Priority and Urgency"
                        value={item.treatmentPlan.priorityAndUrgency}
                        size="sm"
                      />
                    )}
                  </Grid>
                </Box>
              )}

              {/* Procedure Performed */}
              {item.procedurePerformed && (
                <Box mb={4}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="blue.blue500"
                    mb={2}
                  >
                    Procedure Performed
                  </Text>
                  <SimpleGrid columns={2} spacing={2} mb={3}>
                    {item.procedurePerformed.procedureDate && (
                      <PreviewCardV2
                        title="Procedure Date"
                        value={moment(
                          item.procedurePerformed.procedureDate
                        ).format("ll")}
                        size="sm"
                      />
                    )}
                    {item.procedurePerformed.toothNumbersTreated && (
                      <PreviewCardV2
                        title="Tooth Numbers Treated"
                        value={item.procedurePerformed.toothNumbersTreated}
                        size="sm"
                      />
                    )}
                    {item.procedurePerformed.anesthesiaDetails && (
                      <PreviewCardV2
                        title="Anesthesia Details"
                        value={item.procedurePerformed.anesthesiaDetails}
                        size="sm"
                      />
                    )}
                    {item.procedurePerformed.materialsUsed && (
                      <PreviewCardV2
                        title="Materials Used"
                        value={item.procedurePerformed.materialsUsed}
                        size="sm"
                      />
                    )}
                  </SimpleGrid>
                  {item.procedurePerformed.descriptionOfProcedure?.length >
                    0 && (
                    <Box mb={3}>
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.600"
                      >
                        Description of Procedure
                      </Text>
                      {item.procedurePerformed.descriptionOfProcedure.map(
                        (desc, j) => (
                          <PreviewCardV2
                            key={`procedure-desc-${j}`}
                            title=""
                            value={desc}
                            size="sm"
                          />
                        )
                      )}
                    </Box>
                  )}
                  {item.procedurePerformed.procedureNotes && (
                    <PreviewCardV2
                      title="Procedure Notes"
                      value={item.procedurePerformed.procedureNotes}
                      size="sm"
                    />
                  )}
                  {item.procedurePerformed.postProcedureCareInstructions && (
                    <PreviewCardV2
                      title="Post Procedure Care"
                      value={
                        item.procedurePerformed.postProcedureCareInstructions
                      }
                      size="sm"
                    />
                  )}
                </Box>
              )}
            </Box>
          ))}
        </VStack>
      </Box>

      <Pagination
        postPerPage={PostPerPage}
        currentPage={CurrentPage}
        totalPosts={(FilteredData || FilterData).length}
        paginate={paginate}
      />
    </Box>
  );
}
