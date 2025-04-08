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
import SingleMedicalChartModal from "../Components/MedicalChartModal";
import TableRowY from "../Components/TableRowY";
import Pagination from "../Components/Pagination";
import Button from "../Components/Button";
import Input from "../Components/Input";
import { ReadAllMedicationChartByAdmissionApi } from "../Utils/ApiCalls";

const SingleMedicationChart = () => {

  const [medicationData, setMedicationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [filter, setFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [byDate, setByDate] = useState(false);

  // Modal state for medication chart creation/updating
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [modalType, setModalType] = useState("create"); 


  const [trigger, setTrigger] = useState(false);
  const postPerPage = configuration.sizePerPage;


  const storedPatient = localStorage.getItem("inPatient");
  let patient = storedPatient ? JSON.parse(storedPatient) : null;
  const admissionId =
    patient && patient.admission && Array.isArray(patient.admission)
      ? patient.admission[0]
      : localStorage.getItem("admissionId");


  useEffect(() => {
    if (admissionId) {
      setLoading(true);
      ReadAllMedicationChartByAdmissionApi(admissionId)
        .then((response) => {

          const data = response?.queryresult?.medicationchartsdetails || [];
          const transformedData = data.map((item) => ({
            id: item._id,
            drug: item.drug,
            note: item.note,
            dose: item.dose,
            frequency: item.frequency,
            route: item.route,
            createdBy: item.createdBy || item.staffname || "Unknown",
         
            createdOn: new Date(item.createdAt).toISOString().split("T")[0],
          }));
          setMedicationData(transformedData);
          setFilteredData(transformedData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching medication chart data:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [admissionId, trigger]);

  
  useEffect(() => {
    if (filter === "all") {
      setFilteredData(medicationData);
    } else if (filter === "date") {
      if (StartDate && EndDate) {
        let endDateObj = new Date(EndDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        let formattedEndDate = endDateObj.toISOString().split("T")[0];
        setFilteredData(
          medicationData.filter(
            (item) =>
              item.createdOn >= StartDate && item.createdOn <= formattedEndDate
          )
        );
      } else {
        setFilteredData(medicationData);
      }
    } else if (filter === "createdBy") {
      setFilteredData(
        medicationData.filter((item) =>
          item.createdBy.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    } else if (filter === "drug") {
      setFilteredData(
        medicationData.filter((item) =>
          item.drug.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    }
  }, [filter, searchInput, StartDate, EndDate, medicationData]);


  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const paginatedData = filteredData.slice(indexOfFirstPost, indexOfLastPost);

  // Handler to open the modal in create mode
  const handleAddMedication = () => {
    setModalType("create");
    setSelectedMedication(null);
    setIsModalOpen(true);
  };

  // Handler to open the modal in edit mode
  const handleEditMedication = (medication) => {
    setSelectedMedication(medication);
    setModalType("edit");
    setIsModalOpen(true);
  };

  return (
    <Box bg="#fff" border="1px solid #EFEFEF" mt="10px" py="17px" px="18px" rounded="10px">
  
      <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
        <Button
          rightIcon={<SlPlus />}
          w={["100%", "100%", "255px", "255px"]}
          onClick={handleAddMedication}
        >
          Add Medication Chart
        </Button>
        <Flex flexWrap="wrap" mt={["10px", "10px", "0", "0"]} alignItems="center" justifyContent="flex-end">
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
                {/* Filter by Created By */}
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
                {/* Filter by Drug */}
                <MenuItem
                  onClick={() => {
                    setFilter("drug");
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
                    <Text>by Drug</Text>
                  </HStack>
                </MenuItem>
                {/* Filter by Date */}
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
                {/* Clear Filter */}
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
                    Drug
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Note
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Dose
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Frequency
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Route
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Created By
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Created On
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
                    type="medication-chart"
                    drug={item.drug}
                    note={item.note}
                    dose={item.dose}
                    frequency={item.frequency}
                    route={item.route}
                    createdBy={item.createdBy}
                    createdOn={item.createdOn}
                    onEdit={() => handleEditMedication(item)}
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

      {/* Medication Chart Modal Integration */}
      <SingleMedicalChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        admissionId={admissionId} // Pass admissionId if needed during creation
        onSuccess={() => setTrigger((prev) => !prev)}
        type={modalType}
        initialData={modalType === "edit" ? selectedMedication : null}
      />
    </Box>
  );
};

export default SingleMedicationChart;
