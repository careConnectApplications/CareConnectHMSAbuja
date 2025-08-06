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
  SimpleGrid,
  Grid,
  GridItem,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import Button from "../Components/Button";
import Input from "../Components/Input";
import PreviewCardV2 from "../Components/PreviewCardV2";
import ShowToast from "../Components/ToastNotification";
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { GetAllPhysiotherapyAssessmentByPatientApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";
import { SlPlus } from "react-icons/sl";
import { useNavigate, useLocation } from "react-router-dom";
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import { BsCalendar2DateFill } from "react-icons/bs";

export default function PhysiotherapyAssessments({ hide = false }) {
  const [IsLoading, setIsLoading] = useState(true);
  const [All, setAll] = useState(true);
  const [InProgress, setInProgress] = useState(false);
  const [Completed, setCompleted] = useState(false);
  const [Data, setData] = useState([]);
  const [FilterData, setFilterData] = useState([]);
  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null);
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const GetPhysiotherapyAssessments = async () => {
    setIsLoading(true);
    try {
      const result = await GetAllPhysiotherapyAssessmentByPatientApi(id);
      console.log("API Response:", result);

      if (result.status === 200) {
        setIsLoading(false);
        const assessments = result.data.queryresult?.assessments || [];
        console.log("Assessments Data:", assessments);
        setFilterData(assessments);
        setData(assessments);
      } else {
        setIsLoading(false);
        activateNotifications(
          "Failed to load physiotherapy assessments",
          "error"
        );
      }
    } catch (e) {
      console.error("API Error:", e);
      setIsLoading(false);
      activateNotifications(e.message, "error");
    }
  };

  const activateNotifications = (message, status) => {
    setShowToast({
      show: true,
      message: message,
      status: status,
    });
    setTimeout(() => {
      setShowToast({ show: false });
    }, 10000);
  };

  const filterBy = (title) => {
    if (title === "appointmentId") {
      let filter = Data.filter((item) =>
        item.admissionId?.toLowerCase().includes(SearchInput.toLowerCase())
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
    setInProgress(false);
    setCompleted(false);
    setFilterData(Data);
    setFilteredData(null);
    setSearchInput("");
    setByDate(false);
    setStartDate("");
    setEndDate("");
  };

  const filterInProgress = () => {
    setAll(false);
    setInProgress(true);
    setCompleted(false);
    const filterData = Data.filter((item) => item.status === "inprogress");
    setFilterData(filterData);
    setFilteredData(null);
    setSearchInput("");
    setByDate(false);
    setStartDate("");
    setEndDate("");
  };

  const filterCompleted = () => {
    setAll(false);
    setInProgress(false);
    setCompleted(true);
    const filterData = Data.filter((item) => item.status === "complete");
    setFilterData(filterData);
    setFilteredData(null);
    setSearchInput("");
    setByDate(false);
    setStartDate("");
    setEndDate("");
  };

  const nav = useNavigate();
  const { pathname } = useLocation();

  const AddNewAssessment = () => {
    nav(`/dashboard/add-physiotherapy-assessment/${id}`);
    localStorage.setItem("pathname", pathname);
  };

  const EditAssessment = (item) => {
    // Store the complete assessment object in localStorage
    localStorage.setItem("PhysiotherapyAssessment", JSON.stringify(item));

    // Navigate to the edit page
    nav(`/dashboard/edit-physiotherapy-assessment/${id}`);
    localStorage.setItem("pathname", pathname);
  };

  useEffect(() => {
    GetPhysiotherapyAssessments();
  }, [isOpen]);

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
          <Box
            borderRight="1px solid #EDEFF2"
            pr="5px"
            onClick={filterInProgress}
          >
            <Text
              py="8.5px"
              px="12px"
              bg={InProgress ? "#fff" : "transparent"}
              rounded="7px"
              color={"#1F2937"}
              fontWeight={"500"}
              fontSize={"13px"}
            >
              In Progress
            </Text>
          </Box>
          <Box
            borderRight="1px solid #EDEFF2"
            pr="5px"
            onClick={filterCompleted}
          >
            <Text
              py="8.5px"
              px="12px"
              bg={Completed ? "#fff" : "transparent"}
              rounded="7px"
              color={"#1F2937"}
              fontWeight={"500"}
              fontSize={"13px"}
            >
              Completed
            </Text>
          </Box>
        </Flex>

        {hide === false && (
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
        )}
      </Flex>

      {hide === false && (
        <Flex
          justifyContent="space-between"
          flexWrap="wrap"
          mt={["10px", "10px", "10px", "10px"]}
          w={["100%", "100%", "50%", "37%"]}
        >
          <Button
            w={["100%", "100%", "200px", "200px"]}
            h={["48px", "48px", "56px", "56px"]}
            px={["16px", "16px", "24px", "24px"]}
            py={["12px", "12px", "16px", "16px"]}
            onClick={AddNewAssessment}
            rightIcon={<SlPlus />}
          >
            Add New Assessment
          </Button>
        </Flex>
      )}

      {/* Assessments List */}
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="15px"
        px="15px"
        rounded="10px"
      >
        <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">
          Previous Physiotherapy Assessments
        </Text>
        {PaginatedData.length === 0 && !IsLoading && (
          <Text fontSize="14px" color="gray.500" textAlign="center">
            No physiotherapy assessments found.
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
                  onClick={() => EditAssessment(item)}
                >
                  Edit Assessment
                </Text>
              </HStack>

              {/* Two-column layout for assessment data */}
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {/* Column 1 */}
                <GridItem>
                  {/* Clinical Assessment */}
                  {item.clinicalassessment && (
                    <Box mb={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="blue.blue500"
                        mb={2}
                      >
                        Clinical Assessment
                      </Text>

                      {/* Chief Complaint */}
                      {item.clinicalassessment.chiefComplaint?.length > 0 && (
                        <Box mb={3}>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            Chief Complaint
                          </Text>
                          {item.clinicalassessment.chiefComplaint.map(
                            (complaint, j) => (
                              <PreviewCardV2
                                key={`chief-complaint-${j}`}
                                title=""
                                value={complaint}
                                size="sm"
                              />
                            )
                          )}
                        </Box>
                      )}

                      {/* History of Present Condition */}
                      {item.clinicalassessment.historyOfPresentCondition
                        ?.length > 0 && (
                        <Box mb={3}>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            History of Present Condition
                          </Text>
                          {item.clinicalassessment.historyOfPresentCondition.map(
                            (history, j) => (
                              <PreviewCardV2
                                key={`history-${j}`}
                                title=""
                                value={history}
                                size="sm"
                              />
                            )
                          )}
                        </Box>
                      )}

                      {/* Medical History */}
                      {item.clinicalassessment.medicalHistory?.length > 0 && (
                        <Box mb={3}>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            Medical History
                          </Text>
                          {item.clinicalassessment.medicalHistory.map(
                            (history, j) => (
                              <PreviewCardV2
                                key={`medical-${j}`}
                                title=""
                                value={history}
                                size="sm"
                              />
                            )
                          )}
                        </Box>
                      )}

                      {/* Surgical History */}
                      {item.clinicalassessment.surgicalHistory?.length > 0 && (
                        <Box mb={3}>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            Surgical History
                          </Text>
                          {item.clinicalassessment.surgicalHistory.map(
                            (history, j) => (
                              <PreviewCardV2
                                key={`surgical-${j}`}
                                title=""
                                value={history}
                                size="sm"
                              />
                            )
                          )}
                        </Box>
                      )}

                      {/* Medications */}
                      {item.clinicalassessment.medications?.length > 0 && (
                        <Box mb={3}>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            Medications
                          </Text>
                          {item.clinicalassessment.medications.map(
                            (medication, j) => (
                              <PreviewCardV2
                                key={`medication-${j}`}
                                title=""
                                value={medication}
                                size="sm"
                              />
                            )
                          )}
                        </Box>
                      )}

                      {/* Previous Treatments */}
                      {item.clinicalassessment.previousTreatments?.length >
                        0 && (
                        <Box mb={3}>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            Previous Treatments
                          </Text>
                          {item.clinicalassessment.previousTreatments.map(
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
                    </Box>
                  )}

                  {/* Physical Examination */}
                  {item.physicalexamination && (
                    <Box mb={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="blue.blue500"
                        mb={2}
                      >
                        Physical Examination
                      </Text>

                      {/* Vital Signs */}
                      <SimpleGrid columns={2} spacing={2} mb={3}>
                        {item.physicalexamination.bloodPressure && (
                          <PreviewCardV2
                            title="Blood Pressure"
                            value={item.physicalexamination.bloodPressure}
                            size="sm"
                          />
                        )}
                        {item.physicalexamination.pulse && (
                          <PreviewCardV2
                            title="Pulse"
                            value={item.physicalexamination.pulse}
                            size="sm"
                          />
                        )}
                        {item.physicalexamination.respiratoryRate && (
                          <PreviewCardV2
                            title="Respiratory Rate"
                            value={item.physicalexamination.respiratoryRate}
                            size="sm"
                          />
                        )}
                        {item.physicalexamination.temperature && (
                          <PreviewCardV2
                            title="Temperature"
                            value={item.physicalexamination.temperature}
                            size="sm"
                          />
                        )}
                      </SimpleGrid>

                      {/* Muscle Strength Testing */}
                      {item.physicalexamination.muscleStrengthTesting?.length >
                        0 && (
                        <Box mb={3}>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            Muscle Strength Testing
                          </Text>
                          {item.physicalexamination.muscleStrengthTesting.map(
                            (test, j) => (
                              <PreviewCardV2
                                key={`muscle-${j}`}
                                title=""
                                value={test}
                                size="sm"
                              />
                            )
                          )}
                        </Box>
                      )}

                      {/* Postural Assessment */}
                      {item.physicalexamination.posturalAssessment?.length >
                        0 && (
                        <Box mb={3}>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            Postural Assessment
                          </Text>
                          {item.physicalexamination.posturalAssessment.map(
                            (assessment, j) => (
                              <PreviewCardV2
                                key={`posture-${j}`}
                                title=""
                                value={assessment}
                                size="sm"
                              />
                            )
                          )}
                        </Box>
                      )}
                    </Box>
                  )}
                </GridItem>

                {/* Column 2 */}
                <GridItem>
                  {/* Continue Physical Examination */}
                  {item.physicalexamination && (
                    <Box mb={4}>
                      {/* Gait Analysis */}
                      {item.physicalexamination.gaitAnalysis?.length > 0 && (
                        <Box mb={3}>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            Gait Analysis
                          </Text>
                          {item.physicalexamination.gaitAnalysis.map(
                            (analysis, j) => (
                              <PreviewCardV2
                                key={`gait-${j}`}
                                title=""
                                value={analysis}
                                size="sm"
                              />
                            )
                          )}
                        </Box>
                      )}

                      {/* Palpation Findings */}
                      {item.physicalexamination.palpationFindings?.length >
                        0 && (
                        <Box mb={3}>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            Palpation Findings
                          </Text>
                          {item.physicalexamination.palpationFindings.map(
                            (finding, j) => (
                              <PreviewCardV2
                                key={`palpation-${j}`}
                                title=""
                                value={finding}
                                size="sm"
                              />
                            )
                          )}
                        </Box>
                      )}

                      {/* Special Tests */}
                      {item.physicalexamination.specialTests?.length > 0 && (
                        <Box mb={3}>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            Special Tests
                          </Text>
                          {item.physicalexamination.specialTests.map(
                            (test, j) => (
                              <PreviewCardV2
                                key={`special-test-${j}`}
                                title=""
                                value={test}
                                size="sm"
                              />
                            )
                          )}
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Range of Motion */}
                  {item.rangeofmotion && (
                    <Box mb={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="blue.blue500"
                        mb={2}
                      >
                        Range of Motion
                      </Text>

                      <SimpleGrid columns={2} spacing={2} mb={3}>
                        {item.rangeofmotion.affectedBodyPart && (
                          <PreviewCardV2
                            title="Affected Body Part"
                            value={item.rangeofmotion.affectedBodyPart}
                            size="sm"
                          />
                        )}
                        {item.rangeofmotion.slideOfBody && (
                          <PreviewCardV2
                            title="Side of Body"
                            value={item.rangeofmotion.slideOfBody}
                            size="sm"
                          />
                        )}
                        {item.rangeofmotion.jointName && (
                          <PreviewCardV2
                            title="Joint Name"
                            value={item.rangeofmotion.jointName}
                            size="sm"
                          />
                        )}
                        {item.rangeofmotion.movementType && (
                          <PreviewCardV2
                            title="Movement Type"
                            value={item.rangeofmotion.movementType}
                            size="sm"
                          />
                        )}
                        {item.rangeofmotion.activeRangeOfMotion && (
                          <PreviewCardV2
                            title="Active ROM"
                            value={item.rangeofmotion.activeRangeOfMotion}
                            size="sm"
                          />
                        )}
                        {item.rangeofmotion.passiveRangeOfMotion && (
                          <PreviewCardV2
                            title="Passive ROM"
                            value={item.rangeofmotion.passiveRangeOfMotion}
                            size="sm"
                          />
                        )}
                        {item.rangeofmotion.normalRangeOfMotion && (
                          <PreviewCardV2
                            title="Normal ROM"
                            value={item.rangeofmotion.normalRangeOfMotion}
                            size="sm"
                          />
                        )}
                        {item.rangeofmotion.ROMDeficit && (
                          <PreviewCardV2
                            title="ROM Deficit"
                            value={item.rangeofmotion.ROMDeficit}
                            size="sm"
                          />
                        )}
                        {item.rangeofmotion.painLevelDuringMovement && (
                          <PreviewCardV2
                            title="Pain Level"
                            value={item.rangeofmotion.painLevelDuringMovement}
                            size="sm"
                          />
                        )}
                        {item.rangeofmotion.endFeel && (
                          <PreviewCardV2
                            title="End Feel"
                            value={item.rangeofmotion.endFeel}
                            size="sm"
                          />
                        )}
                        {item.rangeofmotion.assessmentToolUsed && (
                          <PreviewCardV2
                            title="Assessment Tool"
                            value={item.rangeofmotion.assessmentToolUsed}
                            size="sm"
                          />
                        )}
                        {item.rangeofmotion.functionalImpact && (
                          <PreviewCardV2
                            title="Functional Impact"
                            value={item.rangeofmotion.functionalImpact}
                            size="sm"
                          />
                        )}
                        {item.rangeofmotion.progressNotes && (
                          <PreviewCardV2
                            title="Progress Notes"
                            value={item.rangeofmotion.progressNotes}
                            size="sm"
                          />
                        )}
                      </SimpleGrid>

                      {/* Range of Motion Notes */}
                      {item.rangeofmotion.notes?.length > 0 && (
                        <Box mb={3}>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            ROM Notes
                          </Text>
                          {item.rangeofmotion.notes.map((note, j) => (
                            <PreviewCardV2
                              key={`rom-note-${j}`}
                              title=""
                              value={note}
                              size="sm"
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Outcome Measures */}
                  {item.outcomeMeasures && (
                    <Box mb={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="blue.blue500"
                        mb={2}
                      >
                        Outcome Measures
                      </Text>

                      <SimpleGrid columns={2} spacing={2} mb={3}>
                        {item.outcomeMeasures.visualAnalogScaleForPain && (
                          <PreviewCardV2
                            title="VAS Pain"
                            value={
                              item.outcomeMeasures.visualAnalogScaleForPain
                            }
                            size="sm"
                          />
                        )}
                        {item.outcomeMeasures.oswestryDisabilityIndex && (
                          <PreviewCardV2
                            title="Oswestry Index"
                            value={item.outcomeMeasures.oswestryDisabilityIndex}
                            size="sm"
                          />
                        )}
                        {item.outcomeMeasures.timeUpAndGoTest && (
                          <PreviewCardV2
                            title="Time Up & Go"
                            value={item.outcomeMeasures.timeUpAndGoTest}
                            size="sm"
                          />
                        )}
                        {item.outcomeMeasures.sixMinutesWalkTest && (
                          <PreviewCardV2
                            title="6 Min Walk Test"
                            value={item.outcomeMeasures.sixMinutesWalkTest}
                            size="sm"
                          />
                        )}
                      </SimpleGrid>

                      {/* Outcome Measure Notes */}
                      {item.outcomeMeasures.outcomeMeasureNotes?.length > 0 && (
                        <Box mb={3}>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            Outcome Notes
                          </Text>
                          {item.outcomeMeasures.outcomeMeasureNotes.map(
                            (note, j) => (
                              <PreviewCardV2
                                key={`outcome-note-${j}`}
                                title=""
                                value={note}
                                size="sm"
                              />
                            )
                          )}
                        </Box>
                      )}
                    </Box>
                  )}
                </GridItem>
              </Grid>

              {/* Full-width sections below the two columns */}
              {/* Diagnosis and Clinical Impression */}
              {item.diagnosisandclinicalImpression && (
                <Box mb={4}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="blue.blue500"
                    mb={2}
                  >
                    Diagnosis and Clinical Impression
                  </Text>

                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {/* Diagnosis ICD-11 */}
                    {item.diagnosisandclinicalImpression.diagnosisICDEleven
                      ?.length > 0 && (
                      <Box mb={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          Diagnosis (ICD-11)
                        </Text>
                        {item.diagnosisandclinicalImpression.diagnosisICDEleven.map(
                          (diagnosis, j) => (
                            <PreviewCardV2
                              key={`diagnosis-${j}`}
                              title=""
                              value={diagnosis}
                              size="sm"
                            />
                          )
                        )}
                      </Box>
                    )}

                    {/* Primary Diagnosis Notes */}
                    {item.diagnosisandclinicalImpression.primaryDiagnosisNotes
                      ?.length > 0 && (
                      <Box mb={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          Primary Diagnosis Notes
                        </Text>
                        {item.diagnosisandclinicalImpression.primaryDiagnosisNotes.map(
                          (note, j) => (
                            <PreviewCardV2
                              key={`primary-note-${j}`}
                              title=""
                              value={note}
                              size="sm"
                            />
                          )
                        )}
                      </Box>
                    )}

                    {/* Secondary Diagnosis Notes */}
                    {item.diagnosisandclinicalImpression.secondaryDiagnosisNotes
                      ?.length > 0 && (
                      <Box mb={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          Secondary Diagnosis Notes
                        </Text>
                        {item.diagnosisandclinicalImpression.secondaryDiagnosisNotes.map(
                          (note, j) => (
                            <PreviewCardV2
                              key={`secondary-note-${j}`}
                              title=""
                              value={note}
                              size="sm"
                            />
                          )
                        )}
                      </Box>
                    )}

                    {/* Clinical Impressions */}
                    {item.diagnosisandclinicalImpression.clinicalImpressions
                      ?.length > 0 && (
                      <Box mb={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          Clinical Impressions
                        </Text>
                        {item.diagnosisandclinicalImpression.clinicalImpressions.map(
                          (impression, j) => (
                            <PreviewCardV2
                              key={`impression-${j}`}
                              title=""
                              value={impression}
                              size="sm"
                            />
                          )
                        )}
                      </Box>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Treatment Plan and Goals */}
              {item.treatmentplanandgoals && (
                <Box mb={4}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="blue.blue500"
                    mb={2}
                  >
                    Treatment Plan and Goals
                  </Text>

                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {/* Short Term Goals */}
                    {item.treatmentplanandgoals.shortTermGoals?.length > 0 && (
                      <Box mb={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          Short Term Goals
                        </Text>
                        {item.treatmentplanandgoals.shortTermGoals.map(
                          (goal, j) => (
                            <PreviewCardV2
                              key={`short-goal-${j}`}
                              title=""
                              value={goal}
                              size="sm"
                            />
                          )
                        )}
                      </Box>
                    )}

                    {/* Long Term Goals */}
                    {item.treatmentplanandgoals.longTermGoals?.length > 0 && (
                      <Box mb={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          Long Term Goals
                        </Text>
                        {item.treatmentplanandgoals.longTermGoals.map(
                          (goal, j) => (
                            <PreviewCardV2
                              key={`long-goal-${j}`}
                              title=""
                              value={goal}
                              size="sm"
                            />
                          )
                        )}
                      </Box>
                    )}

                    {/* Intervention */}
                    {item.treatmentplanandgoals.intervention?.length > 0 && (
                      <Box mb={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          Intervention
                        </Text>
                        {item.treatmentplanandgoals.intervention.map(
                          (intervention, j) => (
                            <PreviewCardV2
                              key={`intervention-${j}`}
                              title=""
                              value={intervention}
                              size="sm"
                            />
                          )
                        )}
                      </Box>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Functional Limitations */}
              {item.functionalLimitations?.length > 0 && (
                <Box mb={4}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="blue.blue500"
                    mb={2}
                  >
                    Functional Limitations
                  </Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {item.functionalLimitations.map((limitation, j) => (
                      <Box key={`limitation-${j}`}>
                        <PreviewCardV2 title="" value={limitation} size="sm" />
                      </Box>
                    ))}
                  </Grid>
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
