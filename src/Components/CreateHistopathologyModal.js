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
      if (result?.data) {
        const doctorUsers = result.data.filter(
          (user) => user.role.toLowerCase() === "doctor"
        );
        setDoctors(doctorUsers);
      }
    } catch (e) {
      console.error("Error fetching doctors:", e);
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

  useEffect(() => {
    if (!isOpen) {
      setPayload(initialPayload);
      setSearchMRN("");
      setSearchResults([]);
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
              <Flex mb={2} gap={4}>
                <Input
                  label="Search for Patient"
                  placeholder="Enter MRN, first name, or last name"
                  value={searchMRN}
                  onChange={(e) => setSearchMRN(e.target.value)}
                  leftIcon={<FiSearch size={16} color="blue.500" />}
                  flex="1"
                />
                <Button onClick={handleSearchPatient} w={["100%", "100%", "165px", "205px"]} isLoading={isLoadingPatients}>
                  Search
                </Button>
              </Flex>
              <Select
                onChange={(e) => setPayload({ ...payload, patientId: e.target.value })}
                placeholder={isLoadingPatients ? "Loading patients..." : "Select Patient"}
                border="2px solid"
                id="patientId"
                value={payload.patientId}
                size="lg"
                fontSize={payload.patientId !== "" ? "16px" : "13px"}
                borderColor="gray.500"
                mt={searchResults.length > 0 ? 4 : 0}
                isDisabled={isLoadingPatients}
              >
                {searchResults.map((item, i) => (
                  <option key={i} value={item._id}>
                    {`${item.firstName} ${item.lastName} ~ ${item.MRN}`}
                  </option>
                ))}
              </Select>
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
