import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import BirthRegisterModal from "../Components/BirthRegisterModal";
import { useColors } from "../Utils/colors";
import moment from "moment";
import { BsThreeDots } from "react-icons/bs";
import { SlPlus } from "react-icons/sl";
import { GetBirthRegisterByPatientApi } from "../Utils/ApiCalls";
import Preloader from "../Components/Preloader";
import Input from "../Components/Input";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";

export default function BirthRegister({ id }) {
  const { bgColor, textColor, borderColor, titleTextColor, subTitleTextColor } =
    useColors();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(configuration.sizePerPage);

  // Filter states
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState(null);

  // Get current posts
  const indexOfLastRecord = currentPage * postPerPage;
  const indexOfFirstRecord = indexOfLastRecord - postPerPage;
  const currentRecords = (filteredData || filterData).slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Filter functions
  const filterBy = (field) => {
    let filterResults = data.filter((item) => {
      if (field === "sex") {
        return item.sex?.toLowerCase().includes(searchInput.toLowerCase());
      } else if (field === "placeOfBirth") {
        return item.placeOfBirth
          ?.toLowerCase()
          .includes(searchInput.toLowerCase());
      } else if (field === "childName") {
        const fullName = `${item.childName?.firstName || ""} ${
          item.childName?.lastName || ""
        } ${item.childName?.middleName || ""}`;
        return fullName.toLowerCase().includes(searchInput.toLowerCase());
      } else if (field === "motherAge") {
        return item.motherAge?.toString().includes(searchInput);
      } else if (field === "fathersStateOfOrigin") {
        return item.fathersStateOfOrigin
          ?.toLowerCase()
          .includes(searchInput.toLowerCase());
      }
      return false;
    });

    setFilteredData(filterResults);
  };

  const clearFilter = () => {
    setFilteredData(null);
    setSearchInput("");
  };

  // Fetch data from API
  const fetchData = async () => {
    if (!id) return;

    setIsLoading(true);
    setData([]);
    setFilterData([]);
    try {
      const response = await GetBirthRegisterByPatientApi(id);

      if (response?.status === true) {
        const records = response.queryresult || [];
        setData(records);
        setFilterData(records);
      }
    } catch (error) {
      console.error("Error fetching birth register data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch birth register records",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreate = () => {
    setSelectedRecord(null);
    setModalMode("create");
    onOpen();
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setModalMode("edit");
    onOpen();
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setModalMode("view");
    onOpen();
  };

  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px={["18px", "18px"]}
      rounded="10px"
    >
      {isLoading && <Preloader />}

      {/* Header section */}
      <HStack justifyContent="space-between" mb={4} flexWrap="wrap">
        <Text color={titleTextColor} fontWeight="600" fontSize="18px">
          Birth Register
        </Text>

        {/* Filter section */}
        <Flex
          flexWrap="wrap"
          mt={["10px", "10px", "0px", "0px"]}
          alignItems="center"
          justifyContent={"flex-end"}
        >
          <HStack>
            <Input
              label="Search"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
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
              <MenuList>
                <MenuItem
                  onClick={() => filterBy("sex")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  By Gender
                </MenuItem>
                <MenuItem
                  onClick={() => filterBy("placeOfBirth")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  By Place of Birth
                </MenuItem>
                <MenuItem
                  onClick={() => filterBy("childName")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  By Child Name
                </MenuItem>
                <MenuItem
                  onClick={() => filterBy("motherAge")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  By Mother's Age
                </MenuItem>
                <MenuItem
                  onClick={() => filterBy("fathersStateOfOrigin")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  By Father's State
                </MenuItem>
                <MenuItem
                  onClick={clearFilter}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  Clear filter
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </HStack>

      <Flex
        justifyContent="space-between"
        flexWrap="wrap"
        mt={["10px", "10px", "10px", "10px"]}
      >
        <Button
          rightIcon={<SlPlus />}
          w={["100%", "100%", "154px", "154px"]}
          px={"120px"}
          onClick={handleCreate}
        >
          Add New Record
        </Button>
      </Flex>

      {/* Table section */}
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
          Birth Register History
        </Text>

        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Registration Date
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Child Name
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Gender
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Place of Birth
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Mother's Age
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Father's State
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Phone Number
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((item, i) => (
                  <Tr key={i}>
                    <Td fontSize="14px" color={textColor}>
                      {moment(item.dateOfChildRegistration).format(
                        "DD/MM/YYYY"
                      )}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.childName?.firstName} {item.childName?.lastName}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.sex}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.placeOfBirth}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.motherAge}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.fathersStateOfOrigin}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.phoneNumber}
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton>
                          <Box as={BsThreeDots} />
                        </MenuButton>
                        <MenuList>
                          <MenuItem onClick={() => handleView(item)}>
                            View
                          </MenuItem>
                          <MenuItem onClick={() => handleEdit(item)}>
                            Edit
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={8}>
                    <Text textAlign="center" mt="32px" color={textColor}>
                      No birth register records found
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Pagination
        postPerPage={postPerPage}
        currentPage={currentPage}
        totalPosts={(filteredData || filterData).length}
        paginate={paginate}
      />

      <BirthRegisterModal
        isOpen={isOpen}
        onClose={onClose}
        mode={modalMode}
        data={selectedRecord}
        patientId={id}
        fetchData={fetchData}
      />
    </Box>
  );
}
