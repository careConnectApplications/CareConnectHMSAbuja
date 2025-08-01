import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layouts/Index";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import TableRow from "../Components/TableRow";
import Input from "../Components/Input";
import Button from "../Components/Button";
import ShowToast from "../Components/ToastNotification";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import moment from "moment";
import Seo from "../Utils/Seo";
import CreateHistopathologyResult from "../Components/CreateHistopathologyResult";
import CreateHistopathologyModal from "../Components/CreateHistopathologyModal";
import ConfirmLabOrderModal from "../Components/ConfirmLabOrderModal";
import { GetAllHistopathologyApi, GetAllHistopathologyFilteredApi,GetSingleHistopathologyApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";
import { SlPlus } from "react-icons/sl";
import { FaCalendarAlt } from "react-icons/fa";

export default function HistopathologyReport() {
  const [IsLoading, setIsLoading] = useState(true);
  const [Data, setData] = useState([]);
  const [QueueData, setQueueData] = useState([]);
  // FilterData holds the current items after filtering by search, status, etc.
  const [FilterData, setFilterData] = useState([]);
  const [ModalState, setModalState] = useState("");
  const [OpenOrderModal, setOpenOrderModal] = useState(false);
  const [OldPayload, setOldPayload] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Used to trigger refresh when a new order is created
  const [Trigger, setTrigger] = useState(false);

  // New disclosure for ConfirmLabOrderModal
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const [Scheduled, setScheduled] = useState(true);
  const [AwaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [Processed, setProcessed] = useState(true);

  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");

  // Pagination settings
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);
  const [TotalData, setTotalData] = useState("");
  const [ResultData, setResultData] = useState({});
  const [Status, setStatus] = useState("processed");


  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Search Filter settings
  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null);

  const [Key, setKey] = useState("");
  const [Value, setValue] = useState("");


  const getFilteredScheduledlab = async (key, value) => {
    setKey(key)
    setValue(value)

    try {
      setIsLoading(true);
      const result = await GetAllHistopathologyFilteredApi(PostPerPage, CurrentPage, Status, key, value);
      console.log("all fitlered Lab", result);
      if (result.status === true) {

        setFilteredData(result.queryresult.labdetails);
        setTotalData(result.queryresult.totallabdetails)
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBy = (title) => {

    if (title === "mrn") {
      getFilteredScheduledlab("MRN", SearchInput)
    } else if (title === "firstName") {

      getFilteredScheduledlab("firstName", SearchInput)

    } else if (title === "lastName") {

      getFilteredScheduledlab("lastName", SearchInput)

    } else if (title === "testName") {

      getFilteredScheduledlab("testname", SearchInput)

    } else if (title === "date") {
      let endDateObj = new Date(EndDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      let formatedEndDate = endDateObj.toISOString().split("T")[0];
      let filter = Data.filter(
        (item) =>
          item.createdAt >= StartDate && item.createdAt <= formatedEndDate
      );
      setFilteredData(filter);
      setSearchInput("s");
      console.log("Date filter checking", filter);
    }

  };

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const RequestOrder = () => {
    setOpenOrderModal(true);
  };

  const nav = useNavigate();

  // New status filter state
  const [currentStatusFilter, setCurrentStatusFilter] = useState("all");



  const getAllScheduledPathology  = async (status) => {
    setIsLoading(true);
    try {
      const result = await GetAllHistopathologyApi(PostPerPage, CurrentPage, status);
      console.log("getAllScheduledPathology", result);
      if (result.status === true) {
        setIsLoading(false);
        setData(result.data.results);
        setFilterData(result.data.results);
        setTotalData(result.data.totalCount)
      }
    } catch (e) {
      console.error(e.message);
    }
  };


  const getSinglehistopathology = async (name,id) => {
    setIsLoading(true);
    try {
      const result = await GetSingleHistopathologyApi(name,id);
      console.log("getSinglehistopathology", result);
      if (result.status === true) {
        setIsLoading(false);
       setResultData(result.data[0]);
      }
    } catch (e) {
      console.error(e.message);
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
    }, 3000);
  };


  // Default filter: show all items
  

  const filterAll = () => {
   
    setProcessed(true);
    getAllScheduledPathology("processed")
    setStatus("processed")
    setCurrentPage(1)
  };
 



  // ProcessLab is used for non-confirmation actions
  const ProcessLab = (item) => {
    setOldPayload(item);
    onOpen();
  };

  // confirmLab opens the ConfirmLabOrderModal for items with "awaiting confirmation" status.
  const confirmLab = (item) => {
    console.log("confirmLab called with item:", item);
    setOldPayload(item);
    onConfirmOpen();
  };

  // Re-fetch lab orders whenever a modal closes or after a new order is created.
  useEffect(() => {
    if (FilteredData?.length > 0 || FilteredData !== null) {
      getFilteredScheduledlab(Key,Value) 
    } else {

        getAllScheduledPathology("processed")

    }
  }, [isOpen, Trigger, CurrentPage]);

  return (
    <MainLayout>
      {IsLoading && <Preloader />}
      <Seo
        title="Histopathology"
        description="Care connect Manage Histopathology"
      />

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Histopathology
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({TotalData})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        Create a new test order for a patient.
      </Text>
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py={["10px", "15px"]}
        px={["10px", "15px"]}
        rounded="10px"
      >
        <Flex justifyContent="space-between" flexWrap="wrap">
          {/* Status Filter Section */}
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
                bg={Processed ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                All

              </Text>
            </Box>

          </Flex>

          {/* Additional Filter Section (Search & Date Filter) */}
          <Flex
            justifyContent="space-between"
            flexWrap="wrap"
            mt={["10px", "10px", "0px", "0px"]}
          >
            <HStack flexWrap={["wrap", "nowrap"]}>
              {ByDate === false ? (
                <Input
                  label="Search"
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setCurrentPage(1)
                  }}
                  value={SearchInput}
                  bColor="#E4E4E4"
                  leftIcon={<BiSearch />}
                />
              ) : (
                <HStack flexWrap={["wrap", "nowrap"]}>
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
                    onClick={() => filterBy("firstName")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by First Name</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("lastName")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Last Name</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("mrn")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by MRN</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("testName")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Test Name</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => setByDate(true)}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by date</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setFilteredData(null);
                      setSearchInput("");
                      setByDate(false);
                      setStartDate("");
                      setEndDate("");
                      filterAll()
                      setCurrentPage(1) 
                    }}
                    textTransform="capitalize"
                    fontWeight="500"
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
              w={["100%", "100%", "144px", "144px"]}
              onClick={RequestOrder}
            >
              Request Order
            </Button>
          </Flex>
      </Box>

      {/* Data Table */}
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="15px"
        px="15px"
        rounded="10px"
        overflowX="auto"
      >
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Patient name
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Test Name
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                 biopsy Type
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  lmp
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                 phone Number
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                 previous Biopsy
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                whole Organ
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Lab Status
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Payment Status
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {SearchInput === "" || FilteredData === null ? (
                FilterData?.map((item, i) => (
                  <TableRow
                    key={i}
                    type="histopatholgy-report"
                    name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                    testName={item.testName}
                    biopsyType={item.diagnosisForm?.biopsyType}
                    mrn={item.patient?.mrn}
                    phone={item.diagnosisForm?.phoneNumber}
                    previousBiopsy={item.diagnosisForm?.previousBiopsy ? "Yes" : "No"}
                    lmp={moment(item.diagnosisForm?.lmp).format("lll")}
                    wholeOrgan={item.diagnosisForm?.wholeOrgan}
                    labStatus={item.testPaymentStatus}
                    status={item.paymentInfo?.status}
                    onClick={()=>getSinglehistopathology(item.testName,item.histopathologyId) }
                  />
                ))
              ) : SearchInput !== "" && FilteredData?.length > 0 ? (
                FilteredData?.map((item, i) => (
                  <TableRow
                    key={i}
                  type="histopatholgy-report"
                    name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                    testName={item.testName}
                    biopsyType={item.diagnosisForm?.biopsyType}
                    mrn={item.patient?.mrn}
                    phone={item.diagnosisForm?.phoneNumber}
                    previousBiopsy={item.diagnosisForm?.previousBiopsy ? "Yes" : "No"}
                    lmp={moment(item.diagnosisForm?.lmp).format("lll")}
                    wholeOrgan={item.diagnosisForm?.wholeOrgan}
                    labStatus={item.testPaymentStatus}
                   status={item.paymentInfo?.status}
                  
                   onClick={()=>getSinglehistopathology(item.testName,item.histopathologyId) }
                  />
                ))
              ) : (
                <Text textAlign="center" mt="32px" color="black">
                  *--No record found--*
                </Text>
              )}
            </Tbody>
          </Table>
        </TableContainer>
        <Pagination
          postPerPage={PostPerPage}
          currentPage={CurrentPage}
          totalPosts={TotalData}
          paginate={paginate}
        />
      </Box>

      {/* Modals */}
      <CreateHistopathologyResult
        isOpen={isOpen}
        oldPayload={OldPayload}
        onClose={onClose}
        type={ModalState}
        activateNotifications={activateNotifications}
      />
      <CreateHistopathologyModal
        isOpen={OpenOrderModal}
        oldPayload={OldPayload}
        onClose={() => setOpenOrderModal(false)}
        activateNotifications={activateNotifications}
        onSuccess={() => setTrigger((prev) => !prev)}
      />
      <ConfirmLabOrderModal
        isOpen={isConfirmOpen}
        labOrderId={OldPayload?._id}
        onClose={onConfirmClose}
        onSuccess={() => setTrigger((prev) => !prev)}
      />
    </MainLayout>
  );
}
