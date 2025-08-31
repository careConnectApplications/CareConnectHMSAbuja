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

export default function ImmunizationReport() {
  const [IsLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [payload, setPayload] = useState({
    startDate: "",
    endDate: "",
    firstName: "",
    lastName: "",
    MRN: "",
    vaccinetype: "",
    staffname: "",
    schedule: "",
    vaccination: "",
    immunizationstatus: "",
    anynotedadverseeffect: "",
    manufacturer: "",
    batchno: "",
  });

  const handlePatientSelect = (patient) => {
    setPayload({
      ...payload,
      firstName: patient?.firstName || "",
      lastName: patient?.lastName || "",
      MRN: patient?.MRN || "",
    });
  };

  const advancedFilterFields = [
    {
      name: "firstName",
      label: "Patient First Name",
      type: "text",
      placeholder: "Enter patient first name",
    },
    {
      name: "lastName",
      label: "Patient Last Name",
      type: "text",
      placeholder: "Enter patient last name",
    },
    {
      name: "MRN",
      label: "Patient MRN",
      type: "text",
      placeholder: "Enter patient MRN",
    },
    {
      name: "vaccinetype",
      label: "Vaccine Type",
      type: "text",
      placeholder: "Enter vaccine type",
    },
    {
      name: "staffname",
      label: "Attending Staff",
      type: "text",
      placeholder: "Enter staff's name",
    },
    {
      name: "schedule",
      label: "Schedule",
      type: "text",
      placeholder: "Enter schedule",
    },
    {
      name: "vaccination",
      label: "Vaccination",
      type: "text",
      placeholder: "Enter vaccination",
    },
    {
      name: "immunizationstatus",
      label: "Immunization Status",
      type: "text",
      placeholder: "Enter status",
    },
    {
      name: "anynotedadverseeffect",
      label: "Adverse Effect",
      type: "text",
      placeholder: "Enter adverse effect",
    },
    {
      name: "manufacturer",
      label: "Manufacturer",
      type: "text",
      placeholder: "Enter manufacturer",
    },
    {
      name: "batchno",
      label: "Batch No",
      type: "text",
      placeholder: "Enter batch number",
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

  const fetchImmunizationReport = async () => {
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

    try {
      const result = await GetMedicalReportAPI(
        { filters: filteredPayload },
        "immunizationreport"
      );
      setData(result.data.queryresult);
      setIsLoading(false);
      setShowToast({
        show: true,
        message: "Immunization report data fetched successfully",
        status: "success",
      });
      setTimeout(() => {
        setShowToast({ show: false });
      }, 3000);
    } catch (e) {
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
      firstName: "",
      lastName: "",
      MRN: "",
      vaccinetype: "",
      staffname: "",
      schedule: "",
      vaccination: "",
      immunizationstatus: "",
      anynotedadverseeffect: "",
      manufacturer: "",
      batchno: "",
    });
    setData([]);
    setCurrentPage(1);
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

    var workbook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.json_to_sheet(Data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Immunization Report");
    let date = moment(Date.now()).format("DD-MM-YYYY");
    XLSX.writeFile(workbook, `Immunization_Report_${date}.xlsx`);
  };

  // Function to determine status color based on specific status values
  const getStatusColor = (status) => {
    if (!status) return "#667085";

    const statusLower = status.toLowerCase();
    if (statusLower.includes("completed")) {
      return "#027A48"; // Green for completed
    } else if (statusLower.includes("pending")) {
      return "#FFA30C"; // Orange for pending
    } else if (
      statusLower.includes("cancelled") ||
      statusLower.includes("rejected")
    ) {
      return "#F04438"; // Red for cancelled/rejected
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
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="20px"
        px="20px"
        rounded="10px"
      >
        <Text color="#1F2937" fontWeight="600" fontSize="17px">
          Immunization Report
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
            onClick={fetchImmunizationReport}
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

          <Flex
            as="button"
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            alignItems="center"
            cursor="pointer"
            mb="20px"
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
              onFilter={fetchImmunizationReport}
              onClear={clearFilters}
            />
          )}

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
                      Patient Name
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
                      Age
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#534D59"
                      fontWeight="600"
                    >
                      Gender
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#534D59"
                      fontWeight="600"
                    >
                      Vaccination
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#534D59"
                      fontWeight="600"
                    >
                      Schedule
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#534D59"
                      fontWeight="600"
                    >
                      Dose
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#534D59"
                      fontWeight="600"
                    >
                      Vaccine Type
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#534D59"
                      fontWeight="600"
                    >
                      Batch No
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#534D59"
                      fontWeight="600"
                    >
                      Manufacturer
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#534D59"
                      fontWeight="600"
                    >
                      Adverse Effect
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
                      Attending Nurse
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
                      <Td fontSize="14px">
                        <HStack>
                          <Avatar
                            name={`${item.firstName} ${item.lastName}`}
                            size="sm"
                          />
                          <Text>{`${item.firstName} ${item.lastName}`}</Text>
                        </HStack>
                      </Td>
                      <Td fontSize="14px">{item.MRN}</Td>
                      <Td fontSize="14px">{item.age}</Td>
                      <Td fontSize="14px">{item.gender}</Td>
                      <Td fontSize="14px">{item.vaccination}</Td>
                      <Td fontSize="14px">{item.schedule}</Td>
                      <Td fontSize="14px">{item.dose}</Td>
                      <Td fontSize="14px">{item.vaccinetype}</Td>
                      <Td fontSize="14px">{item.batchno}</Td>
                      <Td fontSize="14px">{item.manufacturer}</Td>
                      <Td fontSize="14px">
                        {item.anynotedadverseeffect === "Yes"
                          ? `${item.adverseeffectseverity || "Adverse Effect"}`
                          : "None"}
                      </Td>
                      <Td>
                        <HStack color={getStatusColor(item.immunizationstatus)}>
                          <Box
                            rounded="100%"
                            w="8px"
                            h="8px"
                            bg={getStatusColor(item.immunizationstatus)}
                          ></Box>
                          <Text
                            fontWeight="400"
                            fontSize="13px"
                            textTransform="capitalize"
                          >
                            {item.immunizationstatus}
                          </Text>
                        </HStack>
                      </Td>
                      <Td fontSize="14px">{item.staffname}</Td>
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
