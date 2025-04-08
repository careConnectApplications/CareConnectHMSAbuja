import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Pagination from "../Components/Pagination";
import TableRowY from "../Components/TableRowY";
import { configuration } from "../Utils/Helpers";
import InsulinChartModal from "../Components/InsulinChartModal";
import { ReadAllInsulinByAdmissionApi } from "../Utils/ApiCalls";

const getAdmissionId = () => {
  let admissionId = localStorage.getItem("admissionId");
  const storedAdmission = localStorage.getItem("inPatient");
  if (!admissionId && storedAdmission) {
    try {
      const patient = JSON.parse(storedAdmission);
      if (patient.admission && Array.isArray(patient.admission)) {
        admissionId = patient.admission[0];
      }
    } catch (err) {
      admissionId = localStorage.getItem("admissionId");
    }
  }
  return admissionId;
};

const InsulinChart = () => {
  // States for data, filtering, and pagination.
  const [insulinData, setInsulinData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = configuration.sizePerPage;

  // States for date filtering and filter criteria.
  const [byDate, setByDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterByCriteria, setFilterByCriteria] = useState("all");

  // Modal state for insulin chart creation/editing.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedInsulinChart, setSelectedInsulinChart] = useState(null);

  // Trigger for re-fetching data.
  const [trigger, setTrigger] = useState(false);
  const admissionId = getAdmissionId();

  // Fetch insulin chart data.
  const fetchInsulinData = async () => {
    try {
      if (!admissionId) {
        console.error("No admission ID found");
        return;
      }
      const result = await ReadAllInsulinByAdmissionApi(admissionId);
      const charts =
        result &&
        result.queryresult &&
        Array.isArray(result.queryresult.insulindetails)
          ? result.queryresult.insulindetails
          : [];
      setInsulinData(charts);
      setFilteredData(charts);
    } catch (error) {
      console.error("Error fetching insulin charts:", error);
    }
  };

  useEffect(() => {
    fetchInsulinData();
  }, [admissionId, trigger]);

  // Filtering logic based on selected criteria.
  useEffect(() => {
    if (filterByCriteria === "all") {
      setFilteredData(insulinData);
    } else if (filterByCriteria === "insulinType") {
      setFilteredData(
        insulinData.filter((item) =>
          item.typeofinsulin.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    } else if (filterByCriteria === "date") {
      if (startDate && endDate) {
        let endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        let formattedEndDate = endDateObj.toISOString().split("T")[0];
        setFilteredData(
          insulinData.filter((item) => {
            const itemDate = new Date(item.dateandtimeofbloodglucosemonitoring)
              .toISOString()
              .split("T")[0];
            return itemDate >= startDate && itemDate <= formattedEndDate;
          })
        );
      } else {
        setFilteredData(insulinData);
      }
    }
    setCurrentPage(1);
  }, [filterByCriteria, searchInput, startDate, endDate, insulinData]);

  // Pagination calculation.
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Modal handlers.
  const handleAddInsulinChart = () => {
    setModalType("create");
    setSelectedInsulinChart(null);
    setIsModalOpen(true);
  };

  const handleEditInsulinChart = (chart) => {
    setModalType("edit");
    setSelectedInsulinChart(chart);
    setIsModalOpen(true);
  };

  const handleViewInsulinChart = (chart) => {
    setModalType("view");
    setSelectedInsulinChart(chart);
    setIsModalOpen(true);
  };

  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px="18px"
      rounded="10px"
    >
      {/* Header Section */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
        <Button
          rightIcon={<SlPlus />}
          onClick={handleAddInsulinChart}
          w={["100%", "100%", "250px", "250px"]}
        >
          Add Insulin Chart
        </Button>
        {/* Search and Filter on the same line */}
        <Flex
          flexWrap="wrap"
          mt={["10px", "10px", "0", "0"]}
          alignItems="center"
          justifyContent="flex-end"
        >
          <HStack spacing="4">
            {/* Search Input (or Date Inputs if byDate is true) */}
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
                <HStack flex="1" spacing="2" flexWrap="nowrap">
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
                    onClick={() => {}}
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
            {/* Filter Menu */}
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
                    setFilterByCriteria("insulinType");
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
                    <Text>by Insulin Type</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilterByCriteria("date");
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
                    setFilterByCriteria("all");
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
      <Box mt="12px" py="15px" px="15px" rounded="10px" overflowX="auto">
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Date
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Insulin Type
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  RBS Value
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Dosage
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Route
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Sign
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((item) => (
                <TableRowY
                  key={item._id}
                  type="insulin-chart"
                  date={new Date(
                    item.dateandtimeofbloodglucosemonitoring
                  ).toLocaleString()}
                  insulinType={item.typeofinsulin}
                  rbsValue={item.premealbloodglucoselevel}
                  dosage={item.dosage}
                  route={item.route}
                  insulinSign={item.staffname}
                  onEdit={() => handleEditInsulinChart(item)}
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

      {/* Insulin Chart Modal Integration */}
      <InsulinChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        admissionId={modalType === "create" ? getAdmissionId() : undefined}
        onSuccess={() => setTrigger((prev) => !prev)}
        type={modalType}
        initialData={modalType !== "create" ? selectedInsulinChart : null}
      />
    </Box>
  );
};

export default InsulinChart;
