import React, { useEffect, useState } from "react";
import MainLayout from "../Layouts/Index";
import {
  Text,
  Flex,
  HStack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from "@chakra-ui/react";
import TableRow from "../Components/TableRow";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import { BiSearch } from "react-icons/bi";
import moment from "moment";
import Seo from "../Utils/Seo";
import {
  GetAllClaimsApi,
  UpdateInsuranceClaimStatusApi,
  GetAllFilteredClaimsApi,
} from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";
import UpdateClaimStatusModal from "../Components/UpdateClaimStatusModal";
import { IoFilter } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";

export default function Claims() {
  const [IsLoading, setIsLoading] = useState(true);
  const [Data, setData] = useState([]);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState(null);

  // State for status filters
  const [Submitted, setSubmitted] = useState(true);
  const [Resubmitted, setResubmitted] = useState(false);
  const [Cancelled, setCancelled] = useState(false);
  const [Rejected, setRejected] = useState(false);
  const [Paid, setPaid] = useState(false);
  const [Status, setStatus] = useState("Submitted");

  // Pagination settings
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);
  const [TotalData, setTotalData] = useState(0);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Search and date filter settings
  const [SearchInput, setSearchInput] = useState("");
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [Key, setKey] = useState("");
  const [Value, setValue] = useState("");

  const getAllClaims = async (status) => {
    setIsLoading(true);
    try {
      const result = await GetAllFilteredClaimsApi(
        CurrentPage,
        PostPerPage,
        status
      );
      if (result.status === true) {
        setData(result.queryresult.claims);
        setTotalData(result.queryresult.total);
      }
    } catch (e) {
      console.error(e.message);
      activateNotifications(e.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredClaims = async (key, value) => {
    setKey(key);
    setValue(value);
    setIsLoading(true);
    try {
      const result = await GetAllFilteredClaimsApi(
        CurrentPage,
        PostPerPage,
        Status,
        key,
        value
      );
      if (result.status === true) {
        setData(result.queryresult.claims);
        setTotalData(result.queryresult.total);
      }
    } catch (e) {
      console.error(e.message);
      activateNotifications(e.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const filterBy = (title) => {
    if (title === "mrn") {
      getFilteredClaims("MRN", SearchInput);
    } else if (title === "hmo") {
      getFilteredClaims("insurer", SearchInput);
    } else if (title === "date") {
      let endDate = new Date(EndDate);
      endDate.setDate(endDate.getDate() + 1);
      let formatedEndDate = endDate.toISOString().split("T")[0];
      getFilteredClaims("date", `${StartDate},${formatedEndDate}`);
    }
  };

  const createFilterHandler = (status, setStatusState) => {
    return () => {
      setSubmitted(false);
      setResubmitted(false);
      setCancelled(false);
      setRejected(false);
      setPaid(false);
      setStatusState(true);
      setStatus(status);
      setCurrentPage(1);
    };
  };

  const filterSubmitted = createFilterHandler("Submitted", setSubmitted);
  const filterResubmitted = createFilterHandler("Re-submitted", setResubmitted);
  const filterCancelled = createFilterHandler("Cancelled", setCancelled);
  const filterRejected = createFilterHandler("Rejected", setRejected);
  const filterPaid = createFilterHandler("Paid", setPaid);

  const activateNotifications = (message, status) => {
    setShowToast({
      show: true,
      message: message,
      status: status,
    });
    setTimeout(() => {
      setShowToast({ show: false, message: "", status: "" });
    }, 3000);
  };

  const handleUpdateStatus = async (claimId, data) => {
    try {
      const result = await UpdateInsuranceClaimStatusApi(claimId, data);
      if (result.status === true) {
        activateNotifications("Status Updated Successfully", "success");
        getAllClaims(Status);
      } else {
        activateNotifications("Error updating status", "error");
      }
    } catch (e) {
      console.error(e.message);
      activateNotifications(e.message, "error");
    }
  };

  const UpdateClaimStatus = (claimId) => {
    setSelectedClaimId(claimId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (Key && Value) {
      getFilteredClaims(Key, Value);
    } else {
      getAllClaims(Status);
    }
  }, [CurrentPage, isModalOpen, Status]);

  return (
    <MainLayout>
      {IsLoading && <Preloader />}
      <Seo title="Claims" description="Care Connect Claims" />
      <UpdateClaimStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdateStatus}
        claimId={selectedClaimId}
      />
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Claims
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({TotalData})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        Manage and view all claims.
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
              onClick={filterSubmitted}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={Submitted ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Submitted
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={filterResubmitted}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={Resubmitted ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Re-submitted
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={filterCancelled}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={Cancelled ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Cancelled
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={filterRejected}
            >
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
            <Box pr="5px" onClick={filterPaid}>
              <Text
                py="8.5px"
                px="12px"
                bg={Paid ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Paid
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
                    onClick={() => filterBy("mrn")}
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
                      <Text>by Patient MRN</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("hmo")}
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
                      <Text>by HMO</Text>
                    </HStack>
                  </MenuItem>
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
                      <Text>by date</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSearchInput("");
                      setByDate(false);
                      setStartDate("");
                      setEndDate("");
                      setKey("");
                      setValue("");
                      filterSubmitted();
                      setCurrentPage(1);
                    }}
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
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Patient Name
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  HMO name
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Service Category
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Amount Claimed
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Amount Approved
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Status
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Created At
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {Data?.map((item, i) => (
                <TableRow
                  key={i}
                  type="claim"
                  name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                  mrn={`${item.patient?.MRN}`}
                  serviceCategory={item.serviceCategory}
                  hmo={item.insurer}
                  amountClaimed={item.amountClaimed}
                  amountApproved={item.amountApproved}
                  status={item.status}
                  date={moment(item.createdAt).format("lll")}
                  onClick={() => UpdateClaimStatus(item._id)}
                />
              ))}
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
    </MainLayout>
  );
}
