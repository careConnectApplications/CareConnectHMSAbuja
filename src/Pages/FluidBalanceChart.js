import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  TableContainer,
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";
import Pagination from "../Components/Pagination";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TableRowY from "../Components/TableRowY";
import { configuration } from "../Utils/Helpers";
import { ReadAllFluidBalanceByAdmissionApi } from "../Utils/ApiCalls";
import FluidBalanceModal from "../Components/FluidBalanceModal";

// Helper to retrieve admissionId.
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

const FluidBalanceChart = () => {
  const [fluidData, setFluidData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = configuration.sizePerPage;
  
  // States for date filtering and filter criteria.
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [filterByCriteria, setFilterByCriteria] = useState("all");

  // Modal state for Fluid Balance creation/editing.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create"); // "create" or "edit"
  const [selectedFluidBalance, setSelectedFluidBalance] = useState(null);

  // Trigger for refreshing data.
  const [trigger, setTrigger] = useState(false);

  const admissionId = getAdmissionId();

  // Fetch fluid balance data on mount and when trigger changes.
  useEffect(() => {
    const fetchFluidData = async () => {
      if (!admissionId) {
        console.error("No admission ID found");
        return;
      }
      try {
        const result = await ReadAllFluidBalanceByAdmissionApi(admissionId);
        const balances =
          result &&
          result.queryresult &&
          Array.isArray(result.queryresult.fluidbalancesdetails)
            ? result.queryresult.fluidbalancesdetails
            : [];
        setFluidData(balances);
        setFilteredData(balances);
      } catch (error) {
        console.error("Error fetching fluid balance data:", error);
      }
    };
    fetchFluidData();
  }, [admissionId, trigger]);

  // Filtering logic.
  useEffect(() => {
    if (filterByCriteria === "all") {
      setFilteredData(fluidData);
    } else if (filterByCriteria === "createdBy") {
      setFilteredData(
        fluidData.filter((item) =>
          item.staffname.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    } else if (filterByCriteria === "date") {
      if (StartDate && EndDate) {
        let endDateObj = new Date(EndDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        let formattedEndDate = endDateObj.toISOString().split("T")[0];
        setFilteredData(
          fluidData.filter((item) => {
            const createdOn = new Date(item.createdAt)
              .toISOString()
              .split("T")[0];
            return createdOn >= StartDate && createdOn <= formattedEndDate;
          })
        );
      } else {
        setFilteredData(fluidData);
      }
    }
    setCurrentPage(1);
  }, [filterByCriteria, searchInput, StartDate, EndDate, fluidData]);

  // Pagination calculation.
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Modal handlers.
  const handleAddFluidBalance = () => {
    setModalType("create");
    setSelectedFluidBalance(null);
    setIsModalOpen(true);
  };

  const handleEditFluidBalance = (fluidBalance) => {
    setModalType("edit");
    setSelectedFluidBalance(fluidBalance);
    setIsModalOpen(true);
  };

  const handleViewFluidBalance = (id) => {
    const selected = fluidData.find((item) => item._id === id);
    if (selected) {
      handleEditFluidBalance(selected);
    }
  };

  return (
    <Box p={["10px", "20px"]}>
      {/* Header Section */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
        <Button
          rightIcon={<SlPlus />}
          onClick={handleAddFluidBalance}
          w={["100%", "100%", "250px", "250px"]}
        >
          Add Fluid Balance Chart
        </Button>
        {/* Search and Filter Controls on the same line */}
        <Flex
flexWrap="wrap" mt={["10px", "10px", "0", "0"]} alignItems="center" justifyContent="flex-end"
        >
          <HStack spacing="4" >
            <Box flex="1">
              {!ByDate ? (
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
                    value={StartDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    size="md"
                    variant="outline"
                    borderColor="#E4E4E4"
                    focusBorderColor="blue.blue500"
                  />
                  <Input
                    placeholder="End Date"
                    type="date"
                    value={EndDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    size="md"
                    variant="outline"
                    borderColor="#E4E4E4"
                    focusBorderColor="blue.blue500"
                  />
                  <Flex
                    onClick={() => setFilterByCriteria("date")}
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
                    setFilterByCriteria("createdBy");
                    setByDate(false);
                    setSearchInput("");
                    setStartDate("");
                    setEndDate("");
                  }}
                  textTransform="capitalize"
                  fontWeight="500"
                  color="#2F2F2F"
                  _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                >
                  <HStack fontSize="14px">
                    <Text>by Created By</Text>
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
                  _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
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
                <Th fontSize="13px" fontWeight="600">IV Fluid Volume</Th>
                <Th fontSize="13px" fontWeight="600">Oral Fluids</Th>
                <Th fontSize="13px" fontWeight="600">Total Intake</Th>
                <Th fontSize="13px" fontWeight="600">Total Output</Th>
                <Th fontSize="13px" fontWeight="600">Net Fluid Balance</Th>
                <Th fontSize="13px" fontWeight="600">Created By</Th>
                <Th fontSize="13px" fontWeight="600">Created On</Th>
                <Th fontSize="13px" fontWeight="600">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((item) => (
                <TableRowY
                  key={item._id}
                  type="fluid-balance-chart"
                  intravenous={item.IVfluidvolume}
                  oral={item.oralfluids}
                  totalIntake={item.totalintake}
                  totalOutput={item.totaloutput}
                  netFluidBalance={item.netfliudbalancefor24hours}
                  createdBy={item.staffname}
                  createdOn={new Date(item.createdAt).toLocaleString()}
                  onEdit={() => handleViewFluidBalance(item._id)}
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

      {/* Fluid Balance Modal Integration */}
      <FluidBalanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        admissionId={getAdmissionId()}
        onSuccess={() => {
          // Refresh data after modal closes.
          (async () => {
            const admissionId = getAdmissionId();
            try {
              const result = await ReadAllFluidBalanceByAdmissionApi(admissionId);
              const balances =
                result &&
                result.queryresult &&
                Array.isArray(result.queryresult.fluidbalancesdetails)
                  ? result.queryresult.fluidbalancesdetails
                  : [];
              setFluidData(balances);
              setFilteredData(balances);
            } catch (error) {
              console.error("Error refreshing fluid balance data:", error);
            }
          })();
        }}
        type={modalType}
        initialData={modalType === "edit" ? selectedFluidBalance : null}
      />
    </Box>
  );
};

export default FluidBalanceChart;
