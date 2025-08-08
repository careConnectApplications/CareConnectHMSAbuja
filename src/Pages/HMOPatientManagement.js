import React, { useState, useEffect } from "react";
import {
  Text,
  Flex,
  Box,
  HStack,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import moment from "moment";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import TableRowY from "../Components/TableRowY"; // Handles type="hmo-patient-management"
import Button from "../Components/Button";
import Input from "../Components/Input";
import BulkUploadHMOPatientsModal from "../Components/BulkUploadHMOPatientsModal";
import ShowToast from "../Components/ToastNotification";
import Pagination from "../Components/Pagination";
import { GetAllHMOPatientsApi } from "../Utils/ApiCalls";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";

export default function HMOPatientManagement() {
  // Data states
  const [data, setData] = useState([]); // full dataset
  const [filterData, setFilterData] = useState([]); // dataset filtered by status
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState(null); // search filter result

  // Status filter states
  const [allStatus, setAllStatus] = useState(true);
  const [activeStatus, setActiveStatus] = useState(false);
  const [inactiveStatus, setInactiveStatus] = useState(false);

  // Date filter states
  const [byDate, setByDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Toast state
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  // Preloader state
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = configuration.sizePerPage; // using configuration posts per page

  // Determine which dataset to display: either the search/date-filtered data or the status-filtered data
  const dataToDisplay = filteredData !== null ? filteredData : filterData;

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatedData = dataToDisplay.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch all HMO patients from API
  const getAllPatients = async () => {
    try {
      setIsLoading(true);
      const result = await GetAllHMOPatientsApi();
      console.log("API Response - GetAllHMOPatientsApi:", result);
      // API returns patient details in queryresult.patientdetails
      setData(result.queryresult.patientdetails);
      setFilterData(result.queryresult.patientdetails);
      setFilteredData(null);
    } catch (error) {
      activateNotifications(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Notification function
  const activateNotifications = (message, status) => {
    setShowToast({ show: true, message, status });
    setTimeout(() => setShowToast({ show: false, message: "", status: "" }), 3000);
  };

  // Status filter functions
  const filterAllStatus = () => {
    setAllStatus(true);
    setActiveStatus(false);
    setInactiveStatus(false);
    setFilterData(data);
    setCurrentPage(1); // Reset pagination
    // Clear other filters when changing status
    setFilteredData(null);
    setSearchInput("");
    setByDate(false);
    setStartDate("");
    setEndDate("");
  };

  const filterActiveStatus = () => {
    setAllStatus(false);
    setActiveStatus(true);
    setInactiveStatus(false);
    const filtered = data.filter(
      (item) => item.isHMOCover.toLowerCase() === "yes"
    );
    setFilterData(filtered);
    setCurrentPage(1); // Reset pagination
    // Clear other filters when changing status
    setFilteredData(null);
    setSearchInput("");
    setByDate(false);
    setStartDate("");
    setEndDate("");
  };

  const filterInactiveStatus = () => {
    setAllStatus(false);
    setActiveStatus(false);
    setInactiveStatus(true);
    const filtered = data.filter(
      (item) => item.isHMOCover.toLowerCase() !== "yes"
    );
    setFilterData(filtered);
    setCurrentPage(1); // Reset pagination
    // Clear other filters when changing status
    setFilteredData(null);
    setSearchInput("");
    setByDate(false);
    setStartDate("");
    setEndDate("");
  };

  // Search input change handler: filters by full name, MRN, or HMO Id
  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    
    if (value === "") {
      setFilteredData(null);
      return;
    }
    
    // Filter from filterData (status-filtered data) instead of data
    const filtered = filterData.filter((item) => {
      const fullName = `${item.title ? item.title + " " : ""}${item.firstName} ${item.middleName ? item.middleName + " " : ""}${item.lastName}`.toLowerCase();
      const mrn = String(item.MRN || "").toLowerCase();
      const hmoId = String(item.HMOId || "").toLowerCase();
      return fullName.includes(value) || mrn.includes(value) || hmoId.includes(value);
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset pagination
  };

  // Filter by specific field: "patient", "mrn", or "hmo"
  const filterBy = (field) => {
    if (!searchInput.trim()) {
      activateNotifications("Please enter a search term first", "warning");
      return;
    }

    let filtered = [];
    
    if (field === "patient") {
      filtered = filterData.filter((item) => {
        const fullName = `${item.title ? item.title + " " : ""}${item.firstName} ${item.middleName ? item.middleName + " " : ""}${item.lastName}`.toLowerCase();
        return fullName.includes(searchInput.toLowerCase());
      });
    } else if (field === "mrn") {
      filtered = filterData.filter((item) => {
        const mrn = String(item.MRN || "").toLowerCase();
        return mrn.includes(searchInput.toLowerCase());
      });
    } else if (field === "hmo") {
      filtered = filterData.filter((item) => {
        const hmoId = String(item.HMOId || "").toLowerCase();
        return hmoId.includes(searchInput.toLowerCase());
      });
    }
    
    setFilteredData(filtered);
    setCurrentPage(1); // Reset pagination
    
    if (filtered.length === 0) {
      activateNotifications(`No patients found matching the search criteria for ${field}`, "info");
    }
  };

  // Filter by date (using startDate and endDate)
  const filterByDate = () => {
    if (startDate && endDate) {
      // Validate date range
      if (new Date(startDate) > new Date(endDate)) {
        activateNotifications("Start date cannot be after end date", "error");
        return;
      }

      let endDateObj = new Date(endDate);
      // Include the entire end date
      endDateObj.setDate(endDateObj.getDate() + 1);
      const formattedEndDate = endDateObj.toISOString().split("T")[0];
      
      // Filter from filterData (status-filtered data) instead of data
      const filtered = filterData.filter((item) => {
        if (!item.createdAt) return false;
        const createdDate = item.createdAt.split("T")[0];
        return createdDate >= startDate && createdDate <= formattedEndDate;
      });
      
      setFilteredData(filtered);
      setCurrentPage(1); // Reset pagination to first page
      
      // Show feedback if no results found
      if (filtered.length === 0) {
        activateNotifications("No patients found for the selected date range", "info");
      }
    } else {
      activateNotifications("Please select both start and end dates", "warning");
    }
  };

  const clearFilter = () => {
    setFilteredData(null);
    setSearchInput("");
    setByDate(false);
    setStartDate("");
    setEndDate("");
    setCurrentPage(1); // Reset pagination
  };

  // Dummy action handlers for viewing and editing a patient
  const viewPatient = (patient) => {
    console.log("View patient", patient);
  };

  const editPatient = (patient) => {
    activateNotifications("Edit functionality not implemented", "info");
  };

  // Fetch data on component mount or when the modal is closed (to refresh data)
  useEffect(() => {
    getAllPatients();
  }, [isOpen]);

  return (
    <Box bg="#fff" border="1px solid #EFEFEF" mt="10px" py="17px" px={["18px", "18px"]} rounded="10px">
      {/* Preloader */}
      {isLoading && <Preloader />}

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      {/* Combined Status Filter and Search/Date Filter Section */}
      <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" mb="10px">
        {/* Status Filter */}
        <Flex
          alignItems="center"
          flexWrap="wrap"
          bg="#E4F3FF"
          rounded="7px"
          py="3.5px"
          px="5px"
          cursor="pointer"
        >
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAllStatus}>
            <Text
              py="8.5px"
              px="12px"
              bg={allStatus ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              All
            </Text>
          </Box>
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterActiveStatus}>
            <Text
              py="8.5px"
              px="12px"
              bg={activeStatus ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              Active
            </Text>
          </Box>
          <Box onClick={filterInactiveStatus}>
            <Text
              py="8.5px"
              px="12px"
              bg={inactiveStatus ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              Inactive
            </Text>
          </Box>
        </Flex>

        {/* Search / Date Filter Controls */}
        <HStack spacing="10px">
          {!byDate ? (
            <Input
              label="Search"
              onChange={handleInputChange}
              value={searchInput}
              bColor="#E4E4E4"
              leftIcon={<BiSearch />}
              width="250px"
            />
          ) : (
            <HStack>
              <Input
                label="Start Date"
                type="date"
                onChange={(e) => setStartDate(e.target.value)}
                value={startDate}
                bColor="#E4E4E4"
                leftIcon={<FaCalendarAlt />}
              />
              <Input
                label="End Date"
                type="date"
                onChange={(e) => setEndDate(e.target.value)}
                value={endDate}
                bColor="#E4E4E4"
                leftIcon={<FaCalendarAlt />}
              />
              <Box
                onClick={filterByDate}
                cursor="pointer"
                px="5px"
                py="3px"
                rounded="5px"
                bg="blue.blue500"
                color="#fff"
                display="flex"
                alignItems="center"
              >
                <BiSearch />
              </Box>
            </HStack>
          )}
          <Menu isLazy>
            <MenuButton as={Box} cursor="pointer">
              <HStack
                border="1px solid #EA5937"
                rounded="7px"
                py="10px"
                px="16px"
                bg="#f8ddd1"
                color="blue.blue500"
                fontWeight="500"
                fontSize="14px"
              >
                <Text>Filter</Text>
                <IoFilter />
              </HStack>
            </MenuButton>
            <MenuList fontSize="14px">
              <MenuItem
                onClick={() => filterBy("patient")}
                textTransform="capitalize"
                fontWeight="500"
                _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
              >
                by Patient
              </MenuItem>
              <MenuItem
                onClick={() => filterBy("mrn")}
                textTransform="capitalize"
                fontWeight="500"
                _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
              >
                by MRN
              </MenuItem>
              <MenuItem
                onClick={() => filterBy("hmo")}
                textTransform="capitalize"
                fontWeight="500"
                _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
              >
                by HMO Id
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setByDate(true);
                  setSearchInput(""); // Clear search input when switching to date mode
                  setFilteredData(null); // Clear any existing filters
                }}
                textTransform="capitalize"
                fontWeight="500"
                _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
              >
                by Date
              </MenuItem>
              <MenuItem
                onClick={clearFilter}
                textTransform="capitalize"
                fontWeight="500"
                _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
              >
                clear filter
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Bulk Upload Button */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="10px" mt="10px">
        <Button onClick={onOpen} w={["100%", "100%", "165px", "205px"]}>
          Bulk Upload Patients
        </Button>
      </Flex>

      {/* Table Section */}
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="15px"
        px="15px"
        rounded="10px"
        overflowX="auto"
      >
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  S/N
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Name
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  MRN
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Phone
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Age
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Gender
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Status
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  HMO ID
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  HMO Name
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  HMO Plan
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Date
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, i) => {
                  const fullName = `${item.firstName} ${item.lastName}`.trim();
                  return (
                    <TableRowY
                      key={item._id}
                      type="hmo-patient-management"
                      sn={indexOfFirstPost + i + 1}
                      name={fullName}
                      email={item.email}
                      mrn={item.MRN}
                      phone={item.phoneNumber}
                      age={item.age}
                      gender={item.gender}
                      hmoStatus={item.isHMOCover}
                      hmoId={item.HMOId}
                      hmoName={item.HMOName}
                      hmoPlan={item.HMOPlan}
                      date={moment(item.createdAt).format("lll")}
                      onClick={() => viewPatient(item)}
                    />
                  );
                })
              ) : (
                <Tr>
                  <Th colSpan="9">
                    <Text textAlign="center">*--No record found--*</Text>
                  </Th>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pagination */}
      {dataToDisplay.length > 0 && (
        <Pagination
          postPerPage={postsPerPage}
          currentPage={currentPage}
          totalPosts={dataToDisplay.length}
          paginate={paginate}
        />
      )}

      {/* Bulk Upload Modal */}
      <BulkUploadHMOPatientsModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
