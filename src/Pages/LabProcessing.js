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
import CreateTestOrderModal from "../Components/CreateTestOrderModal";
import RequestLabOtherModal from "../Components/RequestLabOtherModal";
import ConfirmLabOrderModal from "../Components/ConfirmLabOrderModal";
import {
  GetAllScheduledLabApi,
  GetAllScheduledLabFilteredApi,
} from "../Utils/ApiCalls";
import { SortByHematologyAndChemicalPathologyApi } from "../Utils/ApiCalls";

import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";
import { SlPlus } from "react-icons/sl";
import { FaCalendarAlt } from "react-icons/fa";

export default function LabProcessing() {
  const [IsLoading, setIsLoading] = useState(true);
  const [Data, setData] = useState([]);
  const [QueueData, setQueueData] = useState([]);
  const [FilterData, setFilterData] = useState([]);
  const [ModalState, setModalState] = useState("");
  const [OpenOrderModal, setOpenOrderModal] = useState(false);
  const [OldPayload, setOldPayload] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Trigger, setTrigger] = useState(false);

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const [Scheduled, setScheduled] = useState(true);
  const [AwaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [Processed, setProcessed] = useState(false);
  const [Rejected, setRejected] = useState(false);

  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");

  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);
  const [TotalData, setTotalData] = useState("");
  const [Status, setStatus] = useState("scheduled");

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null);

  const [Key, setKey] = useState("");
  const [Value, setValue] = useState("");

  const getFilteredScheduledlab = async (key, value) => {
    setKey(key);
    setValue(value);

    try {
      setIsLoading(true);
      const result = await GetAllScheduledLabFilteredApi(
        PostPerPage,
        CurrentPage,
        Status,
        key,
        value
      );
      console.log("all fitlered Lab", result);
      if (result.status === true) {
        setFilteredData(result.queryresult.labdetails);
        setTotalData(result.queryresult.totallabdetails);
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBy = (title) => {
    if (title === "mrn") {
      getFilteredScheduledlab("MRN", SearchInput);
    } else if (title === "firstName") {
      getFilteredScheduledlab("firstName", SearchInput);
    } else if (title === "lastName") {
      getFilteredScheduledlab("lastName", SearchInput);
    } else if (title === "testName") {
      getFilteredScheduledlab("testname", SearchInput);
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

  const [currentStatusFilter, setCurrentStatusFilter] = useState("all");

  const getAllScheduledLab = async (status) => {
    setIsLoading(true);
    try {
      console.log(`Fetching lab tests with status: ${status}`);
      const result = await GetAllScheduledLabApi(
        PostPerPage,
        CurrentPage,
        status
      );

      console.log("API Response for status", status, ":", result);

      if (result.status === true) {
        setIsLoading(false);
        setData(result.queryresult.labdetails);
        setFilterData(result.queryresult.labdetails);
        setTotalData(result.queryresult.totallabdetails);

        // Debug log to confirm rejected tests are being returned
        if (status === "rejected") {
          console.log("Rejected tests:", result.queryresult.labdetails);
        }
      } else {
        activateNotifications(
          result.message || "Failed to fetch lab data",
          "error"
        );
      }
    } catch (e) {
      console.error(`Error fetching ${status} tests:`, e.message);
      activateNotifications(
        `Failed to fetch ${status} tests: ${e.message}`,
        "error"
      );
    }
  };
  const sortToHematology = async (testid) => {
    try {
      setIsLoading(true);
      console.log("[DEBUG] Starting sortToHematology with testid:", testid);

      const result = await SortByHematologyAndChemicalPathologyApi(
        testid,
        "hematology"
      );

      console.log("[DEBUG] API Response:", {
        status: result?.status,
        data: result,
        testid: testid,
      });

      if (result?.status === true) {
        console.log(
          "[SUCCESS] Sort to Hematology successful for test:",
          testid
        );
        activateNotifications("Sorted to Hematology successfully", "success");
        setTrigger((prev) => !prev);
      } else {
        console.warn("[WARNING] Unexpected API response:", {
          testid: testid,
          response: result,
          message: result?.message || "No message provided",
        });
        activateNotifications(
          result?.message || "Unexpected response from server",
          "warning"
        );
      }
    } catch (error) {
      console.error("[ERROR] Sorting error details:", {
        testid: testid,
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        responseData: error.response?.data,
        responseStatus: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to sort to Hematology";
      activateNotifications(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };
  const sortToChemicalPathology = async (testid) => {
    try {
      setIsLoading(true);
      console.log(
        "[DEBUG] Starting sortToChemicalPathology with testid:",
        testid
      );

      const result = await SortByHematologyAndChemicalPathologyApi(
        testid,
        "chemicalpathology"
      );

      console.log("[DEBUG] API Response:", {
        status: result?.status,
        data: result,
        testid: testid,
      });

      if (result?.status === true) {
        console.log(
          "[SUCCESS] Sort to Chemical Pathology successful for test:",
          testid
        );
        activateNotifications(
          "Sorted to Chemical Pathology successfully",
          "success"
        );
        setTrigger((prev) => !prev);
      } else {
        console.warn("[WARNING] Unexpected API response:", {
          testid: testid,
          response: result,
          message: result?.message || "No message provided",
        });
        activateNotifications(
          result?.message || "Unexpected response from server",
          "warning"
        );
      }
    } catch (error) {
      console.error("[ERROR] Sorting error details:", {
        testid: testid,
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        responseData: error.response?.data,
        responseStatus: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to sort to Chemical Pathology";
      activateNotifications(errorMessage, "error");
    } finally {
      setIsLoading(false);
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

  const filterScheduled = () => {
    setScheduled(true);
    setAwaitingConfirmation(false);
    setProcessed(false);
    setRejected(false);
    getAllScheduledLab("scheduled");
    setStatus("scheduled");
    setCurrentPage(1);
  };

  const filterProcessed = () => {
    setScheduled(false);
    setProcessed(true);
    setAwaitingConfirmation(false);
    setRejected(false);
    getAllScheduledLab("processed");
    setStatus("processed");
    setCurrentPage(1);
  };
  const filterAwaitingConfirmation = () => {
    setScheduled(false);
    setProcessed(false);
    setAwaitingConfirmation(true);
    setRejected(false);
    getAllScheduledLab("awaiting confirmation");
    setStatus("awaiting confirmation");
    setCurrentPage(1);
  };

  const filterRejected = () => {
    setScheduled(false);
    setProcessed(false);
    setAwaitingConfirmation(false);
    setRejected(true);
    getAllScheduledLab("rejected");
    setStatus("rejected");
    setCurrentPage(1);
  };
  const ProcessLab = (item) => {
    setOldPayload(item);
    onOpen();
  };

  const confirmLab = (item) => {
    console.log("confirmLab called with item:", item);
    setOldPayload(item);
    onConfirmOpen();
  };

  useEffect(() => {
    if (FilteredData?.length > 0 || FilteredData !== null) {
      getFilteredScheduledlab(Key, Value);
    } else {
      if (Scheduled) {
        getAllScheduledLab("scheduled");
      } else if (Processed) {
        getAllScheduledLab("processed");
      } else if (AwaitingConfirmation) {
        getAllScheduledLab("awaiting confirmation");
      } else if (Rejected) {
        getAllScheduledLab("rejected");
      }
    }
  }, [
    isOpen,
    Trigger,
    CurrentPage,
    Scheduled,
    Processed,
    AwaitingConfirmation,
    Rejected,
  ]);

  return (
    <MainLayout>
      {IsLoading && <Preloader />}
      <Seo
        title="Lab Processing"
        description="Care connect Manage Lab Processing"
      />

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Lab Processing
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
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={filterScheduled}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={Scheduled ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Scheduled
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={filterAwaitingConfirmation}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={AwaitingConfirmation ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Awaiting Confirmation
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={filterProcessed}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={Processed ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Processed
              </Text>
            </Box>
            <Box onClick={filterRejected}>
              <Text
                py="8.5px"
                px="12px"
                bg={Rejected ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Rejected
              </Text>
            </Box>
          </Flex>

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
                    setCurrentPage(1);
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
                      filterScheduled();
                      setCurrentPage(1);
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
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Test ID
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Patient name
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Department
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Test Name
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Order Date
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Lab Status
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {SearchInput === "" || FilteredData === null ? (
                FilterData?.map((item, i) => {
                  console.log("TableRow item:", {
                    _id: item._id,
                    testid: item.testid,
                  });
                  return (
                    <TableRow
                      key={i}
                      type="lab-processing"
                      testid={item.testid}
                      name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                      mrn={item.patient?.MRN}
                      department={item.department}
                      testName={item.testname}
                      date={moment(item.createdAt).format("lll")}
                      labStatus={item.status}
                      onConfirmClick={() => {
                        console.log("Confirm action triggered for item:", item);
                        confirmLab(item);
                      }}
                      onClick={() => {
                        if (
                          item.status?.trim().toLowerCase() ===
                          "awaiting confirmation"
                        ) {
                          console.log(
                            "Confirm action triggered for item:",
                            item
                          );
                          confirmLab(item);
                        } else {
                          ProcessLab(item);
                        }
                      }}
                      onSortToHematology={() => sortToHematology(item._id)}
                      onSortToChemicalPathology={() =>
                        sortToChemicalPathology(item._id)
                      }
                    />
                  );
                })
              ) : SearchInput !== "" && FilteredData?.length > 0 ? (
                FilteredData?.map((item, i) => {
                  console.log("TableRow item (FilteredData):", {
                    _id: item._id,
                    testid: item.testid,
                  });
                  return (
                    <TableRow
                      key={i}
                      type="lab-processing"
                      testid={item.testid}
                      name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                      mrn={item.patient?.MRN}
                      testName={item.testname}
                      date={moment(item.createdAt).format("lll")}
                      labStatus={item.status}
                      onConfirmClick={() => {
                        console.log("Confirm action triggered for item:", item);
                        confirmLab(item);
                      }}
                      onClick={() => {
                        if (
                          item.status?.trim().toLowerCase() ===
                          "awaiting confirmation"
                        ) {
                          console.log(
                            "Confirm action triggered for item:",
                            item
                          );
                          confirmLab(item);
                        } else {
                          ProcessLab(item);
                        }
                      }}
                      onSortToHematology={() => sortToHematology(item._id)}
                      onSortToChemicalPathology={() =>
                        sortToChemicalPathology(item._id)
                      }
                    />
                  );
                })
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

      <CreateTestOrderModal
        isOpen={isOpen}
        oldPayload={OldPayload}
        onClose={onClose}
        type={ModalState}
        activateNotifications={activateNotifications}
      />
      <RequestLabOtherModal
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
