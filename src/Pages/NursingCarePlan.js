import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";
import TableRowY from "../Components/TableRowY";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import NursingCarePlanModal from "../Components/NursingCarePlanModal";
import { GetNursingCarePlansByAdmissionApi } from "../Utils/ApiCalls";

const NursingCarePlan = () => {
  // Retrieve admissionId from localStorage or from the patient object stored in localStorage
  const storedPatient = localStorage.getItem("inPatient");
  let patient = storedPatient ? JSON.parse(storedPatient) : null;
  const admissionId =
    patient && patient.admission && Array.isArray(patient.admission)
      ? patient.admission[0]
      : localStorage.getItem("admissionId");

  // State variables for data, filtering, and pagination
  const [nursingData, setNursingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = configuration.sizePerPage;

  // Filtering by criteria: "all", "diagnosis", "objectives", "date"
  const [byDate, setByDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterByCriteria, setFilterByCriteria] = useState("all");

  // State for triggering a re-fetch after add/update
  const [trigger, setTrigger] = useState(false);

  // Modal states
  const [isNursingModalOpen, setIsNursingModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (admissionId) {
      GetNursingCarePlansByAdmissionApi(admissionId)
        .then((data) => {
          const plans =
            data && data.status && data.queryresult && data.queryresult.nursingcareplandetails
              ? data.queryresult.nursingcareplandetails
              : [];
          setNursingData(plans);
          setFilteredData(plans);
        })
        .catch((error) => {
          console.error("Error fetching nursing care plans:", error.message);
        });
    }
  }, [admissionId, trigger]);
  
  // Filtering logic: update filteredData when criteria or search input/dates change
  useEffect(() => {
    if (filterByCriteria === "all") {
      setFilteredData(nursingData);
    } else if (filterByCriteria === "diagnosis") {
      setFilteredData(
        nursingData.filter((item) =>
          item.nursingdiagnosis
            .join(", ")
            .toLowerCase()
            .includes(searchInput.toLowerCase())
        )
      );
    } else if (filterByCriteria === "objectives") {
      setFilteredData(
        nursingData.filter((item) =>
          item.objectives.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    } else if (filterByCriteria === "date") {
      if (startDate && endDate) {
        // Convert endDate to include the entire day
        let endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        let formattedEndDate = endDateObj.toISOString().split("T")[0];
        setFilteredData(
          nursingData.filter((item) => {
            // Convert item's createdAt to YYYY-MM-DD format
            const createdOn = new Date(item.createdAt)
              .toISOString()
              .split("T")[0];
            return createdOn >= startDate && createdOn <= formattedEndDate;
          })
        );
      } else {
        setFilteredData(nursingData);
      }
    }
    setCurrentPage(1);
  }, [filterByCriteria, searchInput, startDate, endDate, nursingData]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Open modal in create mode
  const handleAddNursingCare = () => {
    setModalType("create");
    setSelectedPlan(null);
    setIsNursingModalOpen(true);
  };

  // Open modal in edit mode (for a given plan)
  const handleEditNursingCare = (plan) => {
    setSelectedPlan(plan);
    setModalType("edit");
    setIsNursingModalOpen(true);
  };

 
  const handleViewNursingCare = (id) => {
    console.log("View Nursing Care with id:", id);
  
  };

  return (
    <Box p="20px">
     
      <Flex justifyContent="space-between" alignItems="center" mb="20px">
        <Button
          rightIcon={<SlPlus />}
          onClick={handleAddNursingCare}
          w={["100%", "100%", "250px", "250px"]}
        >
          Add Nursing Care
        </Button>

        <Flex
          flexWrap="wrap"
          mt={["10px", "10px", "20px", "20px"]}
          alignItems="center"
          justifyContent="flex-end"
        >
          <HStack flexWrap={["wrap", "nowrap"]} spacing="4">
            {!byDate ? (
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

            {/* Filter Menu */}
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
                    setFilterByCriteria("diagnosis");
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
                    <Text>by Diagnosis</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilterByCriteria("objectives");
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
                    <Text>by Objectives</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilterByCriteria("date");
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
                    setFilterByCriteria("all");
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
                    <Text>clear filter</Text>
                  </HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Flex>

      {/* Nursing Care Plan Table */}
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
                Nursing Diagnosis
              </Th>
              <Th fontSize="13px" fontWeight="600">
                Objectives
              </Th>
              <Th fontSize="13px" fontWeight="600">
                Action / Intervention
              </Th>
              <Th fontSize="13px" fontWeight="600">
                Evaluation
              </Th>
              <Th fontSize="13px" fontWeight="600">
                Staff Name
              </Th>
              <Th fontSize="13px" fontWeight="600">
                Created On
              </Th>
              <Th fontSize="13px" fontWeight="600">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.map((item) => (
              <TableRowY
                key={item._id}
                type="nursing-care"
                nursingDiagnosis={item.nursingdiagnosis.join(", ")}
                objectives={item.objectives}
                actionintervention={item.actionintervention}
                evaluation={item.evaluation}
                staffName={item.staffname}
                createdOn={new Date(item.createdAt).toISOString().split("T")[0]}
                onView={() => handleViewNursingCare(item._id)}
                onEdit={() => handleEditNursingCare(item)}
              />
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      {filteredData.length > itemsPerPage && (
        <Pagination
          postPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPosts={filteredData.length}
          paginate={setCurrentPage}
        />
      )}

      {/* Nursing Care Plan Modal */}
      <NursingCarePlanModal
        isOpen={isNursingModalOpen}
        onClose={() => setIsNursingModalOpen(false)}
        onSuccess={() => setTrigger((prev) => !prev)}
        admissionId={admissionId}
        type={modalType}
        initialData={modalType === "edit" ? selectedPlan : null}
      />
    </Box>
  );
};

export default NursingCarePlan;
