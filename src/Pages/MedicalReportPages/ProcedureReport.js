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

export default function ProcedureReport() {
  const [IsLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [payload, setPayload] = useState({
    startDate: "",
    endDate: "",
    patient: "",
    procedure: "",
    MRN: "",
    clinic: "",
    raiseby: "",
    status: "",
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
      name: "MRN",
      label: "MRN",
      type: "text",
      placeholder: "Enter MRN",
    },
    {
      name: "procedure",
      label: "Procedure",
      type: "text",
      placeholder: "Enter procedure",
    },
    {
      name: "clinic",
      label: "Clinic",
      type: "text",
      placeholder: "Enter clinic",
    },
    {
      name: "raiseby",
      label: "Raised By",
      type: "text",
      placeholder: "Enter staff name",
    },
    {
      name: "status",
      label: "Status",
      type: "text",
      placeholder: "Enter status",
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

  const fetchProcedureReport = async () => {
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
        "procedurereport"
      );

      console.log("API Response - Full Result:", result);
      console.log("API Response - Data:", result?.data);
      console.log("API Response - Query Result:", result?.data?.queryresult);

      // Reset only the filter fields, keep date range
      setPayload({
        ...payload,
        patient: "",
        procedure: "",
        MRN: "",
        clinic: "",
        raiseby: "",
        status: "",
      });

      setData(result.data.queryresult || []);

      setIsLoading(false);
      setShowToast({
        show: true,
        message: "Procedure report data fetched successfully",
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
      patient: "",
      procedure: "",
      MRN: "",
      clinic: "",
      raiseby: "",
      status: "",
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
      "Patient Name": `${item.firstName} ${item.lastName}`,
      MRN: item.MRN,
      Age: item.age,
      Gender: item.gender,
      Procedure: item.procedure,
      "Indication/Diagnosis": item.indicationdiagnosisprocedure,
      Clinic: item.clinic,
      "Raised By": item.raiseby,
      Status: item.status,
      Date: moment(item.createdAt).format("YYYY-MM-DD"),
    }));

    var workbook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.json_to_sheet(reportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Procedure Report");
    let date = moment(Date.now()).format("DD-MM-YYYY");
    XLSX.writeFile(workbook, `Procedure_Report_${date}.xlsx`);

    console.log("Report downloaded with data:", reportData);
  };

  // Function to determine status color
  const getStatusColor = (status) => {
    if (!status) return "#667085";

    const statusLower = status.toLowerCase();
    if (
      statusLower.includes("processed") ||
      statusLower.includes("completed")
    ) {
      return "#027A48"; // Green for processed/completed
    } else if (
      statusLower.includes("inprogress") ||
      statusLower.includes("pending")
    ) {
      return "#FFA30C"; // Orange for in progress/pending
    } else {
      return "#FD4739"; // Red for any other status
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
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="20px"
        px="20px"
        rounded="10px"
      >
        <Text color="#1F2937" fontWeight="600" fontSize="17px">
          Procedure Report
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
            onClick={fetchProcedureReport}
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
              onFilter={fetchProcedureReport}
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
              h="40px"
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
                      color="#000000"
                      fontWeight="600"
                    >
                      Patient Details
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000000"
                      fontWeight="600"
                    >
                      Age
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000000"
                      fontWeight="600"
                    >
                      Gender
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000000"
                      fontWeight="600"
                    >
                      Procedure
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000000"
                      fontWeight="600"
                    >
                      Indication/Diagnosis
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000000"
                      fontWeight="600"
                    >
                      Clinic
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000000"
                      fontWeight="600"
                    >
                      Raised By
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000000"
                      fontWeight="600"
                    >
                      Date
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000000"
                      fontWeight="600"
                    >
                      Status
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {PaginatedData.map((item, index) => (
                    <Tr key={index}>
                      <Td>
                        <HStack>
                          <Avatar
                            size="sm"
                            name={`${item.firstName} ${item.lastName}`}
                          />
                          <Box>
                            <Text
                              color={"#101828"}
                              fontWeight={"500"}
                              fontSize={"13px"}
                            >
                              {`${item.firstName} ${item.lastName}`}
                            </Text>
                            <Text
                              color={"#667085"}
                              fontWeight={"400"}
                              fontSize={"11px"}
                            >
                              MRN: {item.MRN}
                            </Text>
                          </Box>
                        </HStack>
                      </Td>
                      <Td fontSize="14px">{item.age}</Td>
                      <Td fontSize="14px">{item.gender}</Td>
                      <Td fontSize="14px">{item.procedure}</Td>
                      <Td fontSize="14px">
                        {item.indicationdiagnosisprocedure}
                      </Td>
                      <Td fontSize="14px">{item.clinic}</Td>
                      <Td fontSize="14px">{item.raiseby}</Td>
                      <Td fontSize="14px">
                        {moment(item.createdAt).format("DD/MM/YYYY")}
                      </Td>
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
