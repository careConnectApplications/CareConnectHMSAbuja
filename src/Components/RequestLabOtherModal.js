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
  HStack,
  Badge,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "./Input";
import TextArea from "./TextArea";
import ShowToast from "./ToastNotification";
import { IoIosCloseCircle } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import {
  GetAllPatientsApi,
  SettingsApi,
  RequestLabOrderStandAloneApi,
  SearchPatientApi,
  SearchTestApi, // API for test search
  GetAllClinicApi,  // Used to fetch clinic details for labs
} from "../Utils/ApiCalls";
import Preloader from "./Preloader";

export default function RequestLabOtherModal({
  isOpen,
  onClose,
  type,
  activateNotifications,
  oldPayload,
  onSuccess, // Callback to notify parent on success
}) {
  const [Loading, setLoading] = useState(false);
  const [Settings, setSettings] = useState({});
  const [TestNames, setTestNames] = useState([]);
  // We now rely solely on search results instead of pre-loading patients.
  const [searchResults, setSearchResults] = useState([]);
  // State to track whether patient search is in progress
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [selectedPatientInfo, setSelectedPatientInfo] = useState(null);

  // New states for test search
  const [searchTestQuery, setSearchTestQuery] = useState("");
  const [testSearchResults, setTestSearchResults] = useState([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);

  // New state for Lab list (departments)
  const [labs, setLabs] = useState([]);

  // Update payload to store the lab name under "department", along with testNames and patient id.
  const [Payload, setPayload] = useState({
    department: "",
    testNames: "",
    id: "",
  });
  const [searchMRN, setSearchMRN] = useState("");

  // Log the payload on every update.
  useEffect(() => {
    console.log("Payload:", Payload);
  }, [Payload]);

  // Generic handler to update the payload.
  // For test selection, we also add the selected test to TestNames.
  const handlePayload = (e) => {
    setPayload({ ...Payload, [e.target.id]: e.target.value });
    if (e.target.id === "testNames") {
      setTestNames([...TestNames, e.target.value]);
    }
  };

  const getSettings = async () => {
    try {
      const result = await SettingsApi();
      setSettings(result);
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch labs from the clinic API by filtering for items with type "lab"
  const getLabs = async () => {
    try {
      const result = await GetAllClinicApi();
      if (result?.queryresult?.clinicdetails) {
        const labList = result.queryresult.clinicdetails.filter(
          (item) => item.type === "lab"
        );
        setLabs(labList);
      }
    } catch (e) {
      console.error("Error fetching labs:", e);
    }
  };

  // Trigger lab order request with the selected patient, department (lab), and tests.
  const RequestLabOrder = async () => {
    setLoading(true);
    try {
      // Pass the payload with "department" key instead of "lab".
      const result = await RequestLabOrderStandAloneApi(
        { testname: TestNames, notfromappointment: true, department: Payload.department },
        Payload.id
      );
      if (result.status === 200) {
        setLoading(false);
        onClose();
        // Reset payload and test names.
        setPayload({ department: "", testNames: "", id: "" });
        setTestNames([]);
        activateNotifications("Lab Order Created Successfully", "success");
        if (onSuccess) {
          onSuccess(); // Trigger parent's refresh callback
        }
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
      onClose();
    }
  };

  const removeTestName = (item) => {
    const updatedTestNames = TestNames.filter((test) => test !== item);
    setTestNames(updatedTestNames);
  };

  // Handler for searching a patient using MRN or first/last name.
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

  // Trigger test search on every change in searchTestQuery.
  useEffect(() => {
    const fetchTests = async () => {
      if (searchTestQuery.trim() !== "") {
        setIsLoadingTests(true);
        try {
          const results = await SearchTestApi(searchTestQuery);
          console.log("Test search API response:", results);
          if (results?.queryresult) {
            setTestSearchResults(results.queryresult);
          } else {
            setTestSearchResults([]);
          }
        } catch (e) {
          console.error("Error searching test:", e.message);
          setTestSearchResults([]);
        } finally {
          setIsLoadingTests(false);
        }
      } else {
        // If no search query, clear search results so that default list is shown.
        setTestSearchResults([]);
      }
    };

    fetchTests();
  }, [searchTestQuery]);

  // Fetch settings and labs when the component mounts or modal is opened.
  useEffect(() => {
    getSettings();
  }, []);

  useEffect(() => {
    if (isOpen) {
      getLabs();
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
      id: patient._id,
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
        id: "",
      }));
    }
  };

  // Reset fields when the modal closes.
  useEffect(() => {
    if (!isOpen) {
      setSearchMRN("");
      setSearchResults([]);
      setSelectedPatientInfo(null);
      setSearchTestQuery("");
      setTestSearchResults([]);
      setPayload({ department: "", testNames: "", id: "" });
      setTestNames([]);
    }
  }, [isOpen]);

  // Form is complete if a department, a patient, and at least one test are selected.
  const isFormComplete =
    Payload.department && Payload.id && TestNames.length > 0 && Payload.testNames;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      {Loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Preloader />
        </Box>
      ) : (
        <ModalContent maxW={{ base: "90%", md: "50%" }}>
          <ModalHeader> Request Lab Order </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Department (Lab) Selection Dropdown – this is the first input */}
            <Box mb={4}>
              <Select
                onChange={handlePayload}
                placeholder="Select Lab"
                border="2px solid"
                id="department"
                value={Payload.department}
                size="lg"
                fontSize={Payload.department !== "" ? "16px" : "13px"}
                borderColor="gray.500"
              >
                {labs.map((item, i) => (
                  <option key={i} value={item.clinic}>
                    {item.clinic}
                  </option>
                ))}
              </Select>
            </Box>

            {/* Patient Search Section */}
            <Box mt="32px">
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

              {/* Test Search Section */}
              <Box mt={4}>
                <Input
                  label="Search for Test"
                  placeholder="Enter test name"
                  value={searchTestQuery}
                  onChange={(e) => setSearchTestQuery(e.target.value)}
                  leftIcon={<FiSearch size={16} color="blue.500" />}
                />
              </Box>
              <Select
                onChange={handlePayload}
                placeholder={isLoadingTests ? "Loading tests..." : "Select Test"}
                border="2px solid"
                id="testNames"
                value={Payload.testNames}
                size="lg"
                fontSize={Payload.testNames !== "" ? "16px" : "13px"}
                borderColor="gray.500"
                mt={4}
                isDisabled={isLoadingTests}
              >
                {searchTestQuery.trim() === ""
                  ? Settings?.testnames?.map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))
                  : testSearchResults.map((item) => (
                      <option key={item._id} value={item.servicetype}>
                        {item.servicetype}
                      </option>
                    ))}
              </Select>
            </Box>
            <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>
              {TestNames?.map((item, i) => (
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
                  <Box fontSize="20px" color="#fff" onClick={() => removeTestName(item)}>
                    <IoIosCloseCircle />
                  </Box>
                </Flex>
              ))}
            </SimpleGrid>
            <Button
              mt="32px"
              onClick={RequestLabOrder}
              isLoading={Loading}
              disabled={!isFormComplete}
            >
              Request
            </Button>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
}
