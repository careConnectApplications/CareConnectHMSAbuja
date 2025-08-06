import React, { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  Select,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import { IoIosCloseCircle } from "react-icons/io";
import { FaNoteSticky } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import {
  GetAllClinicApi,
  GetAllTheatreApi,
  SettingsApi,
  ReferTheatreAdmissionApi,
  SearchPatientApi,
} from "../Utils/ApiCalls";
import Preloader from "./Preloader";

export default function ReferTheatreAdmissionWithPatientModal({
  isOpen,
  onClose,
  activateNotifications,
  type,
  oldPayload,
  onRefresh,
}) {
  const [submitting, setSubmitting] = useState(false); // for form submission
  const [isLoading, setIsLoading] = useState(false); // for data fetching
  const [Clinics, setClinics] = useState([]);
  const [Theatres, setTheatres] = useState([]);
  const [Settings, setSettings] = useState("");
  // Remove pre-loaded patients and instead use searchResults only
  const [searchResults, setSearchResults] = useState([]);
  // New state to track if patient search is in progress
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [searchMRN, setSearchMRN] = useState("");
  const [selectedPatientInfo, setSelectedPatientInfo] = useState(null);

  // Payload now includes patientId
  const [Payload, setPayload] = useState({
    patientId: "",
    clinic: "",
    indicationdiagnosisprocedure: "",
    procedure: "",
    appointmentdate: "",
    cptcodes: "",
    dxcodes: "",
    referedtheatre: "",
  });

  // Arrays to hold multiple entries
  const [ProcedureArr, setProcedureArr] = useState([]);
  const [CptcodesArr, setCptcodesArr] = useState([]);
  const [DxcodesArr, setDxcodesArr] = useState([]);

  const handlePayload = (e) => {
    setPayload({ ...Payload, [e.target.id]: e.target.value });
    if (e.target.id === "procedure") {
      setProcedureArr([...ProcedureArr, e.target.value]);
    }
    if (e.target.id === "cptcodes") {
      setCptcodesArr([...CptcodesArr, e.target.value]);
    }
    if (e.target.id === "dxcodes") {
      setDxcodesArr([...DxcodesArr, e.target.value]);
    }
  };

  const removeProcedureArr = (item) => {
    setProcedureArr(ProcedureArr.filter((x) => x !== item));
  };

  const removeCptcodesArr = (item) => {
    setCptcodesArr(CptcodesArr.filter((x) => x !== item));
  };

  const removeDxcodesArr = (item) => {
    setDxcodesArr(DxcodesArr.filter((x) => x !== item));
  };

  const getClinics = async () => {
    try {
      const result = await GetAllClinicApi();
      setClinics(result.queryresult.clinicdetails);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getTheatres = async () => {
    try {
      const result = await GetAllTheatreApi();
      setTheatres(result.queryresult.theatremanagementdetails);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getSettingsData = async () => {
    try {
      const result = await SettingsApi();
      setSettings(result);
    } catch (e) {
      console.log(e.message);
    }
  };

  // Remove pre-loading of patients via GetAllPatientsApi

  useEffect(() => {
    getClinics();
    getTheatres();
    getSettingsData();
    if (type === "edit" && oldPayload) {
      setPayload({
        patientId: oldPayload?.patientId || "",
        clinic: oldPayload?.clinic,
        indicationdiagnosisprocedure: oldPayload?.indicationdiagnosisprocedure,
        procedure: oldPayload?.procedure,
        appointmentdate: oldPayload?.appointmentdate,
        cptcodes: oldPayload?.cptcodes,
        dxcodes: oldPayload?.dxcodes,
        referedtheatre: oldPayload?.referedtheatre,
      });
      setProcedureArr(oldPayload?.procedure || []);
      setCptcodesArr(oldPayload?.cptcodes || []);
      setDxcodesArr(oldPayload?.dxcodes || []);
    }
  }, [isOpen]);

  // New function: call search endpoint to update patient list
  const handleSearchPatient = async () => {
    setIsLoadingPatients(true);
    try {
      const results = await SearchPatientApi(searchMRN);
      if (results?.queryresult?.patientdetails) {
        setSearchResults(results.queryresult.patientdetails);
      } else {
        setSearchResults([]);
      }
    } catch (e) {
      console.error("Error searching patient:", e.message);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  // Define isFormComplete: required fields must be filled
  const isFormComplete =
    Payload.patientId &&
    Payload.clinic &&
    Payload.indicationdiagnosisprocedure &&
    Payload.appointmentdate &&
    Payload.referedtheatre;

  const handleSubmitNew = async () => {
    setSubmitting(true);
    try {
      const result = await ReferTheatreAdmissionApi(Payload.patientId, {
        clinic: Payload.clinic,
        indicationdiagnosisprocedure: Payload.indicationdiagnosisprocedure,
        procedures: ProcedureArr,
        appointmentdate: Payload.appointmentdate,
        cptcodes: CptcodesArr,
        dxcodes: DxcodesArr,
        referedtheatre: Payload.referedtheatre,
      });
      if (result.status === 200) {
        setSubmitting(false);
        // Reset the state
        setPayload({
          patientId: "",
          clinic: "",
          indicationdiagnosisprocedure: "",
          procedure: "",
          appointmentdate: "",
          cptcodes: "",
          dxcodes: "",
          referedtheatre: "",
        });
        setProcedureArr([]);
        setCptcodesArr([]);
        setDxcodesArr([]);
        activateNotifications("Refer Theatre Admission Successful", "success");
        if (onRefresh) onRefresh();
        onClose();
      }
    } catch (e) {
      setSubmitting(false);
      activateNotifications(e.message, "error");
      onClose();
    }
  };

  // Reset form on modal close and clear patient selection and search states
  const handleCloseWithLoader = () => {
    setIsLoading(true);
    setTimeout(() => {
      onClose();
      setPayload({
        patientId: "",
        clinic: "",
        indicationdiagnosisprocedure: "",
        procedure: "",
        appointmentdate: "",
        cptcodes: "",
        dxcodes: "",
        referedtheatre: "",
      });
      setSearchMRN("");
      setSearchResults([]);
      setIsLoading(false);
    }, 200);
  };

  // Auto-search functionality with debouncing
  useEffect(() => {
    const searchPatients = async (searchTerm) => {
      if (!searchTerm || searchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      // Don't search if a patient is already selected and the search term matches
      if (selectedPatientInfo && searchTerm.includes(selectedPatientInfo.mrn)) {
        return;
      }

      try {
        setIsLoadingPatients(true);
        const results = await SearchPatientApi(searchTerm);
        if (results?.queryresult?.patientdetails) {
          setSearchResults(results.queryresult.patientdetails);
        } else {
          setSearchResults([]);
        }
      } catch (e) {
        console.error("Error searching patient:", e.message);
        setSearchResults([]);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchPatients(searchMRN);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchMRN, selectedPatientInfo]);

  // Handle patient selection from search results
  const handlePatientSelect = (patient) => {
    setPayload((prev) => ({
      ...prev,
      patientId: patient._id,
    }));
    setSelectedPatientInfo({
      name: `${patient.firstName} ${patient.lastName}`,
      mrn: patient.MRN,
    });
    setSearchResults([]); // Clear search results
    setSearchMRN(`${patient.firstName} ${patient.lastName} (MRN: ${patient.MRN})`);
  };

  // Handle search input change and clear selection if user starts typing new search
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchMRN(value);
    
    // Clear selected patient if user modifies the search significantly
    if (selectedPatientInfo && !value.includes(selectedPatientInfo.mrn)) {
      setSelectedPatientInfo(null);
      setPayload((prev) => ({
        ...prev,
        patientId: "",
      }));
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchMRN("");
      setSearchResults([]);
      setSelectedPatientInfo(null);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleCloseWithLoader} isCentered size="lg">
      <ModalOverlay />
      {isLoading || submitting ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Preloader />
        </Box>
      ) : (
        <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh" overflowY="auto">
          <ModalHeader>
            {type === "new"
              ? "Add New Refer Theatre Admission"
              : type === "edit"
              ? "Edit Refer Theatre Admission"
              : "Refer Theatre Admission Details"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {type === "new" ? (
              <Stack spacing={4}>
                {/* Patient selection with search */}
                <Box>
                  <Text mb={2} fontWeight="medium">Patient</Text>
                  <Box position="relative">
                    <Input
                      label="Search for Patient"
                      placeholder="Enter MRN, first name, or last name"
                      value={searchMRN}
                      onChange={handleSearchInputChange}
                      leftIcon={<FiSearch size={16} color="blue.500" />}
                    />
                    
                    {/* Selected Patient Display */}
                    {selectedPatientInfo && (
                      <Box mt={2} p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                        <HStack spacing={2}>
                          <Badge colorScheme="blue" variant="solid">Selected</Badge>
                          <Text fontWeight="medium">{selectedPatientInfo.name}</Text>
                          <Text fontSize="sm" color="gray.600">MRN: {selectedPatientInfo.mrn}</Text>
                        </HStack>
                      </Box>
                    )}

                    {/* Search Results Dropdown */}
                    {searchResults.length > 0 && !selectedPatientInfo && (
                      <Box
                        position="absolute"
                        top="100%"
                        left={0}
                        right={0}
                        zIndex={10}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        boxShadow="lg"
                        maxH="200px"
                        overflowY="auto"
                        mt={1}
                      >
                        {searchResults.map((patient) => (
                          <Box
                            key={patient._id}
                            p={3}
                            cursor="pointer"
                            _hover={{ bg: "blue.50" }}
                            onClick={() => handlePatientSelect(patient)}
                            borderBottom="1px solid"
                            borderColor="gray.100"
                            _last={{ borderBottom: "none" }}
                          >
                            <Text fontWeight="medium">
                              {`${patient.firstName} ${patient.lastName}`}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              MRN: {patient.MRN}
                            </Text>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {/* Loading Indicator */}
                    {isLoadingPatients && (
                      <Box
                        position="absolute"
                        top="100%"
                        left={0}
                        right={0}
                        zIndex={10}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        p={3}
                        mt={1}
                      >
                        <Text color="gray.500">Searching patients...</Text>
                      </Box>
                    )}
                  </Box>
                </Box>
                {/* Clinic selection */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select Clinic"
                  id="clinic"
                  value={Payload.clinic}
                  fontSize={Payload.clinic !== "" ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Clinics.filter((item) => item.type === "clinic").map((item, i) => (
                    <option key={i} value={item.clinic}>
                      {item.clinic}
                    </option>
                  ))}
                </Select>
                {/* Refered Theatre Dropdown */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select Theatre"
                  id="referedtheatre"
                  value={Payload.referedtheatre}
                  fontSize={Payload.referedtheatre !== "" ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Theatres.map((item, i) => (
                    <option key={i} value={item._id}>
                      {item.theatrename}
                    </option>
                  ))}
                </Select>
                {/* Procedure selection */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select Procedure"
                  id="procedure"
                  value={Payload.procedure}
                  fontSize={Payload.procedure !== "" ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Settings?.servicecategory
                    ?.filter((item) => item.category === "Procedure")[0]
                    ?.type?.map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))}
                </Select>
                {/* Display selected procedures */}
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
                  {ProcedureArr.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="25px"
                      fontSize="13px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text color="#fff" fontWeight="500" textTransform="capitalize">
                        {item}
                      </Text>
                      <Box fontSize="20px" color="#fff" onClick={() => removeProcedureArr(item)}>
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
                {/* Indication Diagnosis Procedure */}
                <Input
                  val={Payload.indicationdiagnosisprocedure !== "" ? true : false}
                  leftIcon={<FaNoteSticky />}
                  onChange={handlePayload}
                  id="indicationdiagnosisprocedure"
                  value={Payload.indicationdiagnosisprocedure}
                  label="Indication Diagnosis Procedure"
                />
                {/* Appointment Date */}
                <Input
                  leftIcon={<FaCalendarAlt />}
                  label="Appointment Date"
                  type="datetime-local"
                  value={Payload.appointmentdate}
                  onChange={handlePayload}
                  id="appointmentdate"
                />
                {/* CPT Codes */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select CPT Codes"
                  id="cptcodes"
                  value={Payload.cptcodes}
                  fontSize={Payload.cptcodes !== "" ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Settings?.cptcodes?.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
                <SimpleGrid columns={{ base: 2, md: 2 }} spacing={2}>
                  {CptcodesArr.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="25px"
                      fontSize="13px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text color="#fff" fontWeight="500" textTransform="capitalize">
                        {item}
                      </Text>
                      <Box fontSize="20px" color="#fff" onClick={() => removeCptcodesArr(item)}>
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
                {/* DX Codes */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select DX Codes"
                  id="dxcodes"
                  value={Payload.dxcodes}
                  fontSize={Payload.dxcodes !== "" ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Settings?.dxcodes?.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
                <SimpleGrid columns={{ base: 2, md: 2 }} spacing={2}>
                  {DxcodesArr.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="25px"
                      fontSize="13px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text color="#fff" fontWeight="500" textTransform="capitalize">
                        {item}
                      </Text>
                      <Box fontSize="20px" color="#fff" onClick={() => removeDxcodesArr(item)}>
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
                <Button
                  mt="32px"
                  isLoading={submitting}
                  onClick={handleSubmitNew}
                  disabled={!isFormComplete || submitting}
                >
                  Proceed
                </Button>
              </Stack>
            ) : type === "edit" ? (
              <>{/* Similar layout for editing can be implemented here */}</>
            ) : (
              <>{/* Optionally, display details if needed */}</>
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
}
