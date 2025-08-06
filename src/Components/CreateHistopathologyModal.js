import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Box,
  SimpleGrid,
  Flex,
  Text,
  CheckboxGroup,
  Checkbox,
  Stack,
  RadioGroup,
  Radio,
  HStack,
  Badge,
} from "@chakra-ui/react";
import Button from "./Button";
import Input from "./Input";
import TextArea from "./TextArea";
import ShowToast from "./ToastNotification";
import { IoIosCloseCircle } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import {
  SearchPatientApi,SettingsApi,
  CreateHistologyApi, // Assuming this API exists for creating histology requests
  GetAllUsersApi, // Assuming this API exists to get doctors
} from "../Utils/ApiCalls";
import Preloader from "./Preloader";

export default function CreateHistopathologyModal({
  isOpen,
  onClose,
  activateNotifications,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [Settings, setSettings] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [selectedPatientInfo, setSelectedPatientInfo] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const initialPayload = {
    patientId: "",
    examTypes: [],
    doctorId: "",
    lmp: "",
    biopsyType: "",
    wholeOrgan: "",
    previousBiopsy: false,
    
    
  };

  const [payload, setPayload] = useState(initialPayload);
  const [searchMRN, setSearchMRN] = useState("");

  const handlePayload = (e) => {
    const { id, value } = e.target;
    setPayload({ ...payload, [id]: value });
  };

  const handleCheckboxChange = (values) => {
    setPayload({ ...payload, examTypes: values });
  };

  const handleRadioChange = (value) => {
    setPayload({ ...payload, previousBiopsy: value === "true" });
  };



  const fetchDoctors = async () => {
    try {
      const result = await GetAllUsersApi();
      console.log("Doctors API response:", result);
      if (result?.status) {
        const doctorUsers = result.queryresult.userdetails.filter(
          (user) => user.role === "Medical Doctor"
        );
        setDoctors(doctorUsers);
      }
    } catch (e) {
      console.error("Error fetching doctors:", e.message);
    }
  };

  const handleSearchPatient = async () => {
    if (!searchMRN.trim()) {
      activateNotifications("Please enter a patient identifier to search.", "warning");
      return;
    }
    setIsLoadingPatients(true);
    try {
      const results = await SearchPatientApi(searchMRN);
      if (results?.queryresult?.patientdetails?.length > 0) {
        setSearchResults(results.queryresult.patientdetails);
      } else {
        setSearchResults([]);
        activateNotifications("No patient found with the provided details.", "info");
      }
    } catch (e) {
      console.error("Error searching patient:", e.message);
      activateNotifications("An error occurred while searching for the patient.", "error");
    } finally {
      setIsLoadingPatients(false);
    }
  };

   const getSettings = async () => {
          try {
              const result = await SettingsApi();

              console.log("Settings API response:", result.servicecategory.filter(item => item.category === "Histopathology")[0]?.type);
                 
  
              setSettings(result.servicecategory.filter(item => item.category === "Histopathology")[0]?.type);
          } catch (e) {
  
          }
      };
      

  const createHistologyRequest = async () => {
    console.log("Creating Histology Request with payload:", payload);
    
    setLoading(true);
    try {
      const result = await CreateHistologyApi(payload);
      if (result.status === 201 || result.status === 200) {
        setLoading(false);
        onClose();
        setPayload(initialPayload);
        setSearchResults([]);
        setSearchMRN("");
        activateNotifications("Histopathology Request Created Successfully", "success");
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
    }
  };

  useEffect(() => {
    getSettings()
    if (isOpen) {
      fetchDoctors();
    }
  }, [isOpen]);


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
      setPayload(initialPayload);
      setSearchMRN("");
      setSearchResults([]);
      setSelectedPatientInfo(null);
    }
  }, [isOpen]);

  const isFormComplete = payload.patientId && payload.examTypes.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Preloader />
        </Box>
      ) : (
        <ModalContent maxW={{ base: "90%", md: "70%" }} >
          <ModalHeader>Request Histopathology Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Patient Search Section */}
            <Box mb={4}>
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

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
              <Box>
                <Text mb={2} fontWeight="bold">Examination Types</Text>
                <CheckboxGroup colorScheme="blue" onChange={handleCheckboxChange} value={payload.examTypes}>
                  <Stack spacing={2}>
                  {
                    Settings.map((examType) => (
                      <Checkbox key={examType} value={examType}>
                        {examType}
                      </Checkbox>
                    ))
                  }
                   
                   
                  </Stack>
                </CheckboxGroup>
              </Box>
               <Box>
                <Text mb={2} fontWeight="bold">Previous Biopsy?</Text>
                <RadioGroup onChange={handleRadioChange} value={payload.previousBiopsy.toString()}>
                  <Stack direction="row">
                    <Radio value="true">Yes</Radio>
                    <Radio value="false">No</Radio>
                  </Stack>
                </RadioGroup>
              </Box>

              <Select id="doctorId" placeholder="Select Doctor" onChange={handlePayload} value={payload.doctorId}>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
              </Select>

              <Input id="lmp" label="LMP" type="date" onChange={handlePayload} value={payload.lmp} />
              <Input id="parity" label="Parity" onChange={handlePayload} value={payload.parity} />
              <Select id="biopsyType" placeholder="Select Biopsy Type" onChange={handlePayload} value={payload.biopsyType}>
                <option value="Excision">Excision</option>
                <option value="Incision">Incision</option>
                <option value="Endoscopy">Endoscopy</option>
                <option value="Trucut">Trucut</option>
              </Select>
              <Input id="wholeOrgan" label="Whole Organ" onChange={handlePayload} value={payload.wholeOrgan} />
              <Input id="NumberOfBlocks" label="Number of Blocks" type="number" onChange={handlePayload} value={payload.NumberOfBlocks} />
              
             

          
            </SimpleGrid>

            

            <Button
              mt="32px"
              onClick={createHistologyRequest}
              isLoading={loading}
              disabled={!isFormComplete || loading}
              w="full"
            >
              Create Request
            </Button>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
}
