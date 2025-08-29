import React, { useState } from "react";
import { Text, Flex, HStack, Box, SimpleGrid } from "@chakra-ui/react";
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

export default function FinancialReport() {
  const [IsLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [payload, setPayload] = useState({
    startDate: "",
    endDate: "",
    patient: "",
    paymentType: "",
    patientId: "",
    amount: "",
  });

  const handlePatientSelect = (patient) => {
    setPayload({ ...payload, patient: patient?._id || "" });
  };

  const advancedFilterFields = [
    {
      name: "patient",
      label: "Search Patient (First, Last Name)",
      type: "patient-search",
      placeholder: "Enter patient's name",
    },
    {
      name: "patientId",
      label: "Patient ID",
      type: "text",
      placeholder: "Enter patient ID",
    },
    {
      name: "paymentType",
      label: "Payment Type",
      type: "text",
      placeholder: "Enter payment type",
    },
    {
      name: "amount",
      label: "Amount",
      type: "text",
      placeholder: "Enter amount",
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

    // Log the payload being sent to the API
    console.log("API Request Payload:", payload);

    try {
      const result = await GetMedicalReportAPI(
        { filters: payload },
        "financialreport"
      );

      // Console log the full API response
      console.log("API Response - Full Result:", result);
      console.log("API Response - Data:", result?.data);
      console.log("API Response - Query Result:", result?.data?.queryresult);
      console.log(
        "API Response - Query Result Type:",
        typeof result?.data?.queryresult
      );
      console.log(
        "API Response - Query Result Length:",
        result?.data?.queryresult?.length
      );

      setPayload({
        startDate: payload.startDate,
        endDate: payload.endDate,
        patient: "",
        paymentType: "",
        patientId: "",
        amount: "",
      });
      setData(result.data.queryresult || []);

      // Log the data after setting it to state
      console.log("Data state after setData:", result.data.queryresult || []);

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
      // Console log any errors
      console.error("API Error:", e);
      console.error("Error Message:", e.message);
      console.error("Error Response:", e.response);
      console.error("Error Status:", e.response?.status);
      console.error("Error Data:", e.response?.data);

      setIsLoading(false);
      setShowToast({
        show: true,
        message: "An error occurred while fetching the report",
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
      patient: "",
      paymentType: "",
      patientId: "",
      amount: "",
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
      "Patient ID": item.patientMRN,
      "Patient Name": `${item.patientFirstName} ${item.patientLastName}`,
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

  return (
    <>
      {IsLoading && <Preloader />}

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      {/* Header Section */}
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="20px"
        px="20px"
        rounded="10px"
      >
        <Text color="#1F2937" fontWeight="600" fontSize="17px">
          Financial Report
        </Text>
        <Text color="#667085" mt="8px" fontWeight="400" fontSize="14px">
          To generate a report, select a date range and click apply
        </Text>

        <SimpleGrid mt="20px" columns={{ base: 1, md: 2 }} spacing={4}>
          <Box>
            <Text color="#1F2937" fontWeight="500" fontSize="14px" mb="6px">
              From Date
            </Text>
            <Input
              type="date"
              name="startDate"
              onChange={handleInputChange}
              value={payload.startDate}
              bColor="#E4E4E4"
              leftIcon={<FaCalendarAlt />}
            />
          </Box>

          <Box>
            <Text color="#1F2937" fontWeight="500" fontSize="14px" mb="6px">
              To Date
            </Text>
            <Input
              type="date"
              name="endDate"
              onChange={handleInputChange}
              value={payload.endDate}
              bColor="#E4E4E4"
              leftIcon={<FaCalendarAlt />}
            />
          </Box>
        </SimpleGrid>

        <Flex mt="20px" gap="12px" flexWrap="wrap">
          <Button
            onClick={fetchFinancialReport}
            background="#1F2937"
            color="#fff"
            w={["100%", "100%", "120px", "120px"]}
          >
            Apply
          </Button>
          <Button
            onClick={clearFilters}
            background="#fff"
            border="1px solid #E4E4E4"
            color="#667085"
            w={["100%", "100%", "120px", "120px"]}
          >
            Clear
          </Button>
        </Flex>
      </Box>

      {/* Data Display Section */}
      {Data.length > 0 && (
        <Box
          bg="#fff"
          border="1px solid #EFEFEF"
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
            <Text color="blue.blue500" fontWeight="600" fontSize="16px">
              Advanced Search Filter
            </Text>
            <Box ml="8px" color="blue.blue500">
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
              <Text color="#1F2937" fontWeight="600" fontSize="16px">
                Report Results
              </Text>
              <Text color="#667085" fontWeight="400" fontSize="15px">
                ({Data.length})
              </Text>
            </HStack>

            <Button
              rightIcon={<FaCloudDownloadAlt />}
              onClick={downloadReport}
              background="#f8ddd1"
              border="1px solid #EA5937"
              color="blue.blue500"
              w={["100%", "100%", "144px", "144px"]}
            >
              Download
            </Button>
          </Flex>

          <Box overflowX="auto">
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
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#534D59"
                      fontWeight="600"
                    >
                      Patient ID
                    </Th>
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
                      Payment Type
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#534D59"
                      fontWeight="600"
                    >
                      Payment Category
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#534D59"
                      fontWeight="600"
                    >
                      Amount
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#534D59"
                      fontWeight="600"
                    >
                      Quantity
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
                      Date
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {PaginatedData.map((item, index) => (
                    <Tr key={index}>
                      <Td fontSize="14px">{index + 1}</Td>
                      <Td fontSize="14px">{item.patientMRN}</Td>
                      <Td fontSize="14px">{`${item.patientFirstName} ${item.patientLastName}`}</Td>
                      <Td fontSize="14px">{item.paymentype}</Td>
                      <Td fontSize="14px">{item.paymentcategory}</Td>
                      <Td fontSize="14px">{item.amount}</Td>
                      <Td fontSize="14px">{item.qty}</Td>
                      <Td fontSize="14px">{item.status}</Td>
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
