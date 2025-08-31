import React, { useState } from "react";
import { Text, Flex, HStack, Box, SimpleGrid, Avatar } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import * as XLSX from "xlsx/xlsx.mjs";
import Button from "../../Components/Button";
import Input from "../../Components/Input";
import Preloader from "../../Components/Preloader";
import ShowToast from "../../Components/ToastNotification";
import { FaCalendarAlt, FaCloudDownloadAlt } from "react-icons/fa";
import Pagination from "../../Components/Pagination";
import { configuration } from "../../Utils/Helpers";
import { GetMedicalReportAPI } from "../../Utils/ApiCalls";
import moment from "moment";
import AdvancedSearchFilter from "../../Components/AdvancedSearchFilter";
import { FaFilter } from "react-icons/fa";
import { useColors } from "../../Utils/colors";

export default function FinancialReport() {
  const {
    bgColor,
    textColor,
    borderColor,
    titleTextColor,
    subTitleTextColor,
    primaryColor,
  } = useColors();
  const [IsLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [payload, setPayload] = useState({
    startDate: "",
    endDate: "",
    patientMRN: "",
    patientFirstName: "",
    patientLastName: "",
    paymentype: "",
    paymentcategory: "",
    amount: "",
    qty: "",
    cashierid: "",
    cashieremail: "",
    status: "",
    paymentreference: "",
  });

  const handlePatientSelect = (patient) => {
    setPayload({
      ...payload,
      patientMRN: patient?.patientId || "",
      patientFirstName: patient?.firstName || "",
      patientLastName: patient?.lastName || "",
    });
  };

  const advancedFilterFields = [
    {
      name: "patientFirstName",
      label: "Patient First Name",
      type: "text",
      placeholder: "Enter patient first name",
    },
    {
      name: "patientLastName",
      label: "Patient Last Name",
      type: "text",
      placeholder: "Enter patient last name",
    },
    {
      name: "patientMRN",
      label: "Patient MRN",
      type: "text",
      placeholder: "Enter patient MRN",
    },
    {
      name: "paymentype",
      label: "Payment Type",
      type: "text",
      placeholder: "Enter payment type",
    },
    {
      name: "paymentcategory",
      label: "Payment Category",
      type: "text",
      placeholder: "Enter payment category",
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
      placeholder: "Enter amount",
    },
    {
      name: "qty",
      label: "Quantity",
      type: "number",
      placeholder: "Enter quantity",
    },
    {
      name: "cashierid",
      label: "Cashier ID",
      type: "text",
      placeholder: "Enter cashier ID",
    },
    {
      name: "cashieremail",
      label: "Cashier Email",
      type: "email",
      placeholder: "Enter cashier email",
    },
    {
      name: "status",
      label: "Status",
      type: "text",
      placeholder: "Enter status",
    },
    {
      name: "paymentreference",
      label: "Payment Reference",
      type: "text",
      placeholder: "Enter payment reference",
    },
  ];

  // Pagination settings
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(
    configuration.sizePerPage || 10
  );

  const indexOfLastItem = CurrentPage * PostPerPage;
  const indexOfFirstItem = indexOfLastItem - PostPerPage;
  const PaginatedData = Data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const fetchFinancialReport = async () => {
    if (!payload.startDate || !payload.endDate) {
      setShowToast({
        show: true,
        message: "Please select both start and end dates",
        status: "error",
      });
      setTimeout(() => {
        setShowToast({ show: false });
      }, 3000);
      return;
    }
    setIsLoading(true);

    // Create a filtered payload with only non-empty values
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== "")
    );

    console.log("API Request Payload:", filteredPayload);

    try {
      const result = await GetMedicalReportAPI(
        { filters: filteredPayload },
        "financialreport"
      );

      console.log("API Response - Full Result:", result);
      console.log("API Response - Data:", result?.data);
      console.log("API Response - Query Result:", result?.data?.queryresult);

      // Reset only the filter fields, keep date range
      setPayload({
        ...payload,
        patientMRN: "",
        patientFirstName: "",
        patientLastName: "",
        paymentype: "",
        paymentcategory: "",
        amount: "",
        qty: "",
        cashierid: "",
        cashieremail: "",
        status: "",
        paymentreference: "",
      });

      setData(result.data.queryresult || []);

      setIsLoading(false);
      setShowToast({
        show: true,
        message: "Financial report data fetched successfully",
        status: "success",
      });
      setTimeout(() => {
        setShowToast({ show: false });
      }, 3000);
    } catch (e) {
      console.error("API Error:", e);
      console.error("Error Message:", e.message);

      setIsLoading(false);
      setShowToast({
        show: true,
        message:
          e.response?.data?.message ||
          "An error occurred while fetching the report",
        status: "error",
      });
      setTimeout(() => {
        setShowToast({ show: false });
      }, 3000);
    }
  };

  const clearFilters = () => {
    setPayload({
      startDate: "",
      endDate: "",
      patientMRN: "",
      patientFirstName: "",
      patientLastName: "",
      paymentype: "",
      paymentcategory: "",
      amount: "",
      qty: "",
      cashierid: "",
      cashieremail: "",
      status: "",
      paymentreference: "",
    });
    setData([]);
    setCurrentPage(1);
    console.log("Filters cleared, data reset");
  };

  const downloadReport = () => {
    if (Data.length === 0) {
      setShowToast({
        show: true,
        message: "No data to export",
        status: "error",
      });
      setTimeout(() => {
        setShowToast({ show: false });
      }, 3000);
      return;
    }

    let reportData = Data.map((item) => ({
      "Patient MRN": item.patientMRN,
      "Patient First Name": item.patientFirstName,
      "Patient Last Name": item.patientLastName,
      "Payment Type": item.paymentype,
      "Payment Category": item.paymentcategory,
      Amount: item.amount,
      Quantity: item.qty,
      "Cashier ID": item.cashierid,
      "Cashier Email": item.cashieremail,
      Status: item.status,
      "Payment Reference": item.paymentreference,
      Date: moment(item.createdAt).format("YYYY-MM-DD"),
    }));

    var workbook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.json_to_sheet(reportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Report");
    let date = moment(Date.now()).format("DD-MM-YYYY");
    XLSX.writeFile(workbook, `Financial_Report_${date}.xlsx`);

    console.log("Report downloaded with data:", reportData);
  };

  // Function to determine status color based on specific status values
  const getStatusColor = (status) => {
    if (!status) return "#667085";

    const statusLower = status.toLowerCase();
    if (statusLower.includes("paid")) {
      return "#027A48"; // Green for paid
    } else if (statusLower.includes("pending payment")) {
      return "#FFA30C"; // Orange for pending payment
    } else {
      return "#667085"; // Gray for any other status
    }
  };

  return (
    <>
      {IsLoading && <Preloader />}

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      {/* Header Section */}
      <Box
        bg={bgColor}
        border={`1px solid ${borderColor}`}
        mt="12px"
        py="20px"
        px="20px"
        rounded="10px"
      >
        <Text color={titleTextColor} fontWeight="600" fontSize="17px">
          Financial Report
        </Text>
        <Text color={subTitleTextColor} mt="8px" fontWeight="400" fontSize="14px">
          To generate a report, select a date range and click apply
        </Text>

        <SimpleGrid mt="20px" columns={{ base: 1, md: 2 }} spacing={4}>
          <Box>
            <Text color={titleTextColor} fontWeight="500" fontSize="14px" mb="6px">
              From Date
            </Text>
            <Input
              type="date"
              name="startDate"
              onChange={handleInputChange}
              value={payload.startDate}
              bColor={borderColor}
              leftIcon={<FaCalendarAlt />}
            />
          </Box>

          <Box>
            <Text color={titleTextColor} fontWeight="500" fontSize="14px" mb="6px">
              To Date
            </Text>
            <Input
              type="date"
              name="endDate"
              onChange={handleInputChange}
              value={payload.endDate}
              bColor={borderColor}
              leftIcon={<FaCalendarAlt />}
            />
          </Box>
        </SimpleGrid>

        <Flex mt="20px" gap="12px" flexWrap="wrap">
          <Button
            onClick={fetchFinancialReport}
            w={["100%", "100%", "120px", "120px"]}
          >
            Apply
          </Button>
          <Button
            onClick={clearFilters}
            bg={bgColor}
            border={`1px solid ${borderColor}`}
            color={textColor}
            w={["100%", "100%", "120px", "120px"]}
          >
            Clear
          </Button>
        </Flex>
      </Box>

      {/* Data Display Section */}
      {Data.length > 0 && (
        <Box
          bg={bgColor}
          border={`1px solid ${borderColor}`}
          mt="12px"
          py="17px"
          px="18px"
          rounded="10px"
        >
          <Flex
            as="button"
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            alignItems="center"
            cursor="pointer"
            mt="20px"
          >
            <Text color={primaryColor} fontWeight="600" fontSize="16px">
              Advanced Search Filter
            </Text>
            <Box ml="8px" color={primaryColor}>
              <FaFilter />
            </Box>
          </Flex>
          {showAdvancedFilter && (
            <AdvancedSearchFilter
              fields={advancedFilterFields}
              payload={payload}
              onInputChange={handleInputChange}
              onPatientSelect={handlePatientSelect}
              onFilter={fetchFinancialReport}
              onClear={clearFilters}
            />
          )}
          <Flex justifyContent="space-between" alignItems="center" mb="16px">
            <HStack>
              <Text color={titleTextColor} fontWeight="600" fontSize="16px">
                Report Results
              </Text>
              <Text color={subTitleTextColor} fontWeight="400" fontSize="15px">
                ({Data.length})
              </Text>
            </HStack>

            <Button
              rightIcon={<FaCloudDownloadAlt />}
              onClick={downloadReport}
              bg={bgColor}
              border={`1px solid ${primaryColor}`}
              color={primaryColor}
              w={["100%", "100%", "144px", "144px"]}
            >
              Download
            </Button>
          </Flex>

          <Box overflowX="auto">
            <TableContainer>
              <Table variant="striped">
                <Thead bg={bgColor}>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Patient Details
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Payment Type
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Payment Category
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Amount
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Quantity
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Cashier ID
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#534D59"
                      fontWeight="600"
                    >
                      Cashier Email
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Status
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Payment Reference
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#534D59"
                      fontWeight="600"
                    >
                      Date
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {PaginatedData.map((item, index) => (
                    <Tr key={index}>
                      <Td fontSize="14px">{indexOfFirstItem + index + 1}</Td>
                      <Td>
                        <HStack>
                          <Avatar
                            size="sm"
                            name={`${item.patientFirstName} ${item.patientLastName}`}
                          />
                          <Box>
                            <Text
                              color={"#101828"}
                              fontWeight={"500"}
                              fontSize={"13px"}
                            >
                              {`${item.patientFirstName} ${item.patientLastName}`}
                            </Text>
                            <Text
                              color={"#667085"}
                              fontWeight={"400"}
                              fontSize={"11px"}
                            >
                              MRN: {item.patientMRN}
                            </Text>
                          </Box>
                        </HStack>
                      </Td>
                      <Td fontSize="14px">{item.paymentype}</Td>
                      <Td fontSize="14px">{item.paymentcategory}</Td>
                      <Td fontSize="14px">{item.amount}</Td>
                      <Td fontSize="14px">{item.qty}</Td>
                      <Td fontSize="14px">{item.cashierid}</Td>
                      <Td fontSize="14px">{item.cashieremail}</Td>
                      <Td>
                        <HStack color={getStatusColor(item.status)}>
                          <Box
                            rounded="100%"
                            w="8px"
                            h="8px"
                            bg={getStatusColor(item.status)}
                          ></Box>
                          <Text
                            fontWeight="400"
                            fontSize="13px"
                            textTransform="capitalize"
                          >
                            {item.status}
                          </Text>
                        </HStack>
                      </Td>
                      <Td fontSize="14px">{item.paymentreference}</Td>
                      <Td fontSize="14px">
                        {moment(item.createdAt).format("DD/MM/YYYY")}
                      </Td>
                    </Tr>
                  ))}
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
        </Box>
      )}
    </>
  );
}
