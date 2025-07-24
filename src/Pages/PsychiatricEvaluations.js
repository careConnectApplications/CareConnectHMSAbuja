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
} from "@chakra-ui/react";
import moment from "moment";
import Button from "../Components/Button";
import Input from "../Components/Input";
import PreviewCardV2 from "../Components/PreviewCardV2";
import ShowToast from "../Components/ToastNotification";
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { GetPsychiatricEvaluationByIdApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";
import { SlPlus } from "react-icons/sl";
import { useNavigate, useLocation } from "react-router-dom";
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import { BsCalendar2DateFill } from "react-icons/bs";

export default function PsychiatricEvaluations({ hide = false }) {
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

  const GetPsychiatricEvaluations = async () => {
    setIsLoading(true);
    try {
      const result = await GetPsychiatricEvaluationByIdApi(id);
      if (result.status === true) {
        setIsLoading(false);
        setFilterData(result.queryresult.evaluations);
        setData(result.queryresult.evaluations);
      }
    } catch (e) {
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
        item.appointmentId?.appointmentid
          ?.toLowerCase()
          .includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "appointmentCategory") {
      let filter = Data.filter((item) =>
        item.appointmentId?.appointmentcategory
          ?.toLowerCase()
          .includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "appointmentType") {
      let filter = Data.filter((item) =>
        item.appointmentId?.appointmenttype
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
    const filterData = Data.filter(
      (item) => item.appointmentId?.status === "inprogress"
    );
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
    const filterData = Data.filter(
      (item) => item.appointmentId?.status === "complete"
    );
    setFilterData(filterData);
    setFilteredData(null);
    setSearchInput("");
    setByDate(false);
    setStartDate("");
    setEndDate("");
  };

  const nav = useNavigate();
  const { pathname } = useLocation();

  const AddNewEvaluation = () => {
    nav(`/dashboard/add-psychiatric-evaluation/${id}`);
    localStorage.setItem("pathname", pathname);
  };

  const EditEvaluation = (item) => {
    localStorage.setItem("PsychiatricEvaluation", JSON.stringify(item));
    nav(`/dashboard/edit-psychiatric-evaluation/${id}`);
    localStorage.setItem("pathname", pathname);
  };

  const EvaluationFollowUp = (id) => {
    nav(`/dashboard/psychiatric-evaluation-follow-up/${id}`);
    localStorage.setItem("pathname", pathname);
  };

  useEffect(() => {
    GetPsychiatricEvaluations();
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
      onClick={AddNewEvaluation}
      rightIcon={<SlPlus />}
    >
      Add New Evaluation
    </Button>
  </Flex>
)}

      {/* Evaluations List */}
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="15px"
        px="15px"
        rounded="10px"
        overflowX="auto"
      >
        <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">
          Previous Psychiatric Evaluations
        </Text>
        {PaginatedData.length === 0 && !IsLoading && (
          <Text fontSize="14px" color="gray.500" textAlign="center">
            No psychiatric evaluations found.
          </Text>
        )}
        {PaginatedData.map((item, i) => (
          <Box key={i} mt="20px">
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
                onClick={() => EditEvaluation(item)}
              >
                Edit Evaluation
              </Text>
            </HStack>

            {item.presentingcomplaints?.length > 0 && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight="700"
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  Presenting Complaints
                </Text>
                {item.presentingcomplaints.map((complaint, j) => (
                  <Box key={j}>
                    <PreviewCardV2 title="" value={complaint} />
                    <br />
                  </Box>
                ))}
              </Box>
            )}

            {item.historyofpresentingcomplaints?.length > 0 && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight="700"
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  History of Presenting Complaints
                </Text>
                {item.historyofpresentingcomplaints.map((history, j) => (
                  <Box key={j}>
                    <PreviewCardV2 title="" value={history} />
                    <br />
                  </Box>
                ))}
              </Box>
            )}

            {item.pastpsychiatrichistory?.length > 0 && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight="700"
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  Past Psychiatric History
                </Text>
                {item.pastpsychiatrichistory.map((history, j) => (
                  <Box key={j}>
                    <PreviewCardV2 title="" value={history} />
                    <br />
                  </Box>
                ))}
              </Box>
            )}

            {item.pastmedicalandsurgicalhistory?.length > 0 && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight="700"
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  Past Medical and Surgical History
                </Text>
                {item.pastmedicalandsurgicalhistory.map((history, j) => (
                  <Box key={j}>
                    <PreviewCardV2 title="" value={history} />
                    <br />
                  </Box>
                ))}
              </Box>
            )}

            {item.familyhistory?.length > 0 && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight="700"
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  Family History
                </Text>
                {item.familyhistory.map((history, j) => (
                  <Box key={j}>
                    <PreviewCardV2 title="" value={history} />
                    <br />
                  </Box>
                ))}
              </Box>
            )}

            {item.personaldevelopmenthistory?.length > 0 && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight="700"
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  Personal Development History
                </Text>
                {item.personaldevelopmenthistory.map((history, j) => (
                  <Box key={j}>
                    <PreviewCardV2 title="" value={history} />
                    <br />
                  </Box>
                ))}
              </Box>
            )}

            {item.educationhistory?.length > 0 && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight="700"
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  Education History
                </Text>
                {item.educationhistory.map((history, j) => (
                  <Box key={j}>
                    <PreviewCardV2 title="" value={history} />
                    <br />
                  </Box>
                ))}
              </Box>
            )}

            {item.occupationhistory?.length > 0 && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight="700"
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  Occupation History
                </Text>
                {item.occupationhistory.map((history, j) => (
                  <Box key={j}>
                    <PreviewCardV2 title="" value={history} />
                    <br />
                  </Box>
                ))}
              </Box>
            )}

            {item.psychosocialhistory?.length > 0 && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight="700"
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  Psychosocial History
                </Text>
                {item.psychosocialhistory.map((history, j) => (
                  <Box key={j}>
                    <PreviewCardV2 title="" value={history} />
                    <br />
                  </Box>
                ))}
              </Box>
            )}

            {item.substanceusehistory?.length > 0 && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight="700"
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  Substance Use History
                </Text>
                {item.substanceusehistory.map((history, j) => (
                  <Box key={j}>
                    <PreviewCardV2 title="" value={history} />
                    <br />
                  </Box>
                ))}
              </Box>
            )}

            {item.forensichistory?.length > 0 && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight="700"
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  Forensic History
                </Text>
                {item.forensichistory.map((history, j) => (
                  <Box key={j}>
                    <PreviewCardV2 title="" value={history} />
                    <br />
                  </Box>
                ))}
              </Box>
            )}

            {item.premorbidhistory?.length > 0 && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight="700"
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  Premorbid History
                </Text>
                {item.premorbidhistory.map((history, j) => (
                  <Box key={j}>
                    <PreviewCardV2 title="" value={history} />
                    <br />
                  </Box>
                ))}
              </Box>
            )}

            {item.assessmentdiagnosis?.length > 0 && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight="700"
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  Assessment Diagnosis
                </Text>
                {item.assessmentdiagnosis.map((diagnosis, j) => (
                  <Box key={j}>
                    <PreviewCardV2 title="" value={diagnosis} />
                    <br />
                  </Box>
                ))}
              </Box>
            )}

            {item.planmanagement?.length > 0 && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight="700"
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  Plan Management
                </Text>
                {item.planmanagement.map((plan, j) => (
                  <Box key={j}>
                    <PreviewCardV2 title="" value={plan} />
                    <br />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
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
