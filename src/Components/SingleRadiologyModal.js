import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Box,
  SimpleGrid,
  Text,
  Flex,
  Stack,
  Select,
  HStack,
  Badge,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import { IoIosCloseCircle } from "react-icons/io";
import { SlPlus } from "react-icons/sl";
import { MdNote } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import {
  CreateRadiologyOrderApi,
  UpdateRadiologyApi,
  SettingsApi,
  SearchPatientApi,
  SearchRadiologyApi,
} from "../Utils/ApiCalls";

export default function SingleRadiologyModal({
  isOpen,
  onClose,
  onSuccess,
  type = "create", 
  initialData,
}) {

  const [note, setNote] = useState("");
  const [testNames, setTestNames] = useState([]);
  const [testNameInput, setTestNameInput] = useState("");
  const [availableTests, setAvailableTests] = useState([]);

  const [availablePatients, setAvailablePatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedPatientInfo, setSelectedPatientInfo] = useState(null);
  const [searchMRN, setSearchMRN] = useState("");
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  const [searchTestQuery, setSearchTestQuery] = useState("");
  const [testSearchResults, setTestSearchResults] = useState([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);


  const showToastFn = ({ status, message }) => {
    setToast({ status, message });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (!isOpen) return;

    if ((type === "edit" || type === "view") && initialData) {
      setNote(initialData.note || "");
      setTestNames(
        Array.isArray(initialData.testname)
          ? initialData.testname
          : initialData.testname
          ? [initialData.testname]
          : []
      );
      setSelectedPatientId(initialData.patientId || "");
    } else {
      setNote("");
      setTestNames([]);
      setTestNameInput("");
      setSelectedPatientId("");
    }
  }, [isOpen, type, initialData]);


  useEffect(() => {
    if (!isOpen) return;
    const fetchAvailableTests = async () => {
      try {
        const res = await SettingsApi();
        const radiologyCat = res?.servicecategory?.find(
          (c) => c.category.toLowerCase() === "radiology"
        );
        if (radiologyCat?.type) setAvailableTests(radiologyCat.type);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchAvailableTests();
  }, [isOpen]);

  const handleSearchPatient = async () => {
    if (!searchMRN.trim()) return;
    setIsLoadingPatients(true);
    try {
      const res = await SearchPatientApi(searchMRN.trim());
      setAvailablePatients(res?.queryresult?.patientdetails || []);
    } catch (err) {
      console.error("Error searching patient:", err.message);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      if (!searchTestQuery.trim()) {
        setTestSearchResults([]);
        return;
      }
      setIsLoadingTests(true);
      try {
        const res = await SearchRadiologyApi(searchTestQuery.trim());
        setTestSearchResults(res?.queryresult || []);
      } catch (err) {
        console.error("Error searching radiology:", err.message);
        setTestSearchResults([]);
      } finally {
        setIsLoadingTests(false);
      }
    };
    fetchTests();
  }, [searchTestQuery]);

  // Auto-search functionality with debouncing for patients
  useEffect(() => {
    const searchPatients = async (searchTerm) => {
      if (!searchTerm || searchTerm.trim().length < 2) {
        setAvailablePatients([]);
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
          setAvailablePatients(results.queryresult.patientdetails);
        } else {
          setAvailablePatients([]);
        }
      } catch (e) {
        console.error("Error searching patient:", e.message);
        setAvailablePatients([]);
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
    setSelectedPatientId(patient._id);
    setSelectedPatientInfo({
      name: `${patient.firstName} ${patient.lastName}`,
      mrn: patient.MRN,
    });
    setAvailablePatients([]); // Clear search results
    setSearchMRN(`${patient.firstName} ${patient.lastName} (MRN: ${patient.MRN})`);
  };

  // Handle search input change and clear selection if user starts typing new search
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchMRN(value);
    
    // Clear selected patient if user modifies the search significantly
    if (selectedPatientInfo && !value.includes(selectedPatientInfo.mrn)) {
      setSelectedPatientInfo(null);
      setSelectedPatientId("");
    }
  };

  useEffect(() => {
    if (isOpen) return;
    setSearchMRN("");
    setSearchTestQuery("");
    setTestSearchResults([]);
    setSelectedPatientId("");        
    setAvailablePatients([]);
    setSelectedPatientInfo(null);        
  }, [isOpen]);

  const addTestName = () => {
    if (!testNameInput.trim()) return;
    setTestNames([...testNames, testNameInput.trim()]);
    setTestNameInput("");
  };
  const removeTestName = (name) =>
    setTestNames(testNames.filter((t) => t !== name));


  const handleSubmit = async () => {
    if (!selectedPatientId) {
      return showToastFn({
        status: "error",
        message: "Please select a patient.",
      });
    }
    if (testNames.length === 0) {
      return showToastFn({
        status: "error",
        message: "At least one test name is required.",
      });
    }

    setLoading(true);
    const payload = {
      testname: testNames,
      note: note.trim(), 
    };

    try {
      if (type === "edit" && initialData) {
        const id = initialData.id || initialData._id;
        await UpdateRadiologyApi(payload, id);
      } else {
        await CreateRadiologyOrderApi(payload, selectedPatientId);
      }
      const msg =
        type === "edit"
          ? "Radiology order updated successfully!"
          : "Radiology order created successfully!";
      showToastFn({ status: "success", message: msg });
      if (onSuccess) onSuccess(msg, "success");
      onClose();
    } catch (err) {
      showToastFn({
        status: "error",
        message: `Failed to ${
          type === "edit" ? "update" : "create"
        } radiology order: ${err.message}`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    loading || !selectedPatientId || testNames.length === 0;

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent maxW={["90%", "600px"]} borderRadius="md" boxShadow="lg">
          <ModalHeader
            fontSize={["lg", "xl"]}
            borderBottom="1px"
            borderColor="gray.200"
          >
            {type === "edit"
              ? "Edit Radiology Order Request"
              : "Create Radiology Order Request"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <Stack spacing={4}>
              {/* -------- Patient search & select -------- */}
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
                {availablePatients.length > 0 && !selectedPatientInfo && (
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
                    {availablePatients.map((patient) => (
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

              {/* -------- Test search & select -------- */}
              <Input
                label="Search for Test"
                placeholder="Enter test name"
                value={searchTestQuery}
                onChange={(e) => setSearchTestQuery(e.target.value)}
                leftIcon={<FiSearch size={16} color="blue.500" />}
              />

              <Flex
                direction={{ base: "column", md: "row" }}
                alignItems="center"
              >
                <Box flex="1" mr={{ base: 0, md: 2 }} mt={2}>
                  <Select
                    placeholder={
                      isLoadingTests ? "Loading tests..." : "Select test name"
                    }
                    value={testNameInput}
                    onChange={(e) => setTestNameInput(e.target.value)}
                    variant="outline"
                    borderColor="gray.300"
                    _hover={{ borderColor: "blue.400" }}
                    isDisabled={isLoadingTests}
                  >
                    {(searchTestQuery.trim()
                      ? testSearchResults
                      : availableTests
                    ).map((t, idx) => (
                      <option
                        key={searchTestQuery.trim() ? t._id : idx}
                        value={searchTestQuery.trim() ? t.servicetype : t}
                      >
                        {searchTestQuery.trim() ? t.servicetype : t}
                      </option>
                    ))}
                  </Select>
                </Box>

                <Button
                  mt={{ base: 2, md: 0 }}
                  w={{ base: "100%", md: "150px" }}
                  onClick={addTestName}
                  rightIcon={<SlPlus />}
                  size="sm"
                  disabled={!testNameInput}
                >
                  Add Test
                </Button>
              </Flex>


              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
                {testNames.map((item, idx) => (
                  <Flex
                    key={idx}
                    cursor="pointer"
                    px="10px"
                    py="10px"
                    rounded="full"
                    bg="blue.blue500"
                    color="white"
                    fontSize="sm"
                    _hover={{ bg: "blue.blue400" }}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text fontWeight="medium" textTransform="capitalize">
                      {item}
                    </Text>
                    <Box fontSize="lg" onClick={() => removeTestName(item)}>
                      <IoIosCloseCircle />
                    </Box>
                  </Flex>
                ))}
              </SimpleGrid>

              {/* -------- Optional note -------- */}
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter note (optional)"
                label="Note (optional)"
                leftIcon={<MdNote color="blue.500" />}
              />
            </Stack>
          </ModalBody>

          <ModalFooter borderTop="1px" borderColor="gray.200">
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              isLoading={loading}
            >
              {type === "edit" ? "Update" : "Submit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
