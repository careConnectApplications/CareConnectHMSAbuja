import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import FirstStageLabourModal from "../Components/FirstStageLabourModal";
import { useColors } from "../Utils/colors";
import moment from "moment";
import { BsThreeDots } from "react-icons/bs";

import { SlPlus } from "react-icons/sl";
import { GetFirstStageLabourByPatientApi } from "../Utils/ApiCalls";

import Preloader from "../Components/Preloader";
import Input from "../Components/Input";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";

export default function FirstStageLabour() {
  const { id } = useParams();
  const { bgColor, textColor, borderColor, titleTextColor, subTitleTextColor } = useColors();

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
      if (field === "phase") {
        return item.phase?.toLowerCase().includes(searchInput.toLowerCase());
      } else if (field === "cervicalDilation") {
        return item.cervicalDilation?.toString().includes(searchInput);
      } else if (field === "contraction") {
        return item.contraction
          ?.toLowerCase()
          .includes(searchInput.toLowerCase());
      } else if (field === "foetalHeartRate") {
        return item.foetalHeartRate?.toString().includes(searchInput);
      } else if (field === "obstetricComplication") {
        return item.obstetricComplication
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

      const response = await GetFirstStageLabourByPatientApi(id);

      if (response?.status === true) {
        const records = response.queryresult || [];
        setData(records);
        setFilterData(records);
      }

    } catch (error) {
      console.error("Error fetching first stage labour data:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to fetch first stage labour records",
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

      {/* Filter section */}
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
          <Box borderRight="1px solid #EDEFF2" pr="5px">
            <Text
              py="8.5px"
              px="12px"
              bg="#fff"
              rounded="7px"
              color={"#1F2937"}
              fontWeight={"500"}
              fontSize={"13px"}
            >
              All{" "}
              <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                ({data.length})
              </Box>
            </Text>
          </Box>
        </Flex>

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
                  onClick={() => filterBy("phase")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  By Phase
                </MenuItem>
                <MenuItem
                  onClick={() => filterBy("cervicalDilation")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  By Cervical Dilation
                </MenuItem>
                <MenuItem
                  onClick={() => filterBy("contraction")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  By Contraction
                </MenuItem>
                <MenuItem
                  onClick={() => filterBy("foetalHeartRate")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  By Foetal Heart Rate
                </MenuItem>
                <MenuItem
                  onClick={() => filterBy("obstetricComplication")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  By Obstetric Complication
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
      </Flex>

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
          First Stage Labour History
        </Text>

        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Date Examined
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Phase
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Cervical Dilation
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Contraction
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Foetal Heart Rate
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Obstetric Complication
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Recorded By
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
                      {moment(item.dateExamined).format("DD/MM/YYYY")}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.phase}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.cervicalDilation}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.contraction}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.foetalHeartRate}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.obstetricComplication}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.doctor?.firstName} {item.doctor?.lastName}
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
                      No first stage labour records found
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

      <FirstStageLabourModal
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
