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
import * as XLSX from 'xlsx/xlsx.mjs';
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

export default function OutPatientReport() {
  const [IsLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [payload, setPayload] = useState({
    startDate: "",
    endDate: "",
    patient: "",
    gender: "",
    minAge: "",
    maxAge: "",
    doctor: "",
    visitType: "",
  });

  const handlePatientSelect = (patient) => {
    setPayload({ ...payload, patient: patient?._id || "" });
  };

  const advancedFilterFields = [
    { name: "patient", label: "Search Patient (First, Last Name)", type: "patient-search", placeholder: "Enter patient name" },
    {
      name: "gender", label: "Gender", type: "select", placeholder: "Select gender", options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
    },
    { name: "minAge", label: "Min Age", type: "number", placeholder: "Min Age" },
    { name: "maxAge", label: "Max Age", type: "number", placeholder: "Max Age" },
    { name: "doctor", label: "Doctor", type: "text", placeholder: "Enter doctor's name" },
    {
      name: "visitType", label: "Visit Type", type: "select", placeholder: "Select visit type", options: [
        { value: "first-visit", label: "First Visit" },
        { value: "follow-up", label: "Follow-up" },
      ],
    },
  ];

  // Pagination settings
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage || 10);

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

  const fetchOutPatientReport = async () => {
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
    try {
      const result = await GetMedicalReportAPI({ filters: payload }, "outpatient");
      console.log("Out-patient report API response:", result.data.queryresult);
      setPayload({
        startDate: payload.startDate,
        endDate: payload.endDate,
        doctorname: "",
        status: "",
        gender: "",
        minAge: "",
        maxAge: "",
        wardName: "",
        patient: "",
      });
      setData(result.data.queryresult);
      setIsLoading(false);
      setShowToast({
        show: true,
        message: "Out-patient report data fetched successfully",
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
      patient: "",
      gender: "",
      minAge: "",
      maxAge: "",
      doctor: "",
      visitType: "",
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Out-Patient Report");
    let date = moment(Date.now()).format("DD-MM-YYYY");
    XLSX.writeFile(workbook, `Out_Patient_Report_${date}.xlsx`);
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
          Out-Patient Report
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
            onClick={fetchOutPatientReport}
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
              onFilter={fetchOutPatientReport}
              onClear={clearFilters}
            />
          )}
          <Flex justifyContent="space-between" alignItems="center" my="16px">
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
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Patient Name
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      MRN
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Age
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Appointment Type
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Gender
                    </Th>

                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Date
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Clinic
                    </Th>

                  </Tr>
                </Thead>
                <Tbody>
                  {PaginatedData.map((item, index) => (
                    <Tr key={index}>
                      <Td fontSize="14px">
                        <HStack>
                          <Avatar name={`${item.firstName} ${item.lastName}`} size="sm" />
                          <Text>{`${item.firstName} ${item.lastName}`}</Text>
                        </HStack>
                      </Td>
                      <Td fontSize="14px">{item.MRN}</Td>
                      <Td fontSize="14px">{item.age}</Td>
                      <Td fontSize="14px">{item.appointmenttype}</Td>
                      <Td fontSize="14px">{item.gender}</Td>
                      <Td fontSize="14px">{moment(item.createdAt).format("LL")}</Td>
                      <Td fontSize="14px">{item.clinic}</Td>

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
