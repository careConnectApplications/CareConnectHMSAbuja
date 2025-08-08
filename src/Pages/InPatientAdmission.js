import React, { useState, useEffect } from "react";
import {
  Text,
  Flex,
  Box,
  Spinner,
  HStack,
  Select,
  SimpleGrid,
  useDisclosure,
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
import ShowToast from "../Components/ToastNotification";
import {
  GetAllReferredForAdmissionApi,
  GetAllWardApi,
  DischargePatientApi,
} from "../Utils/ApiCalls";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import Input from "../Components/Input";
import { configuration } from "../Utils/Helpers";
import Button from "../Components/Button";
import ToTransferModal from "../Components/ToTransferModal";

const InPatientAdmission = () => {
  const [filter, setFilter] = useState("all");
  const [admissionData, setAdmissionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState(null);
  const postPerPage = configuration.sizePerPage;
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");

  const nav = useNavigate();

  // Fetch wards on component mount
  useEffect(() => {
    const fetchWards = async () => {
      try {
        const result = await GetAllWardApi();
        setWards(result.queryresult.wardmanagementdetails || []);
      } catch (error) {
        console.error("Failed to fetch wards:", error.message);
      }
    };
    fetchWards();
  }, []);

  // Fetch admissions when ward is selected
  const fetchAdmissions = async () => {
    if (!selectedWard) return;
    try {
      setLoading(true);
      const response = await GetAllReferredForAdmissionApi(selectedWard);
      if (response?.queryresult?.admissiondetails) {
        setAdmissionData(response.queryresult.admissiondetails);
      } else {
        setAdmissionData([]);
      }
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError("Failed to fetch data");
      setToast({
        status: "error",
        message: "Failed to fetch admission data",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update filtered data when filter or admissionData changes
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

  const GetPatientTimeline = (PatientId, item) => {
    nav(`/dashboard/in-patient-timeline/${PatientId}`);
    localStorage.setItem("inPatient", JSON.stringify(item));
  };

  // Handle status updates (admit/transfer)

  // Enhanced discharge handler with proper error handling and feedback
  const handleDischarge = async (admissionId) => {
    setUpdating(admissionId);
    try {
      const result = await DischargePatientApi(admissionId);

      if (result.status === true) {
        setToast({
          status: "success",
          message: "Patient discharged successfully!",
        });
        fetchAdmissions(); // Refresh the data
      } else {
        setToast({
          status: "error",
          message: result.queryresult || "Failed to discharge patient",
        });
      }
    } catch (error) {
      console.error("Discharge error:", error);
      setToast({
        status: "error",
        message: error.message || "Failed to discharge patient",
      });
    } finally {
      setUpdating(null);
    }
  };

  // Handle transfer functionality
  const handleTransfer = (admission) => {
    setSelectedAdmission(admission);
    onOpen();
  };

  // Filter functions
  const filterBy = (title) => {
    let filtered = admissionData;
    if (title === "patient") {
      filtered = admissionData.filter(
        (item) =>
          item.patient?.firstName
            .toLowerCase()
            .includes(searchInput.toLowerCase()) ||
          item.patient?.lastName
            .toLowerCase()
            .includes(searchInput.toLowerCase())
      );
    } else if (title === "doctor") {
      filtered = admissionData.filter((item) =>
        item.doctorname.toLowerCase().includes(searchInput.toLowerCase())
      );
    } else if (title === "specialization") {
      filtered = admissionData.filter((item) =>
        item.admittospecialization
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      );
    } else if (title === "mrn") {
      filtered = admissionData.filter((item) =>
        String(item.patient?.MRN || item.MRN || "")
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      );
    } else if (title === "date") {
      let endDateObj = new Date(EndDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      let formattedEndDate = endDateObj.toISOString().split("T")[0];
      filtered = admissionData.filter(
        (item) =>
          item.referddate >= StartDate && item.referddate <= formattedEndDate
      );
    }
    setFilteredData(filtered);
  };

  // Pagination calculations
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const paginatedData = filteredData.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px="18px"
      rounded="10px"
    >
      {toast && <ShowToast status={toast.status} message={toast.message} />}

      <Text color="blue.blue500" mt="9px" fontWeight="400" fontSize="15px">
        Kindly Select Clinic you want to manage
      </Text>

      {/* Ward Selection and Fetch Button */}
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

      {selectedWard && (
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
                "ToTransfer",
                "Transfered",
                "ToDischarge",
                "Discharged",
              ].map((status) => (
                <Box
                  key={status}
                  pr="5px"
                  onClick={() => setFilter(status.toLowerCase())}
                >
                  <Text
                    py="8.5px"
                    px="12px"
                    bg={
                      filter === status.toLowerCase() ? "#fff" : "transparent"
                    }
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
              justifyContent={"flex-end"}
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
                      fontWeight={"500"}
                      color="#2F2F2F"
                      _hover={{
                        color: "#fff",
                        fontWeight: "400",
                        bg: "blue.blue500",
                      }}
                    >
                      <HStack fontSize="14px">
                        <Text>by patient</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => filterBy("doctor")}
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
                        <Text>by doctor</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => filterBy("specialization")}
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
                        <Text>by Specialization</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => filterBy("mrn")}
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
                        <Text>by MRN</Text>
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
                        setFilter("all");
                        setSearchInput("");
                        setByDate(false);
                        setStartDate("");
                        setEndDate("");
                        setFilteredData(admissionData);
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

          {/* Admission Table */}
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
                        Patient Name
                      </Th>
                      <Th fontSize="13px" color="#534D59" fontWeight="600">
                        MRN
                      </Th>
                      <Th fontSize="13px" color="#534D59" fontWeight="600">
                        Doctor
                      </Th>
                      <Th fontSize="13px" color="#534D59" fontWeight="600">
                        Specialization
                      </Th>
                      <Th fontSize="13px" color="#534D59" fontWeight="600">
                        Remark
                      </Th>
                      <Th fontSize="13px" color="#534D59" fontWeight="600">
                        Referred Date
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
                    {paginatedData.map((item) => (
                      <TableRowY
                        key={item._id}
                        type="in-patientAdmission"
                        mrn={item.patient?.MRN || item.MRN || "-"}
                        patient={
                          item.patient
                            ? `${item.patient?.firstName || ""} ${
                                item.patient?.lastName || ""
                              }`.trim()
                            : "-"
                        }
                        doctor={item.doctorname || "-"}
                        specialization={item.admittospecialization || "-"}
                        remark={item.alldiagnosis || "-"}
                        referredDate={
                          item.referddate
                            ? new Date(item.referddate).toLocaleDateString()
                            : "-"
                        }
                        status={item.status || "-"}
                        onView={() =>
                          GetPatientTimeline(item.patient?._id, item.patient)
                        }
                        onDischarge={() => handleDischarge(item._id)}
                        onTransfer={() => handleTransfer(item)}
                        isUpdating={updating === item._id}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Box>

          {/* Transfer Modal */}
          <ToTransferModal
            isOpen={isOpen}
            oldPayload={selectedAdmission}
            onClose={onClose}
            onSuccess={() => {
              fetchAdmissions();
              setToast({
                status: "success",
                message: "Patient transferred successfully!",
              });
            }}
          />

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

export default InPatientAdmission;
