import React, { useState, useEffect } from "react";
import { Text, Flex, HStack, Box, SimpleGrid } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer, Avatar
} from "@chakra-ui/react";
import * as XLSX from 'xlsx/xlsx.mjs';
import Button from "../../Components/Button";
import Input from "../../Components/Input";
import Preloader from "../../Components/Preloader";
import ShowToast from "../../Components/ToastNotification";
import { FaCalendarAlt, FaCloudDownloadAlt } from "react-icons/fa";
import Pagination from "../../Components/Pagination";
import { configuration } from "../../Utils/Helpers";
import { GetMedicalReportAPI, GetAllWardApi } from "../../Utils/ApiCalls";
import moment from "moment";
import AdvancedSearchFilter from "../../Components/AdvancedSearchFilter";
import { FaFilter } from "react-icons/fa";
export default function InPatientReport() {
  const [IsLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [WardOptions, setWardOptions] = useState([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [payload, setPayload] = useState({
    startDate: "",
    endDate: "",
    patient: "",
    doctorname: "",
    status: "",
    gender: "",
    minAge: "",
    maxAge: "",
    ageInDays: "",
    ageInMonths: "",
    ageInYears: "",
    wardname: "",
    HMOName: "",
    admittospecialization: "",
  });

  const handlePatientSelect = (patient) => {
    setPayload({ ...payload, patient: patient?._id || "" });
  };

  const getAllWard = async () => {
    try {
      const result = await GetAllWardApi();
      setWardOptions(result.queryresult.wardmanagementdetails);
      console.log("wards", result.queryresult.wardmanagementdetails);
    } catch (e) {
      // activateNotifications(e.message, "error");
    }
  };

  const advancedFilterFields = [
    { name: "patient", label: "Search Patient (First, Last Name)", type: "patient-search", placeholder: "Enter patient name" },
    { name: "doctorname", label: "Admitted By", type: "text", placeholder: "Enter referrer" },
    {
      name: "status", label: "Admission Status", type: "select", placeholder: "Select status", options: [
        { value: "admitted", label: "Admitted" },
        { value: "discharged", label: "Discharged" },
      ],
    },
    {
      name: "gender", label: "Gender", type: "select", placeholder: "Select gender", options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
    },
    { name: "minAge", label: "Min Age", type: "number", placeholder: "Min Age" },
    { name: "maxAge", label: "Max Age", type: "number", placeholder: "Max Age" },
    { name: "ageInDays", label: "Age In Days", type: "number", placeholder: "Days" },
    { name: "ageInMonths", label: "Age In Months", type: "number", placeholder: "Months" },
    { name: "ageInYears", label: "Age In Years", type: "number", placeholder: "Years" },
    {
      name: "wardname",
      label: "ward Name",
      type: "select",
      placeholder: "Select ward",
      options: WardOptions.map((ward) => ({
        value: ward.wardname,
        label: ward.wardname,
      })),
    },
    { name: "HMOName", label: "HMO Name", type: "text", placeholder: "Enter HMO name" },
    { name: "admittospecialization", label: "Specialization", type: "text", placeholder: "Enter specialization" },
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

  const fetchInPatientReport = async () => {
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
      const result = await GetMedicalReportAPI({ filters: payload }, "inpatient");
      console.log("medical report", result);
      setData(result.data.queryresult);

      setTimeout(() => {

        setIsLoading(false);
        setShowToast({
          show: true,
          message: "In-patient report data fetched successfully",
          status: "success",
        });
        setTimeout(() => {
          setShowToast({ show: false });
        }, 3000);

      }, 1000);


    } catch (e) {

    }



    // TODO: Implement API call to fetch in-patient reports
    // Example: const result = await GetInPatientReportApi(payload);

    // Simulated data for demonstration

  };

  const clearFilters = () => {
    setPayload({
      startDate: "",
      endDate: "",
      patient: "",
      doctorname: "",
      status: "",
      gender: "",
      minAge: "",
      maxAge: "",
      ageInDays: "",
      ageInMonths: "",
      ageInYears: "",
      wardname: "",
      HMOName: "",
      admittospecialization: "",
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "In-Patient Report");
    let date = moment(Date.now()).format("DD-MM-YYYY");
    XLSX.writeFile(workbook, `In_Patient_Report_${date}.xlsx`);
  };


  useEffect(() => {
    // Fetch in-patient reports when the component mounts
    getAllWard();
  }, []);

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
          In-Patient Report
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
            onClick={fetchInPatientReport}
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
              onFilter={fetchInPatientReport}
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
                      Gender
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      HMO Name
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Admission Date
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Referred Date
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Ward
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Specialization
                    </Th>

                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Admitting Doctor
                    </Th>

                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Status
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {PaginatedData.map((item, index) => (
                    <Tr key={index}>
                      <Td fontSize="14px">
                        <HStack cursor={"pointer"}>
                          <Avatar
                            name={`${item.firstName} ${item.lastName}`}
                            size="sm"
                            src="https://bit.ly/tioluwani-kolawole"
                          />
                          <Box>
                            <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                              {`${item.firstName} ${item.lastName}`}
                            </Text>

                          </Box>
                        </HStack>
                      </Td>
                      <Td fontSize="14px">{item.MRN}</Td>
                      <Td fontSize="14px">{item.age}</Td>
                      <Td fontSize="14px">{item.gender}</Td>
                      <Td fontSize="14px">{item.HMOName}</Td>
                      <Td fontSize="14px">{moment(item.createdAt).format("LL")}</Td>
                      <Td fontSize="14px">{moment(item.referddate).format("LL")}</Td>
                      <Td fontSize="14px">{item.wardname}</Td>
                      <Td fontSize="14px">{item.admittospecialization}</Td>
                      <Td fontSize="14px">{item.doctorname}</Td>
                      <Td fontSize="14px">{item.status}</Td>
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
