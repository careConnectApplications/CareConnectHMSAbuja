import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Spinner,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from "@chakra-ui/react";
import { SlPlus } from "react-icons/sl";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { configuration } from "../Utils/Helpers";
import WardRoundModal from "../Components/WardRoundModal";
import TableRowY from "../Components/TableRowY";
import Pagination from "../Components/Pagination";
import Button from "../Components/Button";
import moment from "moment";
import Input from "../Components/Input";
import { ReadAllWardRoundByAdmissionApi } from "../Utils/ApiCalls";

const WardRound = () => {
  const [wardRoundData, setWardRoundData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtering and pagination state
  const [filter, setFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [byDate, setByDate] = useState(false);

  // Modal state for ward round creation/updating
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWardRound, setSelectedWardRound] = useState(null);
  const [modalType, setModalType] = useState("create");

  const [trigger, setTrigger] = useState(false);
  const postPerPage = configuration.sizePerPage;

  const storedPatient = localStorage.getItem("inPatient");
  let patient = storedPatient ? JSON.parse(storedPatient) : null;
  const admissionId =
    patient && patient.admission && Array.isArray(patient.admission)
      ? patient.admission[0]
      : localStorage.getItem("admissionId");






      const GetAllWardRound = async() =>{

        setLoading(true);
        try {
          const response = await ReadAllWardRoundByAdmissionApi(admissionId);
          console.log("Ward Round Data:", response);

      
          setFilteredData(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }

      }

  useEffect(() => {
    if (admissionId) {
      GetAllWardRound();
    } else {
    //   setError("No admission ID found.");
        console.error("No admission ID found.");
    }
  }, [admissionId, trigger]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredData(wardRoundData);
    } else if (filter === "date") {
      if (StartDate && EndDate) {
        let endDateObj = new Date(EndDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        let formattedEndDate = endDateObj.toISOString().split("T")[0];
        setFilteredData(
          wardRoundData.filter(
            (item) =>
              item.createdDate >= StartDate && item.createdDate <= formattedEndDate
          )
        );
      } else {
        setFilteredData(wardRoundData);
      }
    } else if (filter === "createdBy") {
      setFilteredData(
        wardRoundData.filter((item) =>
          item.createdBy.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    } else if (filter === "admissionNote") {
      setFilteredData(
        wardRoundData.filter((item) =>
          item.admissionNote.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    }
    setCurrentPage(1);
  }, [filter, searchInput, StartDate, EndDate, wardRoundData]);

  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const paginatedData = filteredData.slice(indexOfFirstPost, indexOfLastPost);

  // Handlers for modal actions
  const handleAddWardRound = () => {
    setModalType("create");
    setSelectedWardRound(null);
    setIsModalOpen(true);
  };

  const handleEditWardRound = (wardRoundData) => {
    setModalType("edit");
    setSelectedWardRound(wardRoundData);
    setIsModalOpen(true);
  };

  const handleViewWardRound = (wardRoundData) => {
    setModalType("view");
    setSelectedWardRound(wardRoundData);
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
          w={["100%", "100%", "255px", "255px"]}
          onClick={handleAddWardRound}
        >
          Add Ward Round
        </Button>
        <Flex
          flexWrap="wrap"
          mt={["10px", "10px", "0", "0"]}
          alignItems="center"
          justifyContent="flex-end"
        >
          <HStack spacing="4">
            {!byDate ? (
              <Input
                label="Search"
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                bColor="#E4E4E4"
                leftIcon={<BiSearch />}
              />
            ) : (
              <HStack>
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
                    setFilter("admissionNote");
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
                    <Text>by Admission Note</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilter("createdBy");
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
                    <Text>by Created By</Text>
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
      <Box mt="12px" py="15px" px="15px" rounded="10px" overflowX="auto">
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
                    Date
                  </Th>
                 
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Admission Note
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Staff Name
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedData.map((item) => (
                  <TableRowY
                    key={item.id}
                    type="ward-round"
                    doctor={`${item.createdBy.firstName} ${item.createdBy.lastName}`}
                    note={item.admissionNote}
                    date={moment(item.createdAt).format("LLL")}
                    onEdit={() => handleEditWardRound(item)}
                    onView={() => handleViewWardRound(item)}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
      {!loading && filteredData.length > 0 && (
        <Pagination
          postPerPage={postPerPage}
          currentPage={currentPage}
          totalPosts={filteredData.length}
          paginate={setCurrentPage}
        />
      )}

      {/* Ward Round Modal Integration */}
      <WardRoundModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        admissionId={modalType === "create" ? admissionId : undefined}
        onSuccess={() => setTrigger((prev) => !prev)}
        type={modalType}
        initialData={modalType !== "create" ? selectedWardRound : null}
      />
    </Box>
  );
};

export default WardRound;
