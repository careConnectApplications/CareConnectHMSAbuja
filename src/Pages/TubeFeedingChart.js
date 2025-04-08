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
import { SlPlus } from "react-icons/sl";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import Pagination from "../Components/Pagination";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TableRowY from "../Components/TableRowY";
import { configuration } from "../Utils/Helpers";
import { ReadAllTubeFeedingChartByAdmissionApi } from "../Utils/ApiCalls";
import TubeFeedingChartModal from "../Components/TubeFeedingChartModal";

const TubeFeedingChart = () => {
  const [tubeFeedingData, setTubeFeedingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [byDate, setByDate] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalType, setModalType] = useState("create");

  const [trigger, setTrigger] = useState(false);
  const itemsPerPage = configuration.sizePerPage;

  const storedPatient = localStorage.getItem("inPatient");
  let patient = storedPatient ? JSON.parse(storedPatient) : null;
  const admissionId =
    patient && patient.admission && Array.isArray(patient.admission)
      ? patient.admission[0]
      : localStorage.getItem("admissionId");

  useEffect(() => {
    if (admissionId) {
      setLoading(true);
      ReadAllTubeFeedingChartByAdmissionApi(admissionId)
        .then((response) => {
          console.log("API response:", response);
          const data = response || [];
          const transformedData = data.map((item) => {
            const dt = new Date(item.Datetimefeeds);
            const date = dt.toISOString().split("T")[0];
            const time = dt.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
            return {
              id: item._id,
              date,
              time,
              amount: item.amount,
              sign: item.sign,
              Datetimefeeds: item.Datetimefeeds,
            };
          });
          setTubeFeedingData(transformedData);
          setFilteredData(transformedData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching tube feeding data:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [admissionId, trigger]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredData(tubeFeedingData);
    } else if (filter === "tubeFeedingTime") {
      setFilteredData(
        tubeFeedingData.filter((item) =>
          item.time.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    } else if (filter === "date") {
      if (startDate && endDate) {
        let endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        let formattedEndDate = endDateObj.toISOString().split("T")[0];
        setFilteredData(
          tubeFeedingData.filter(
            (item) => item.date >= startDate && item.date <= formattedEndDate
          )
        );
      } else {
        setFilteredData(tubeFeedingData);
      }
    }
    setCurrentPage(1);
  }, [filter, searchInput, startDate, endDate, tubeFeedingData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Modal handlers
  const handleAddTubeFeedingChart = () => {
    setModalType("create");
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const handleEditTubeFeedingChart = (record) => {
    setModalType("edit");
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  return (
    <Box p={["10px", "20px"]}>
      {/* Header Section */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
        <Button
          rightIcon={<SlPlus />}
          onClick={handleAddTubeFeedingChart}
          w={["100%", "100%", "250px", "250px"]}
        >
          Add Tube Feeding Chart
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
                  
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setFilter("tubeFeedingTime");
                  }}
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
                    setFilter("tubeFeedingTime");
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
                    <Text>by Time</Text>
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
                Amount
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
                type="tube-feeding-chart"
                date={item.date}
                tubeFeedingTime={item.time}
                tubeFeedingAmount={item.amount}
                tubeFeedingSign={item.sign}
                onEdit={() => handleEditTubeFeedingChart(item)}
              />
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      {filteredData.length > itemsPerPage && !loading && (
        <Pagination
          postPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPosts={filteredData.length}
          paginate={setCurrentPage}
        />
      )}

      {/* Tube Feeding Chart Modal Integration */}
      <TubeFeedingChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setTrigger((prev) => !prev)}
        admissionId={admissionId}
        type={modalType}
        initialData={modalType === "edit" ? selectedRecord : null}
      />
    </Box>
  );
};

export default TubeFeedingChart;
