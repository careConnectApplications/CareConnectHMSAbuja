import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import TableRow from "../TableRow";
import Button from "../Button";
import Input from "../Input";
import ShowToast from "../ToastNotification";
import { CgSearch } from "react-icons/cg";
import { IoFilter } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
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
import HistopathologyInsuranceAuthModal from "../HistopathologyInsuranceAuthModal";
import { GetAwaitingAuthorizationHistopathology } from "../../Utils/ApiCalls";
import moment from "moment";
import { BiSearch } from "react-icons/bi";

import Pagination from "../Pagination";
import { configuration } from "../../Utils/Helpers";
import Preloader from "../Preloader";
import { FaCalendarAlt } from "react-icons/fa";

export default function HistopathologyInsurance() {
  const [IsLoading, setIsLoading] = useState(true);
  const [Trigger, setTrigger] = useState(false);
  const [Data, setData] = useState([]);
  const [FilterData, setFilterData] = useState([]);
  const [ModalState, setModalState] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [OldPayload, setOldPayload] = useState("");
  const [FilterUser, setFilterUser] = useState({});

  // Search Filter settings to follow
  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null);

  // filter by date
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");

  const filterBy = (title) => {
    if (title === "mrn") {
      let filter = Data.filter((item) =>
        item.MRN?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "hmo") {
      let filter = Data.filter((item) =>
        item.HMOName?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "name") {
      let filter = Data.filter(
        (item) =>
          item.firstName?.toLowerCase().includes(SearchInput.toLowerCase()) ||
          item.lastName?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "date") {
      let endDate = new Date(EndDate);
      endDate.setDate(endDate.getDate() + 1);
      let formatedEndDate = endDate.toISOString().split("T")[0];
      let filter = Data.filter(
        (item) =>
          item.createdAt >= StartDate && item.createdAt <= formatedEndDate
      );
      setFilteredData(filter);
      setSearchInput("s");
    }
  };

  // Pagination settings to follow
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);

  //get current post
  const indexOfLastSra = CurrentPage * PostPerPage;
  const indexOfFirstSra = indexOfLastSra - PostPerPage;
  const PaginatedData = FilterData.slice(indexOfFirstSra, indexOfLastSra);
  //change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const getAwaitingHistopathology = async () => {
    setIsLoading(true);
    try {
      const result = await GetAwaitingAuthorizationHistopathology();
      console.log("getAwaitingHistopathology", result); 

      if (result.status === true) {
        setIsLoading(false);
        setData(result.queryresult?.docs || []);
        setFilterData(result.queryresult?.docs || []);
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e.message);
      setIsLoading(false);
    }
  };

  const onChangeStatus = async (item) => {
    setOldPayload(item);
    onOpen();
  };

  const activateNotifications = (message, status) => {
    setShowToast({
      show: true,
      message: message,
      status: status,
    });

    setTimeout(() => {
      setShowToast({
        show: false,
      });
    }, 5000);
  };

  useEffect(() => {
    getAwaitingHistopathology();
  }, [isOpen, Trigger]);

  return (
    <Box>
      {IsLoading && <Preloader />}
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="17px"
        px={["18px", "18px"]}
        rounded="10px"
      >
        <Flex justifyContent="flex-end" flexWrap="wrap">
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
                    onClick={() => filterBy("name")}
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
                      <Text>by Patient Name</Text>
                    </HStack>
                  </MenuItem>
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
                      <Text>by HMO Name</Text>
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
                      setFilteredData(null);
                      setSearchInput("");
                      setByDate(false);
                      setStartDate("");
                      setEndDate("");
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
                    patient name
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    MRN
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    phone
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    HMO Name
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Total Amount
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    date created
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
                {SearchInput === "" || FilteredData === null
                  ? PaginatedData?.map((item, i) => (
                      <TableRow
                        key={i}
                        type="histopathology-insurance"
                        name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                        phone={item.patient?.phoneNumber}
                        mrn={item.patient?.MRN}
                        hmo={item.patient?.HMOName||"N/A"}
                        total={item.amount}
                        status={item.status}
                        date={moment(item.createdAt).format("lll")}
                        onClick={() => onChangeStatus(item)}
                      />
                    ))
                  : SearchInput !== "" &&
                    FilteredData?.length > 0
                  ? FilteredData?.map((item, i) => (
                      <TableRow
                        key={i}
                         type="histopathology-insurance"
                        name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                        phone={item.patient?.phoneNumber}
                        mrn={item.patient?.MRN}
                        hmo={item.patient?.HMOName||"N/A"}
                        total={item.amount}
                        status={item.status}
                        date={moment(item.createdAt).format("lll")}
                        onClick={() => onChangeStatus(item)}
                      />
                    ))
                  : <Text textAlign={"center"} mt="32px" color="black">*--No record found--*</Text>}
              </Tbody>
            </Table>
          </TableContainer>
          <Pagination
            postPerPage={PostPerPage}
            currentPage={CurrentPage}
            totalPosts={Data.length}
            paginate={paginate}
          />
        </Box>
        <HistopathologyInsuranceAuthModal
          isOpen={isOpen}
          onClose={onClose}
          type={"histopathology"}
          filteredUser={FilterUser}
          oldPayload={OldPayload}
          activateNotifications={activateNotifications}
        />
      </Box>
    </Box>
  );
}
