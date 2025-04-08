import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Spinner,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";
import TableRowY from "../Components/TableRowY";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import { ReadAllBloodMonitoringByAdmissionApi } from "../Utils/ApiCalls";
import BloodMonitoringChartModal from "../Components/BloodMonitoringChartModal";

const BloodMonitoringChart = () => {
  // State for API data, filtered data, loading, error, etc.
  const [bloodData, setBloodData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter and pagination state.
  const [filter, setFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [byDate, setByDate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = configuration.sizePerPage;

  // Modal state for creating/editing a blood monitoring chart.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [modalType, setModalType] = useState("create");
  const [refreshData, setRefreshData] = useState(false);

  // Retrieve admissionId from localStorage.
  const storedPatient = localStorage.getItem("inPatient");
  let patient = storedPatient ? JSON.parse(storedPatient) : null;
  const admissionId =
    patient && patient.admission && Array.isArray(patient.admission)
      ? patient.admission[0]
      : localStorage.getItem("admissionId");

  // Fetch blood monitoring data.
  useEffect(() => {
    if (admissionId) {
      setLoading(true);
      ReadAllBloodMonitoringByAdmissionApi(admissionId)
        .then((response) => {
          const data = response?.queryresult?.bloodmonitoringdetails || [];
          const transformedData = data.map((item) => ({
            id: item._id,
            date: new Date(item.createdAt).toLocaleDateString(),
            time: new Date(item.createdAt).toLocaleTimeString(),
            testType: item.typeoftestRBSFBS,
            rbsFbsValue: item.value,
            bloodMonitoringSign: item.staffname,
            specialization: item.admission?.admittospecialization || "N/A",
            ward: item.admission?.referedward || "N/A",
            createdBy: item.admission?.doctorname || "N/A",
          }));
          setBloodData(transformedData);
          setFilteredData(transformedData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching blood monitoring data:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [admissionId, refreshData]);

  // Filtering logic.
  useEffect(() => {
    if (filter === "all") {
      setFilteredData(bloodData);
    } else if (filter === "date") {
      if (startDate && endDate) {
        let endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        let formattedEndDate = endDateObj.toISOString().split("T")[0];
        setFilteredData(
          bloodData.filter((item) => {
            const itemDate = new Date(item.date).toISOString().split("T")[0];
            return itemDate >= startDate && itemDate <= formattedEndDate;
          })
        );
      } else {
        setFilteredData(bloodData);
      }
    } else if (filter === "testType") {
      setFilteredData(
        bloodData.filter((item) =>
          item.testType.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    } else if (filter === "createdBy") {
      setFilteredData(
        bloodData.filter((item) =>
          item.createdBy.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    }
    setCurrentPage(1);
  }, [filter, searchInput, startDate, endDate, bloodData]);

  // Pagination calculation.
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Modal handlers.
  const handleAddBloodMonitoringChart = () => {
    setModalType("create");
    setSelectedChart(null);
    setIsModalOpen(true);
  };

  const handleEditBloodMonitoringChart = (id) => {
    const chart = bloodData.find((item) => item.id === id);
    if (chart) {
      const modalChartData = {
        id: chart.id,
        typeoftestRBSFBS: chart.testType,
        value: chart.rbsFbsValue,
      };
      setModalType("edit");
      setSelectedChart(modalChartData);
      setIsModalOpen(true);
    }
  };

  return (
    <Box p={["10px", "20px"]}>
      {/* Header Section */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
        <Button
          rightIcon={<SlPlus />}
          onClick={handleAddBloodMonitoringChart}
          w={["100%", "100%", "260px", "260px"]}
        >
          Add Blood Monitoring Chart
        </Button>
        {/* Search and Filter Controls on the same line */}
        <Flex
          flexWrap="wrap"
          mt={["10px", "10px", "0", "0"]}
          alignItems="center"
          justifyContent="flex-end"
        >
          <HStack spacing="4">
            <Box flex="1">
              {!byDate ? (
                <Input
                  label="Search"
                  
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                  bColor="#E4E4E4"
                  leftIcon={<BiSearch />}
                />
              ) : (
                <HStack spacing="2" flex="1" flexWrap="nowrap">
                  <Input
                    placeholder="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    size="md"
                    variant="outline"
                    borderColor="#E4E4E4"
                    focusBorderColor="blue.blue500"
                  />
                  <Input
                    placeholder="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    size="md"
                    variant="outline"
                    borderColor="#E4E4E4"
                    focusBorderColor="blue.blue500"
                  />
                  <Flex
                    onClick={() => setFilter("date")}
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
            </Box>
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
                  onClick={() => {
                    setFilter("testType");
                    setByDate(false);
                    setSearchInput("");
                    setStartDate("");
                    setEndDate("");
                  }}
                  textTransform="capitalize"
                  fontWeight="500"
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>by Test Type</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilter("createdBy");
                    setByDate(false);
                    setSearchInput("");
                    setStartDate("");
                    setEndDate("");
                  }}
                  textTransform="capitalize"
                  fontWeight="500"
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>by Created By</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilter("date");
                    setByDate(true);
                  }}
                  textTransform="capitalize"
                  fontWeight="500"
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>by Date</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilter("all");
                    setSearchInput("");
                    setByDate(false);
                    setStartDate("");
                    setEndDate("");
                  }}
                  textTransform="capitalize"
                  fontWeight="500"
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Clear Filter</Text>
                  </HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Flex>

      {/* Table View */}
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        rounded="md"
        overflowX="auto"
        mt="12px"
        py="15px"
        px="15px"
      >
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" fontWeight="600">
                  Date
                </Th>
                <Th fontSize="13px" fontWeight="600">
                  Time
                </Th>
                <Th fontSize="13px" fontWeight="600">
                  Test Type
                </Th>
                <Th fontSize="13px" fontWeight="600">
                  RBS/FBS Value
                </Th>
                <Th fontSize="13px" fontWeight="600">
                  Sign
                </Th>
                <Th fontSize="13px" fontWeight="600">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((item) => (
                <TableRowY
                  key={item.id}
                  type="blood-monitoring-chart"
                  date={item.date}
                  bloodMonitoringTime={item.time}
                  testType={item.testType}
                  rbsFbsValue={item.rbsFbsValue}
                  bloodMonitoringSign={item.bloodMonitoringSign}
                  onEdit={() => handleEditBloodMonitoringChart(item.id)}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pagination */}
      {filteredData.length > itemsPerPage && (
        <Pagination
          postPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPosts={filteredData.length}
          paginate={setCurrentPage}
        />
      )}

      {/* Blood Monitoring Chart Modal Integration */}
      <BloodMonitoringChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        admissionId={admissionId}
        onSuccess={() => setRefreshData((prev) => !prev)}
        type={modalType}
        initialData={selectedChart}
      />
    </Box>
  );
};

export default BloodMonitoringChart;
