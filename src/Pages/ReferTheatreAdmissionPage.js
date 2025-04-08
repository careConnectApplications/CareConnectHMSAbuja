import React, { useState, useEffect } from "react";
import {
  Text,
  Flex,
  HStack,
  Box,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import { IoFilter } from "react-icons/io5";
import Input from "../Components/Input";
import Button from "../Components/Button";
import ShowToast from "../Components/ToastNotification";
import Pagination from "../Components/Pagination";
import Preloader from "../Components/Preloader";
import TableRowY from "../Components/TableRowY"; // For refer theatre admission row
import ReferTheatreAdmissionModal from "../Components/ReferTheatreAdmissionModal";
import {
  GetAllTheatreAdmissionByPatientApi,
  UpdateTheatreAdmissionStatusApi,
} from "../Utils/ApiCalls";
import { configuration } from "../Utils/Helpers"; // Added configuration import

export default function ReferTheatreAdmissionPage() {
  // Loading & Toast States
  const [IsLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });
  const activateNotifications = (message, status) => {
    setShowToast({ show: true, message, status });
    setTimeout(() => {
      setShowToast({ show: false });
    }, 5000);
  };

  // Modal & Trigger
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Trigger, setTrigger] = useState(false);

  // Data States
  const [Data, setData] = useState([]); // Original data from API
  const [FilterData, setFilterData] = useState([]); // Data after filters

  // Pagination States
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage] = useState(configuration.sizePerPage); // Updated to use configuration
  const indexOfLast = CurrentPage * PostPerPage;
  const indexOfFirst = indexOfLast - PostPerPage;
  const PaginatedData = FilterData.slice(indexOfFirst, indexOfLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Search Filter state and filter option state
  const [SearchInput, setSearchInput] = useState("");
  const [filterOption, setFilterOption] = useState(""); // "clinic", "doctor", "referredtheatre"

  // Status Filter states – mimic the lab page filter UI exactly
  const [All, setAll] = useState(true);
  const [ToAdmit, setToAdmit] = useState(false);
  const [Admited, setAdmited] = useState(false);
  const [ToTransfer, setToTransfer] = useState(false);
  const [Transfered, setTransfered] = useState(false);
  const [ToDischarge, setToDischarge] = useState(false);
  const [Discharged, setDischarged] = useState(false);

  // Mapping for status text display.
  const statusMapping = {
    toadmit: "To Admit",
    admited: "Admited",
    totransfer: "To Transfer",
    transfered: "Transfered",
    todischarge: "To Discharge",
    discharged: "Discharged",
  };

  // Get patient id from localStorage
  const patientId = localStorage.getItem("patientId");

  // Fetch Data from API
  const getAllReferAdmission = async () => {
    setIsLoading(true);
    try {
      const result = await GetAllTheatreAdmissionByPatientApi(patientId);
      if (result.data.status === true) {
        const admissions = result.data.queryresult.thearteadmissiondetails;
        setData(admissions);
      }
      setIsLoading(false);
    } catch (e) {
      console.error(e.message);
      setIsLoading(false);
    }
  };

  // Apply both status and search filters
  const applyFilters = () => {
    let filtered = Data;
    if (!All) {
      if (ToAdmit) {
        filtered = filtered.filter(
          (item) => item.status.toLowerCase() === "toadmit"
        );
      } else if (Admited) {
        filtered = filtered.filter(
          (item) => item.status.toLowerCase() === "admited"
        );
      } else if (ToTransfer) {
        filtered = filtered.filter(
          (item) => item.status.toLowerCase() === "totransfer"
        );
      } else if (Transfered) {
        filtered = filtered.filter(
          (item) => item.status.toLowerCase() === "transfered"
        );
      } else if (ToDischarge) {
        filtered = filtered.filter(
          (item) => item.status.toLowerCase() === "todischarge"
        );
      } else if (Discharged) {
        filtered = filtered.filter(
          (item) => item.status.toLowerCase() === "discharged"
        );
      }
    }
    if (SearchInput.trim() !== "") {
      const searchLower = SearchInput.toLowerCase();
      if (filterOption === "clinic") {
        filtered = filtered.filter((item) =>
          item.clinic?.toLowerCase().includes(searchLower)
        );
      } else if (filterOption === "doctor") {
        filtered = filtered.filter((item) =>
          item.doctorname?.toLowerCase().includes(searchLower)
        );
      } else if (filterOption === "referredtheatre") {
        filtered = filtered.filter((item) =>
          item.referedtheatre?.theatrename?.toLowerCase().includes(searchLower)
        );
      } else {
        filtered = filtered.filter(
          (item) =>
            item.clinic?.toLowerCase().includes(searchLower) ||
            item.doctorname?.toLowerCase().includes(searchLower) ||
            item.referedtheatre?.theatrename
              ?.toLowerCase()
              .includes(searchLower)
        );
      }
    }
    setFilterData(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [
    Data,
    All,
    ToAdmit,
    Admited,
    ToTransfer,
    Transfered,
    ToDischarge,
    Discharged,
    SearchInput,
    filterOption,
  ]);

  useEffect(() => {
    getAllReferAdmission();
  }, [isOpen, Trigger]);

  // Status Filter Functions
  const filterAll = () => {
    setAll(true);
    setToAdmit(false);
    setAdmited(false);
    setToTransfer(false);
    setTransfered(false);
    setToDischarge(false);
    setDischarged(false);
  };
  const filterToAdmit = () => {
    setAll(false);
    setToAdmit(true);
    setAdmited(false);
    setToTransfer(false);
    setTransfered(false);
    setToDischarge(false);
    setDischarged(false);
  };
  const filterAdmited = () => {
    setAll(false);
    setToAdmit(false);
    setAdmited(true);
    setToTransfer(false);
    setTransfered(false);
    setToDischarge(false);
    setDischarged(false);
  };
  const filterToTransfer = () => {
    setAll(false);
    setToAdmit(false);
    setAdmited(false);
    setToTransfer(true);
    setTransfered(false);
    setToDischarge(false);
    setDischarged(false);
  };
  const filterTransfered = () => {
    setAll(false);
    setToAdmit(false);
    setAdmited(false);
    setToTransfer(false);
    setTransfered(true);
    setToDischarge(false);
    setDischarged(false);
  };
  const filterToDischarge = () => {
    setAll(false);
    setToAdmit(false);
    setAdmited(false);
    setToTransfer(false);
    setTransfered(false);
    setToDischarge(true);
    setDischarged(false);
  };
  const filterDischarged = () => {
    setAll(false);
    setToAdmit(false);
    setAdmited(false);
    setToTransfer(false);
    setTransfered(false);
    setToDischarge(false);
    setDischarged(true);
  };

  // New functions for search input handling and filter menu
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filterBy = (field) => {
    setFilterOption(field);
  };

  const clearFilter = () => {
    setFilterOption("");
    setSearchInput("");
  };

  const handleStatusUpdate = async (admissionId, newStatus) => {
    const payload = { status: newStatus }; // Use the passed status
    try {
      const result = await UpdateTheatreAdmissionStatusApi(
        admissionId,
        payload
      );
      if (result.status === 200) {
        setTrigger(!Trigger);
        activateNotifications("Status Updated Successfully", "success");
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    }
  };

  // For adding a new admission, we keep the modal
  const [modalState, setModalState] = useState("");
  const [oldPayload, setOldPayload] = useState({});
  const addAdmission = () => {
    setModalState("new");
    setOldPayload({});
    onOpen();
  };

  const { pathname } = useLocation();
  const nav = useNavigate();

  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px={["18px", "18px"]}
      rounded="10px"
    >
      {IsLoading && <Preloader />}
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      {/* Status Filter Row */}
      <Flex
        display="inline-flex"
        alignItems="center"
        flexWrap="wrap"
        bg="#E4F3FF"
        rounded="7px"
        py="3.5px"
        px="5px"
        cursor="pointer"
        mb="15px"
      >
        <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAll}>
          <Text
            py="8.5px"
            px="12px"
            bg={All ? "#fff" : "transparent"}
            rounded="7px"
            color="#1F2937"
            fontWeight="500"
            fontSize="13px"
          >
            All
          </Text>
        </Box>
        <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterToAdmit}>
          <Text
            py="8.5px"
            px="12px"
            bg={ToAdmit ? "#fff" : "transparent"}
            rounded="7px"
            color="#1F2937"
            fontWeight="500"
            fontSize="13px"
          >
            To Admit
          </Text>
        </Box>
        <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAdmited}>
          <Text
            py="8.5px"
            px="12px"
            bg={Admited ? "#fff" : "transparent"}
            rounded="7px"
            color="#1F2937"
            fontWeight="500"
            fontSize="13px"
          >
            Admited
          </Text>
        </Box>
        <Box
          borderRight="1px solid #EDEFF2"
          pr="5px"
          onClick={filterToTransfer}
        >
          <Text
            py="8.5px"
            px="12px"
            bg={ToTransfer ? "#fff" : "transparent"}
            rounded="7px"
            color="#1F2937"
            fontWeight="500"
            fontSize="13px"
          >
            To Transfer
          </Text>
        </Box>
        <Box
          borderRight="1px solid #EDEFF2"
          pr="5px"
          onClick={filterTransfered}
        >
          <Text
            py="8.5px"
            px="12px"
            bg={Transfered ? "#fff" : "transparent"}
            rounded="7px"
            color="#1F2937"
            fontWeight="500"
            fontSize="13px"
          >
            Transfered
          </Text>
        </Box>
        <Box
          borderRight="1px solid #EDEFF2"
          pr="5px"
          onClick={filterToDischarge}
        >
          <Text
            py="8.5px"
            px="12px"
            bg={ToDischarge ? "#fff" : "transparent"}
            rounded="7px"
            color="#1F2937"
            fontWeight="500"
            fontSize="13px"
          >
            To Discharge
          </Text>
        </Box>
        <Box onClick={filterDischarged}>
          <Text
            py="8.5px"
            px="12px"
            bg={Discharged ? "#fff" : "transparent"}
            rounded="7px"
            color="#1F2937"
            fontWeight="500"
            fontSize="13px"
          >
            Discharged
          </Text>
        </Box>
      </Flex>

      {/* Action Bar: Add Button and Search/Filter */}
      <Flex
        flexDirection={["column", "row"]}
        justifyContent="space-between"
        alignItems="center"
        mb="15px"
        gap="15px"
      >
        <Button
          rightIcon={<SlPlus />}
          w={["100%", "220px"]}
          onClick={addAdmission}
        >
          Add Refer Admission
        </Button>
        <HStack w={["100%", "auto"]} flexWrap={["wrap", "nowrap"]}>
          <Input
            label="Search"
            onChange={handleInputChange}
            value={SearchInput}
            bColor="#E4E4E4"
            leftIcon={<BiSearch />}
          />
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
            <MenuList fontSize="14px">
              <MenuItem
                onClick={() => filterBy("clinic")}
                textTransform="capitalize"
                fontWeight="500"
                color="#2F2F2F"
                _hover={{
                  color: "#fff",
                  fontWeight: "400",
                  bg: "blue.blue500",
                }}
              >
                by Clinic
              </MenuItem>
              <MenuItem
                onClick={() => filterBy("doctor")}
                textTransform="capitalize"
                fontWeight="500"
                color="#2F2F2F"
                _hover={{
                  color: "#fff",
                  fontWeight: "400",
                  bg: "blue.blue500",
                }}
              >
                by Doctor
              </MenuItem>
              <MenuItem
                onClick={() => filterBy("referredtheatre")}
                textTransform="capitalize"
                fontWeight="500"
                color="#2F2F2F"
                _hover={{
                  color: "#fff",
                  fontWeight: "400",
                  bg: "blue.blue500",
                }}
              >
                by Referred Theatre
              </MenuItem>
              <MenuItem
                onClick={clearFilter}
                textTransform="capitalize"
                fontWeight="500"
                color="#2F2F2F"
                _hover={{
                  color: "#fff",
                  fontWeight: "400",
                  bg: "blue.blue500",
                }}
              >
                Clear Filter
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
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
        <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">
          Refer Theatre Admission History
        </Text>
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  S/N
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Admission ID
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Appointment Date
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Clinic
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Patient
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Referred Theatre
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Doctor
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Status
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {PaginatedData.map((item, i) => (
                <TableRowY
                  key={i}
                  type="refer-theatre-admission"
                  sn={i + 1}
                  theatreadmissionid={item.theatreadmissionid}
                  appointmentdate={moment(item.appointmentdate).format("lll")}
                  clinic={item.clinic}
                  patient={item.patient}
                  referedtheatre={item.referedtheatre}
                  doctorname={item.doctorname}
                  status={
                    statusMapping[item.status.toLowerCase()] || item.status
                  }
                  onChangeStatus={(newStatus) =>
                    handleStatusUpdate(item._id, newStatus)
                  }
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Pagination
          postPerPage={PostPerPage}
          currentPage={CurrentPage}
          totalPosts={FilterData.length}
          paginate={paginate}
        />
      </Box>

      <ReferTheatreAdmissionModal
        isOpen={isOpen}
        onClose={onClose}
        type={modalState}
        activateNotifications={activateNotifications}
        oldPayload={oldPayload}
      />
    </Box>
  );
}
