import React, { useEffect, useState, useMemo } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import MainLayout from "../Layouts/Index";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import TableRow from "../Components/TableRow";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Preloader from "../Components/Preloader";
import ShowToast from "../Components/ToastNotification";
import { CgSearch } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import CreateUserModal from "../Components/CreateUserModal";
import BulkUploadModal from "../Components/BulkUploadModal";
import { GetAllUsersApi, UpdateUserStatusApi,RequestPasswordResetApi  } from "../Utils/ApiCalls";
import moment from "moment";
import Seo from "../Utils/Seo";
import { FaCalendarAlt } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { BiSearch } from "react-icons/bi";

import { SlPlus } from "react-icons/sl";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
export default function UserManagement() {
  const [IsLoading, setIsLoading] = useState(true);
  const [Trigger, setTrigger] = useState(false);
  const [Data, setData] = useState([]);
  const [ModalState, setModalState] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [FilterUser, setFilterUser] = useState({});
  const [ByDate, setByDate] = useState(false);

  const [filters, setFilters] = useState({
    status: "all", // 'all', 'active', or 'inactive'
    searchTerm: "",
    searchField: "all", // e.g., 'name', 'email', 'role'
    startDate: "",
    endDate: "",
  });

  const filteredData = useMemo(() => {
    let filtered = Data;

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((item) => item.status === filters.status);
    }

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter((item) => {
        if (filters.searchField === "all") {
          return (
            item.role?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            item.email?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            item.firstName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            item.lastName?.toLowerCase().includes(filters.searchTerm.toLowerCase())
          );
        }
        if (filters.searchField === "name") {
          return (
            item.firstName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            item.lastName?.toLowerCase().includes(filters.searchTerm.toLowerCase())
          );
        }
        return item[filters.searchField]?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      });
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      let endDate = new Date(filters.endDate);
      endDate.setDate(endDate.getDate() + 1);
      let formatedEndDate = endDate.toISOString().split("T")[0];
      filtered = filtered.filter(
        (item) =>
          item.createdAt >= filters.startDate && item.createdAt <= formatedEndDate
      );
    }

    return filtered;
  }, [Data, filters]);

  // Pagination settings to follow
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);

  //get current post
  const indexOfLastSra = CurrentPage * PostPerPage;
  const indexOfFirstSra = indexOfLastSra - PostPerPage;
  const PaginatedData = filteredData.slice(indexOfFirstSra, indexOfLastSra);
  //change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
     setCurrentPage(1);
  };

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const router = useNavigate();

  const getAllUser = async () => {
    setIsLoading(true);
    try {
      const result = await GetAllUsersApi();

      console.log("result GetAllUsersApi", result);

      if (result.status === true) {
        setIsLoading(false);
        setData(result.queryresult.userdetails);
      }
    } catch (e) {
      console.log(e.message);
    }
  };


  const onEdit = (id) => {
    let filteredUser = Data.filter((user) => user._id === id);
    setFilterUser(filteredUser);
    setModalState("edit");
    onOpen();
  };

  const location = useLocation().pathname
  const nav = useNavigate()

  const onPermission = (user) => {
    localStorage.setItem("pathLocation", location);
    localStorage.setItem("userToEdit", JSON.stringify(user));
    nav(`/dashboard/edit-permission/${user._id}`);
  };

  const onChangeStatus = async (id) => {
    try {
      const result = await UpdateUserStatusApi(id);
      console.log("onChangeStatus", result);
      if (result.status === 200) {
        setTrigger(!Trigger);

        setShowToast({
          show: true,
          message: `${result.data.queryresult.firstName} status has been updated to ${result.data.queryresult.status}`,
          status: "success",
        });

        setTimeout(() => {
          setShowToast({
            show: false,
          });
        }, 3000);
      }
    } catch (err) {}
  };

  const onReset = async (id) => {
    try {
      const result = await RequestPasswordResetApi(id);
      console.log("Password reset response:", result); 
      if (result.status === 200) {
        setShowToast({
          show: true,
          message: `Password reset successfully for ${result.data.queryresult.firstName}.`,
          status: "success",
        });

        setTimeout(() => {
          setShowToast({ show: false });
        }, 3000);
      }
    } catch (err) {
      console.error("Error resetting password:", err); 
      setShowToast({
        show: true,
        message: err.message,
        status: "error",
      });
   
      setTimeout(() => {
        setShowToast({ show: false });
      }, 3000);
    }
  };
    
  const CreateUser = () => {
    setModalState("new");
    onOpen();
  };
  const BulkUpload = () => {
    setModalState("bulkUpload");
    onOpen();
  };



  useEffect(() => {
    getAllUser();
  }, [isOpen, Trigger]);

  return (
    <MainLayout>
      {IsLoading && <Preloader />}

      <Seo title="User Management" description="Care Connect Patients" />

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Users
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({Data?.length})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        View and manage all user profiles in one place. Quickly access statuses,
        assign role, and update details as needed.
      </Text>

      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="17px"
        px={["18px", "18px"]}
        rounded="10px"
      >
        {/* filter section  */}
        <Flex justifyContent="space-between" flexWrap="wrap">
          <Flex
            alignItems="center"
            flexWrap="wrap"
            bg="#E4F3FF"
            rounded="7px"
            py="3.5px"
            px="5px"
            cursor="pointer"
            mt={["10px", "10px", "0px", "0px"]}
          >
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={() => handleFilterChange("status", "all")}>
              <Text
                py="8.5px"
                px="12px"
                bg={filters.status === "all" ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                All{" "}
                <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                  ({Data?.length})
                </Box>
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={() => handleFilterChange("status", "active")}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={filters.status === "active" ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Active
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={() => handleFilterChange("status", "inactive")}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={filters.status === "inactive" ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Inactive
              </Text>
            </Box>
          </Flex>

          <Flex
            flexWrap="wrap"
            mt={["10px", "10px", "0px", "0px"]}
            alignItems="center"
            justifyContent={"flex-end"}
          >
            <HStack  >
            {ByDate === false ? (
              <Input
                label="Search"
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                value={filters.searchTerm}
                bColor="#E4E4E4"
                leftIcon={<BiSearch />}
              />
            ) : (
              <HStack flexWrap={["wrap", "nowrap"]}>
                <Input
                  label="Start Date"
                  type="date"
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  value={filters.startDate}
                  bColor="#E4E4E4"
                  leftIcon={<FaCalendarAlt />}
                />
                <Input
                  label="End Date"
                  type="date"
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  value={filters.endDate}
                  bColor="#E4E4E4"
                  leftIcon={<FaCalendarAlt />}
                />
              </HStack>
            )}
             

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
                      handleFilterChange("searchField", "name");
                      setByDate(false);
                    }}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Name</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleFilterChange("searchField", "email");
                      setByDate(false);
                    }}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by email</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleFilterChange("searchField", "phoneNumber");
                      setByDate(false);
                    }}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Phone Number</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleFilterChange("searchField", "role");
                      setByDate(false);
                    }}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by role</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => setByDate(true)}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by date</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setFilters({
                        status: "all",
                        searchTerm: "",
                        searchField: "all",
                        startDate: "",
                        endDate: "",
                      });
                      setByDate(false);
                    }}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>clear filter</Text>
                    </HStack>
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Flex>

        <Flex
          justifyContent="space-between"
          flexWrap="wrap"
          mt={["10px", "10px", "10px", "10px"]}
          w={["100%", "100%", "50%", "37%"]}
        >
          <Button
            rightIcon={<SlPlus />}
            w={["100%", "100%", "144px", "144px"]}
            onClick={CreateUser}
          >
            Add User
          </Button>

          <Button
            mt={["10px", "10px", "0px", "0px"]}
            rightIcon={<HiOutlineDocumentArrowUp />}
            background="#f8ddd1 "
            border="1px solid #EA5937"
            color="blue.blue500"
            w={["100%", "100%", "144px", "144px"]}
            onClick={BulkUpload}
          >
            Bulk Upload
          </Button>
        </Flex>

        {/* filter section end here */}

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
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    name
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    role
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    clinic
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    phone
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    date created
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    status
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {PaginatedData?.length > 0 ? (
                  PaginatedData.map((item, i) => (
                    <TableRow
                      key={i}
                      type="user-management"
                      name={`${item.firstName} ${item.lastName}`}
                      email={item.email}
                      role={item.role}
                      clinic={item.clinic}
                      status={item.status}
                      onRemove={onOpen}
                      date={moment(item.createdAt).format("lll")}
                      phone={item.phoneNumber}
                      onEdit={() => onEdit(item._id)}
                      onPermission={() => onPermission(item)}
                      onChangeStatus={() => onChangeStatus(item._id)}
                      onReset={() => onReset(item._id)}
                    />
                  ))
                ) : (
                  <Text textAlign={"center"} mt="32px" color="black">
                    *--No record found--*
                  </Text>
                )}
              </Tbody>
            </Table>
          </TableContainer>

          <Pagination
            postPerPage={PostPerPage}
            currentPage={CurrentPage}
            totalPosts={filteredData.length}
            paginate={paginate}
          />
        </Box>
      </Box>
      {/* Modals */}
      {ModalState === "new" && (
        <CreateUserModal
          isOpen={isOpen}
          onClose={onClose}
          type="new"
          filteredUser={FilterUser}
        />
      )}
      {ModalState === "edit" && (
        <CreateUserModal
          isOpen={isOpen}
          onClose={onClose}
          type="edit"
          filteredUser={FilterUser}
        />
      )}
      {ModalState === "bulkUpload" && (
        <BulkUploadModal isOpen={isOpen} onClose={onClose} />
      )}
    </MainLayout>
  );
}
