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
  SimpleGrid,
  Select
} from "@chakra-ui/react";
import * as XLSX from "xlsx/xlsx.mjs";
import TableRowY from "../Components/TableRowY";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Preloader from "../Components/Preloader";
import ShowToast from "../Components/ToastNotification";
import { FaCloudDownloadAlt, FaCalendarAlt } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import Pagination from "../Components/Pagination";
import moment from "moment";
import Seo from "../Utils/Seo";
import { GetCashierSettingsApi, GetCashierReportApi } from "../Utils/ApiCalls";
import { configuration } from "../Utils/Helpers";

export default function CashierReport() {
  // API & Table Data States
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]); // report data (paymentrecords)
  const [filterData, setFilterData] = useState([]);
  const [cashierSettings, setCashierSettings] = useState([]); // cashier emails
  const [cashierEmail, setCashierEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Payment Summary State (holds the total payment details)
  const [paymentSummary, setPaymentSummary] = useState(null);

  // Search & Filter States
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [byDate, setByDate] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Pagination settings
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(configuration.sizePerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatedData = (filteredData || filterData).slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toast notification state
  const [showToast, setShowToast] = useState({ show: false, message: "", status: "" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useNavigate();

  // Fetch cashier settings and log the API response
  const fetchCashierSettings = async () => {
    setIsLoading(true);
    try {
      const result = await GetCashierSettingsApi();
      console.log("Cashier Settings API response:", result);
      if (result.status === true) {
        setCashierSettings(result.queryresult);
      }
      setIsLoading(false);
    } catch (e) {
      console.log("Error in fetching cashier settings:", e.message);
      setIsLoading(false);
    }
  };

  // Fetch cashier report and log the API response
  const fetchReport = async () => {
    setLoading(true);
    try {
      const result = await GetCashierReportApi(cashierEmail, startDate, endDate);
      console.log("Cashier Report API response:", result);
      if (result.status === true) {
        setData(result.queryresult.paymentrecords);
        setFilterData(result.queryresult.paymentrecords);
        // Save the payment summary (total amount, cashier details, etc.)
        setPaymentSummary(result.queryresult.paymentsummary[0]);
      }
      setLoading(false);
    } catch (e) {
      console.log("Error in fetching cashier report:", e.message);
      setLoading(false);
    }
  };

  // Update the searchInput state only (live filtering is removed)
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Filter function for the menu selections (applied when the user clicks a filter option)
  const filterBy = (type) => {
    if (type === "name") {
      const filtered = data.filter((item) =>
        (item.patient?.firstName + " " + item.patient?.lastName)
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      );
      setFilteredData(filtered);
    } else if (type === "cashieremail") {
      const filtered = data.filter((item) =>
        item.cashieremail?.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredData(filtered);
    } else if (type === "paymentype") {
      const filtered = data.filter((item) =>
        item.paymentype?.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredData(filtered);
    } else if (type === "paymentcategory") {
      const filtered = data.filter((item) =>
        item.paymentcategory?.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredData(filtered);
    } else if (type === "date") {
      if (filterStartDate && filterEndDate) {
        let endD = new Date(filterEndDate);
        endD.setDate(endD.getDate() + 1);
        let formattedEndDate = endD.toISOString().split("T")[0];
        const filtered = data.filter((item) => {
          const createdDate = new Date(item.createdAt).toISOString().split("T")[0];
          return createdDate >= filterStartDate && createdDate <= formattedEndDate;
        });
        setFilteredData(filtered);
      }
    } else if (type === "clear") {
      setFilteredData(null);
      setSearchInput("");
      setFilterStartDate("");
      setFilterEndDate("");
      setByDate(false);
    }
  };

  // Download report using XLSX
  const downloadFile = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet);
    let date = moment(Date.now()).format("DD/MM/YYYY");
    XLSX.writeFile(workbook, `${date}_Cashier_Report.xlsx`);
  };

  useEffect(() => {
    fetchCashierSettings();
  }, []);

  return (
    <MainLayout>
      {isLoading && <Preloader />}
      <Seo title="Cashier Report" description="Access cashier reports and analytics" />
      {showToast.show && <ShowToast message={showToast.message} status={showToast.status} />}

      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Cashier Report
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({data?.length})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        Access cashier reports and analytics.
      </Text>

      {/* Report Filter Section */}
      <Box bg="#fff" border="1px solid #EFEFEF" mt="12px" py="17px" px={["18px", "18px"]} rounded="10px">
        <SimpleGrid mt="12px" columns={{ base: 2, md: 3 }} spacing={2}>
          <Box>
            <Text color="#1F2937" fontWeight="500" fontSize="14px">
              Cashier Email
            </Text>
            <Select
              fontSize={cashierEmail !== "" ? "16px" : "13px"}
              h="45px"
              borderWidth="2px"
              borderColor="#E4E4E4"
              _hover={{ borderColor: "#7A27AB" }}
              _focus={{ borderColor: "blue.blue500" }}
              value={cashierEmail}
              onChange={(e) => {
                setCashierEmail(e.target.value);
                setData([]);
              }}
              placeholder="Select Cashier Email"
            >
              {cashierSettings.map((item, i) => (
                <option value={item.cashieremail} key={i}>
                  {item.cashieremail}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Text color="#1F2937" fontWeight="500" fontSize="14px">
              Start Date
            </Text>
            <Input
              type="date"
              onChange={(e) => {
                setStartDate(e.target.value);
                setData([]);
              }}
              value={startDate}
              bColor="#E4E4E4"
              leftIcon={<FaCalendarAlt />}
            />
          </Box>
          <Box>
            <Text color="#1F2937" fontWeight="500" fontSize="14px">
              End Date
            </Text>
            <Input
              type="date"
              onChange={(e) => {
                setEndDate(e.target.value);
                setData([]);
              }}
              value={endDate}
              bColor="#E4E4E4"
              leftIcon={<FaCalendarAlt />}
            />
          </Box>
        </SimpleGrid>

        <Flex justifyContent="flex-end" mt="2">
          <Button
            mt={["10px", "10px", "0px", "0px"]}
            isLoading={loading}
            loadingText="Fetching..."
            background="#f8ddd1"
            border="1px solid #EA5937"
            color="blue.blue500"
            w={["100%", "100%", "144px", "144px"]}
            onClick={fetchReport}
            disabled={cashierEmail && startDate && endDate ? false : true}
          >
            Fetch Report
          </Button>
        </Flex>
      </Box>

      {/* Only render when data exists */}
      {data.length > 0 && (
        <Box bg="#fff" border="1px solid #EFEFEF" mt="12px" py="17px" px={["18px", "18px"]} rounded="10px">
          {/* Payment Summary Section */}
          {paymentSummary && (
            <Box bg="#f8f8f8" border="1px solid #ddd" p="12px" mb="12px" rounded="8px">
              <Text fontSize="16px" fontWeight="600">
                Total Payment Amount: &#8358; {paymentSummary.totalAmount}
              </Text>
              <Text fontSize="14px">
                Cashier ID: {paymentSummary.cashierid} | Cashier Email: {paymentSummary.cashieremail} | Status: {paymentSummary.status}
              </Text>
            </Box>
          )}
          <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap">
            {/* Download Button */}
            <Button
              rightIcon={<FaCloudDownloadAlt />}
              w={["100%", "100%", "144px", "144px"]}
              onClick={downloadFile}
            >
              Download
            </Button>
            {/* Filter and Search Section on the same line */}
            <HStack spacing="4">
              {!byDate ? (
                <Input
                  label="Search"
                  onChange={handleInputChange}
                  value={searchInput}
                  bColor="#E4E4E4"
                  leftIcon={<BiSearch />}
                />
              ) : (
                <HStack flexWrap={["wrap", "nowrap"]}>
                  <Input
                    label="Start Date"
                    type="date"
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    value={filterStartDate}
                    bColor="#E4E4E4"
                    leftIcon={<FaCalendarAlt />}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    value={filterEndDate}
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
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Name</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("cashieremail")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Cashier Email</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("paymentype")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Payment Type</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("paymentcategory")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Payment Category</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => setByDate(true)}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Date</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("clear")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                  >
                    <HStack fontSize="14px">
                      <Text>Clear Filter</Text>
                    </HStack>
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          {/* Table Section */}
          <Box mt="12px" overflowX="auto">
            <TableContainer>
              <Table variant="striped">
                <Thead bg="#fff">
                  <Tr>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Patient
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Payment Type
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Payment Category
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Payment Reference
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Amount
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Status
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Date
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Cashier Email
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Cashier ID
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(filteredData || paginatedData).map((item, i) => (
                    <TableRowY
                      key={i}
                      type="cashier"
                      patient={item.patient}
                      paymentype={item.paymentype}
                      paymentcategory={item.paymentcategory}
                      paymentreference={item.paymentreference}
                      amount={item.amount}
                      status={item.status}
                      createdAt={item.createdAt}
                      cashieremail={item.cashieremail}
                      cashierid={item.cashierid}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={(filteredData || filterData).length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </Box>
        </Box>
      )}
    </MainLayout>
  );
}
