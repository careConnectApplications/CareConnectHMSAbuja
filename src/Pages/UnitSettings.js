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
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import moment from "moment";
import TableRow from "../Components/TableRow";
import Button from "../Components/Button";
import CreateUnitModal from "../Components/CreateUnitModal";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import Pagination from "../Components/Pagination";
import { GetAllUnitsApi, UpdateUnitApi } from "../Utils/ApiCalls";
import { configuration } from "../Utils/Helpers";
import { useColors } from "../Utils/colors";

export default function UnitSettings() {
  const [all, setAll] = useState(true);
  const [active, setActive] = useState(false);
  const [inActive, setInActive] = useState(false);
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [modalState, setModalState] = useState("");
  const [oldPayload, setOldPayload] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [trigger, setTrigger] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = configuration.sizePerPage;
  const [showToast, setShowToast] = useState({ show: false, message: "", status: "" });
  const [searchInput, setSearchInput] = useState("");
  
  const { bgColor, textColor } = useColors();

  // Calculate indices for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatedData = filterData.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getAllUnits = async () => {
    try {
      const result = await GetAllUnitsApi();
      console.log("getAllUnits", result);
      // Check the response structure - it might be different from price/clinic
      
      setData(result.queryresult?.unitdetails || []);
      setFilterData(result.queryresult?.unitdetails);
    } catch (e) {
      activateNotifications(e.message, "error");
    }
  };

  const activateNotifications = (message, status) => {
    setShowToast({
      show: true,
      message: message,
      status: status,
    });
    setTimeout(() => {
      setShowToast({ show: false, message: "", status: "" });
    }, 3000);
  };

  // Status filtering functions
  const filterAll = () => {
    setAll(true);
    setActive(false);
    setInActive(false);
    setFilterData(data);
  };

  const filterActive = () => {
    setAll(false);
    setActive(true);
    setInActive(false);
    const filteredData = data.filter((item) => item.status === "active");
    setFilterData(filteredData);
  };

  const filterInactive = () => {
    setAll(false);
    setActive(false);
    setInActive(true);
    const filteredData = data.filter((item) => item.status === "inactive");
    setFilterData(filteredData);
  };

  // Search handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.trim() === "") {
      setFilterData(data);
    } else {
      const lower = value.toLowerCase();
      const filtered = data.filter((item) => {
        const unitName = String(item.unit || item.unitName || "").toLowerCase();
        const clinicName = String(item.clinicName || item.clinic?.clinic || "").toLowerCase();
        return unitName.includes(lower) || clinicName.includes(lower);
      });
      setFilterData(filtered);
    }
  };

  // Filter By function from dropdown
  const filterBy = (field) => {
    if (searchInput.trim() === "") {
      setFilterData(data);
      return;
    }
    const lower = searchInput.toLowerCase();
    if (field === "unit") {
      const filtered = data.filter((item) =>
        String(item.unit || item.unitName || "").toLowerCase().includes(lower)
      );
      setFilterData(filtered);
    } else if (field === "clinic") {
      const filtered = data.filter((item) =>
        String(item.clinicName || item.clinic?.clinic || "").toLowerCase().includes(lower)
      );
      setFilterData(filtered);
    }
  };

  const clearFilter = () => {
    setSearchInput("");
    setFilterData(data);
  };

  // Toggle status for a unit
  const onChangeStatus = async (id) => {
    try {
      // Find the current unit
      const currentUnit = data.find(unit => unit._id === id);
      if (!currentUnit) return;

      // Toggle the status
      const newStatus = currentUnit.status === "active" ? "inactive" : "active";
      
      // Update the unit with new status
      const payload = {
        clinicId: currentUnit.clinicId,
        unit: currentUnit.unit || currentUnit.unitName,
        status: newStatus
      };
      
      const result = await UpdateUnitApi(payload, id);
      if (result.status === 200) {
        setTrigger(!trigger);
        setShowToast({
          show: true,
          message: "Status Updated Successfully",
          status: "success",
        });
        setTimeout(() => setShowToast({ show: false }), 3000);
      }
    } catch (err) {
      activateNotifications(err.message || "Failed to update status", "error");
    }
  };

  const CreateUnit = () => {
    setModalState("new");
    setOldPayload(null);
    onOpen();
  };

  const EditUnit = (item) => {
    setModalState("edit");
    setOldPayload(item);
    onOpen();
  };

  useEffect(() => {
    getAllUnits();
    setCurrentPage(1);
    setSearchInput("");
  }, [isOpen, trigger]);

  return (
    <Box bg={bgColor} border="1px solid #EFEFEF" mt="10px" py="17px" px={["18px", "18px"]} rounded="10px">
      {showToast.show && <ShowToast message={showToast.message} status={showToast.status} />}

      {/* Filter & Search Section */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
        <Flex alignItems="center" flexWrap="wrap" bg="#E4F3FF" rounded="7px" py="3.5px" px="5px" cursor="pointer">
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAll}>
            <Text py="8.5px" px="12px" bg={all ? "#fff" : "transparent"} rounded="7px" color="#1F2937" fontWeight="500" fontSize="13px">
              All <Box as="span" color="#667085" fontWeight="400" fontSize="13px">({data?.length})</Box>
            </Text>
          </Box>
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterActive}>
            <Text py="8.5px" px="12px" bg={active ? "#fff" : "transparent"} rounded="7px" color="#1F2937" fontWeight="500" fontSize="13px">
              Active
            </Text>
          </Box>
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterInactive}>
            <Text py="8.5px" px="12px" bg={inActive ? "#fff" : "transparent"} rounded="7px" color="#1F2937" fontWeight="500" fontSize="13px">
              Inactive
            </Text>
          </Box>
        </Flex>

        {/* Search Input & Filter Dropdown */}
        <Flex alignItems="center" mt={["10px", "0px"]}>
          <Box maxW="300px" mr="10px">
            <Input
              label="Search"
              placeholder="Search by unit or clinic"
              value={searchInput}
              onChange={handleSearchChange}
              bColor="#E4E4E4"
              leftIcon={<BiSearch />}
            />
          </Box>
          <Menu isLazy>
            <MenuButton as={Box}>
              <HStack border="1px solid #EA5937" rounded="7px" cursor="pointer" py="11.64px" px="16.98px" bg="#f8ddd1" color="blue.blue500" fontWeight="500" fontSize="14px">
                <Text>Filter</Text>
                <IoFilter />
              </HStack>
            </MenuButton>
            <MenuList fontSize="14px">
              <MenuItem onClick={() => filterBy("unit")} textTransform="capitalize" fontWeight="500" color="#2F2F2F" _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                By Unit Name
              </MenuItem>
              <MenuItem onClick={() => filterBy("clinic")} textTransform="capitalize" fontWeight="500" color="#2F2F2F" _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                By Clinic Name
              </MenuItem>
              <MenuItem onClick={clearFilter} textTransform="capitalize" fontWeight="500" color="#2F2F2F" _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                Clear Filter
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Add Unit Button */}
      <Flex justifyContent="space-between" flexWrap="wrap" mt={["10px", "10px", "10px", "10px"]} w={["100%", "100%", "50%", "37%"]}>
        <Button rightIcon={<SlPlus />} w={["100%", "100%", "144px", "144px"]} onClick={CreateUnit}>
          Add Unit
        </Button>
      </Flex>

      {/* Table Section */}
      <Box bg="#fff" border="1px solid #EFEFEF" mt="12px" py="15px" px="15px" rounded="10px" overflowX="auto">
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Actions</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">S/N</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Unit ID</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Unit Name</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Clinic/Department</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Created Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((item, i) => (
                <TableRow
                  key={i}
                  type="unit-settings"
                  sn={indexOfFirstPost + i + 1}
                  unit={item.unit }
                  unitId={item.id }
                  clinic={item.clinicId?.clinic  || "N/A"}
                  date={moment(item.createdAt).format("lll")}
                  onEdit={() => EditUnit(item)}
                  onChangeStatus={() => onChangeStatus(item._id)}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pagination */}
      <Pagination
        postPerPage={postsPerPage}
        currentPage={currentPage}
        totalPosts={filterData.length}
        paginate={paginate}
      />

      <CreateUnitModal
        isOpen={isOpen}
        oldPayload={oldPayload}
        onClose={onClose}
        type={modalState}
        activateNotifications={activateNotifications}
      />
    </Box>
  );
}
