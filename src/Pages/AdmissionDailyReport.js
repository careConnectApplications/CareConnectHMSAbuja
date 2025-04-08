import React, { useState, useEffect } from "react";
import {
  Text,
  Flex,
  Box,
  Spinner,
  HStack,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
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
import TableRowY from "../Components/TableRowY";
import Pagination from "../Components/Pagination";
import { GetAllReferredForAdmissionApi, GetAllWardApi } from "../Utils/ApiCalls";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import Input from "../Components/Input";
import { configuration } from "../Utils/Helpers";
import Button from "../Components/Button";

const AdmissionDailyReport = () => {
  // Admission data state & filtering
  const [filter, setFilter] = useState("all");
  const [admissionData, setAdmissionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const postPerPage = configuration.sizePerPage;
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [searchInput, setSearchInput] = useState("");


  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");

  
  useEffect(() => {
    const fetchWards = async () => {
      try {
        const response = await GetAllWardApi();
        setWards(response?.queryresult?.wardmanagementdetails || []);
      } catch (err) {
        console.error("Failed to fetch wards:", err);
      }
    };
    fetchWards();
  }, []);

  // Function to fetch admission data when the fetch button is clicked
  const fetchAdmissions = async () => {
    if (!selectedWard) return;
    try {
      setLoading(true);
      setError(null);
      const response = await GetAllReferredForAdmissionApi(selectedWard);
      if (response?.queryresult?.admissiondetails) {
        setAdmissionData(response.queryresult.admissiondetails);
      } else {
        setAdmissionData([]);
      }
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Update filtered data whenever the filter or admissionData changes
  useEffect(() => {
    if (filter === "all") {
      setFilteredData(admissionData);
    } else {
      setFilteredData(
        admissionData.filter(
          (item) => item.status.toLowerCase() === filter.toLowerCase()
        )
      );
    }
  }, [filter, admissionData]);

  // Filter function for search criteria
  const filterBy = (title) => {
    let filtered = admissionData;
    if (title === "patient") {
      filtered = admissionData.filter(
        (item) =>
          item.patient?.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.patient?.lastName.toLowerCase().includes(searchInput.toLowerCase())
      );
    } else if (title === "specialization") {
      filtered = admissionData.filter((item) =>
        item.admittospecialization.toLowerCase().includes(searchInput.toLowerCase())
      );
    } else if (title === "date") {
      let endDateObj = new Date(EndDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      let formattedEndDate = endDateObj.toISOString().split("T")[0];
      filtered = admissionData.filter(
        (item) => item.createdAt >= StartDate && item.createdAt <= formattedEndDate
      );
    }
    setFilteredData(filtered);
  };


  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const paginatedData = filteredData.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <Box bg="#fff" border="1px solid #EFEFEF" mt="10px" py="17px" px="18px" rounded="10px">
      {/* Ward Selection Dropdown and Fetch Admissions Button */}
      <Text color="blue.blue500" mt="9px" fontWeight="400" fontSize="15px">
        Kindly Select the Ward you want to view
      </Text>
      <SimpleGrid mt="5px" columns={{ base: 1, md: 2, lg: 2 }} spacing={10}>
        <Select
          id="ward"
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          placeholder="Select Ward"
          fontSize={selectedWard !== "" ? "16px" : "13px"}
        >
          {wards.map((ward) => (
            <option key={ward._id} value={ward._id}>
              {ward.wardname}
            </option>
          ))}
        </Select>
        <Button
          isLoading={loading}
          onClick={fetchAdmissions}
          disabled={!selectedWard}
        >
          Fetch Admissions
        </Button>
      </SimpleGrid>

      {/* Prompt if no ward is selected */}
      {!selectedWard ? (
        <Text fontSize="lg" color="gray.500" textAlign="center" mt="20px">
        
        </Text>
      ) : (
        <>
          {/* Filter Controls */}
          <Flex justifyContent="space-between" flexWrap="wrap" mt="20px">
            <Flex
              alignItems="center"
              flexWrap="wrap"
              bg="#E4F3FF"
              rounded="7px"
              py="3.5px"
              px="5px"
              cursor="pointer"
            >
              {[
                "All",
                "ToAdmit",
                "Admited",
                "To Transfer",
                "Transferred",
                "To Discharge",
                "Discharged",
              ].map((status) => (
                <Box key={status} pr="5px" onClick={() => setFilter(status.toLowerCase())}>
                  <Text
                    py="8.5px"
                    px="12px"
                    bg={filter === status.toLowerCase() ? "#fff" : "transparent"}
                    rounded="7px"
                    color="#1F2937"
                    fontWeight="500"
                    fontSize="13px"
                  >
                    {status} (
                    {
                      admissionData.filter(
                        (item) =>
                          status.toLowerCase() === "all" ||
                          item.status.toLowerCase() === status.toLowerCase()
                      ).length
                    }
                    )
                  </Text>
                </Box>
              ))}
            </Flex>
            <Flex
              flexWrap="wrap"
              mt={["10px", "10px", "20px", "20px"]}
              alignItems="center"
              justifyContent="flex-end"
            >
              <HStack flexWrap={["wrap", "nowrap"]}>
                {ByDate === false ? (
                  <Input
                    label="Search"
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                    bColor="#E4E4E4"
                    leftIcon={<BiSearch />}
                  />
                ) : (
                  <HStack flexWrap={["wrap", "nowrap"]}>
                    <Input
                      label="Start Date"
                      type="date"
                      onChange={(e) => setStartDate(e.target.value)}
                      value={StartDate}
                      bColor="#E4E4E4"
                      leftIcon={<FaCalendarAlt />}
                    />
                    <Input
                      label="End Date"
                      type="date"
                      onChange={(e) => setEndDate(e.target.value)}
                      value={EndDate}
                      bColor="#E4E4E4"
                      leftIcon={<FaCalendarAlt />}
                    />
                    <Flex
                      onClick={() => filterBy("date")}
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
                      onClick={() => filterBy("patient")}
                      textTransform="capitalize"
                      fontWeight="500"
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                    >
                      <HStack fontSize="14px">
                        <Text>by patient</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => filterBy("specialization")}
                      textTransform="capitalize"
                      fontWeight="500"
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                    >
                      <HStack fontSize="14px">
                        <Text>by Specialization</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => setByDate(true)}
                      textTransform="capitalize"
                      fontWeight="500"
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                    >
                      <HStack fontSize="14px">
                        <Text>by date</Text>
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
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
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

          {/* Admissions Table */}
          <Box
            bg="#fff"
            border="1px solid #EFEFEF"
            mt="12px"
            py="15px"
            px="15px"
            rounded="10px"
            overflowX="auto"
          >
            {loading ? (
              <Flex justifyContent="center" alignItems="center" minH="100px">
                <Spinner size="xl" />
              </Flex>
            ) : error ? (
              <Text color="red.500" textAlign="center">
                {error}
              </Text>
            ) : (
              <TableContainer>
                <Table variant="striped">
                  <Thead bg="#fff">
                    <Tr>
                      <Th fontSize="13px" color="#534D59" fontWeight="600">
                        Specialization
                      </Th>
                      <Th fontSize="13px" color="#534D59" fontWeight="600">
                        Ward
                      </Th>
                      <Th fontSize="13px" color="#534D59" fontWeight="600">
                        Admission Status
                      </Th>
                      <Th fontSize="13px" color="#534D59" fontWeight="600">
                        Patient
                      </Th>
                      <Th fontSize="13px" color="#534D59" fontWeight="600">
                        MRN
                      </Th>
                      <Th fontSize="13px" color="#534D59" fontWeight="600">
                        Admission Date
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedData.map((item) => (
                      <TableRowY
                        key={item._id}
                        type="AdmissionDailyReport"
                        specialization={item.admittospecialization}
                        ward={item.referedward?.wardname || "-"}
                        admissionStatus={item.status}
                        patient={`${item.patient.firstName} ${item.patient.lastName}`}
                        mrn={item.patient.MRN || "-"}
                        admissionDate={new Date(item.createdAt).toLocaleDateString()}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Box>

          {/* Pagination */}
          {!loading && filteredData.length > 0 && (
            <Pagination
              postPerPage={postPerPage}
              currentPage={currentPage}
              totalPosts={filteredData.length}
              paginate={setCurrentPage}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default AdmissionDailyReport;
