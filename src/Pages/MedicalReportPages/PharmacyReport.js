import React, { useState, useEffect } from "react";
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
import { GetMedicalReportAPI, GetAllUsersApi } from "../../Utils/ApiCalls";
import moment from "moment";
import AdvancedSearchFilter from "../../Components/AdvancedSearchFilter";
import { FaFilter } from "react-icons/fa";

export default function PharmacyReport() {
  const [IsLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [Users, setUsers] = useState([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [payload, setPayload] = useState({
    startDate: "",
    endDate: "",
    patient: "",
    prescription: "",
    prescribersname: "",
    dispensestatus: "",
  });

  const handlePatientSelect = (patient) => {
    setPayload({ ...payload, patient: patient?._id || "" });
  };

  const getUsers = async () => {
    try {
      const result = await GetAllUsersApi();
      setUsers(result.queryresult.userdetails);
    } catch (e) {}
  };

  useEffect(() => {
    getUsers();
  }, []);

  const advancedFilterFields = [
    {
      name: "patient",
      label: "Search Patient (First, Last Name)",
      type: "patient-search",
      placeholder: "Enter patient's name",
    },
    {
      name: "prescription",
      label: "Drug",
      type: "text",
      placeholder: "Enter drug name",
    },
    {
      name: "prescribersname",
      label: "Prescribing Doctor",
      type: "select",
      placeholder: "Select doctor",
      options: Users.filter(
        (user) => user.role === "Medical Doctor"
      ).map((user) => ({
        value: user.firstName + " " + user.lastName,
        label: user.firstName + " " + user.lastName,
      })),
    },
    {
      name: "dispensestatus",
      label: "Status",
      type: "select",
      placeholder: "Select status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "reject", label: "Reject" },
        { value: "awaiting confirmation", label: "Awaiting Confirmation" },
      ],
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

  const fetchPharmacyReport = async () => {
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
      const result = await GetMedicalReportAPI(
        { filters: payload },
        "pharmacyreport"
      );

      setData(result.data.queryresult || []);
      setIsLoading(false);
      setShowToast({
        show: true,
        message: "Pharmacy report data fetched successfully",
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
      prescription: "",
      prescribersname: "",
      dispensestatus: "",
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

    let reportData = Data.map((item) => ({
      "Patient Name": `${item.patientFirstName} ${item.patientLastName}`,
      "Patient MRN": item.patientMRN,
      Drug: item.prescription,
      Pharmacy: item.pharmacy,
      Dosage: item.dosage,
      Duration: item.duration,
      Frequency: item.frequency,
      Quantity: item.qty,
      "Prescribing Doctor": item.prescribersname,
      "Dispense Status": item.dispensestatus,
      "Serve Status": item.servedstatus,
      "HMO Name": item.patientHMOName,
      "HMO ID": item.patientHMOId,
      Date: moment(item.createdAt).format("YYYY-MM-DD"),
    }));

    var workbook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.json_to_sheet(reportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pharmacy Report");
    let date = moment(Date.now()).format("DD-MM-YYYY");
    XLSX.writeFile(workbook, `Pharmacy_Report_${date}.xlsx`);
  };

  const getStatusColor = (status) => {
    if (!status) return "#667085"; // Default gray for no status

    const statusLower = status.toLowerCase();
    if (statusLower.includes("pending")) {
      return "#FFA30C"; // Orange for pending
    } else if (statusLower.includes("reject")) {
      return "#D92D20"; // Red for reject
    } else if (statusLower.includes("awaiting confirmation")) {
      return "#FFA30C"; // Orange for awaiting confirmation
    } else {
      return "#027A48"; // Green for all other statuses
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
          Pharmacy Report
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
            onClick={fetchPharmacyReport}
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
              onFilter={fetchPharmacyReport}
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
                      Drug
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
                      Prescribing Doctor
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
                      <Td fontSize="14px">
                        <HStack>
                          <Avatar
                            name={`${item.patientFirstName} ${item.patientLastName}`}
                            size="sm"
                          />
                          <Text>{`${item.patientFirstName} ${item.patientLastName}`}</Text>
                        </HStack>
                      </Td>
                      <Td fontSize="14px">{item.patientMRN}</Td>
                      <Td fontSize="14px">{item.prescription}</Td>
                      <Td fontSize="14px">{item.qty}</Td>
                      <Td fontSize="14px">{item.prescribersname}</Td>
                      <Td>
                        <HStack color={getStatusColor(item.dispensestatus)}>
                          <Box
                            rounded="100%"
                            w="8px"
                            h="8px"
                            bg={getStatusColor(item.dispensestatus)}
                          ></Box>
                          <Text
                            fontWeight="400"
                            fontSize="13px"
                            textTransform="capitalize"
                          >
                            {item.dispensestatus}
                          </Text>
                        </HStack>
                      </Td>
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
