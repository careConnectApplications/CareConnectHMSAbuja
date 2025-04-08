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
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import { IoIosCloseCircle } from "react-icons/io";
import { SlPlus } from "react-icons/sl";
import { MdNote } from "react-icons/md";
import { FiSearch } from "react-icons/fi"; // Importing the search icon
import {
  CreateRadiologyOrderApi,
  UpdateRadiologyApi,
  SettingsApi,
  SearchPatientApi,
} from "../Utils/ApiCalls";
import Preloader from "./Preloader";

export default function SingleRadiologyModal({
  isOpen,
  onClose,
  onSuccess,
  // Mode can be "create" or "edit"
  type = "create",
  initialData,
}) {
  const [note, setNote] = useState("");
  const [testNames, setTestNames] = useState([]);
  const [testNameInput, setTestNameInput] = useState("");
  const [availableTests, setAvailableTests] = useState([]);
  // Remove pre-loading all patients – rely on search results only
  const [availablePatients, setAvailablePatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [searchMRN, setSearchMRN] = useState("");
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Utility to show toast notifications
  const showToastFn = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  // Pre-populate the form when editing/viewing
  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen, type, initialData]);

  // Fetch available radiology tests from the settings endpoint
  useEffect(() => {
    if (isOpen) {
      const fetchAvailableTests = async () => {
        try {
          const result = await SettingsApi();
          const radiologyCategory = result?.servicecategory?.find(
            (item) => item.category.toLowerCase() === "radiology"
          );
          if (radiologyCategory && Array.isArray(radiologyCategory.type)) {
            setAvailableTests(radiologyCategory.type);
          }
        } catch (error) {
          console.error("Error fetching settings:", error);
        }
      };
      fetchAvailableTests();
    }
  }, [isOpen]);

  // Clear search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchMRN("");
    }
  }, [isOpen]);

  // Handler to add a test name from the dropdown
  const addTestName = () => {
    if (testNameInput.trim() !== "") {
      setTestNames([...testNames, testNameInput.trim()]);
      setTestNameInput("");
    }
  };

  // Handler to remove a test name
  const removeTestName = (name) => {
    setTestNames(testNames.filter((t) => t !== name));
  };

  // Handler for searching a patient using MRN (or first/last name)
  const handleSearchPatient = async () => {
    setIsLoadingPatients(true);
    try {
      const results = await SearchPatientApi(searchMRN);
      if (results?.queryresult?.patientdetails) {
        // Update availablePatients with search results
        setAvailablePatients(results.queryresult.patientdetails);
      } else {
        setAvailablePatients([]);
      }
    } catch (error) {
      console.error("Error searching patient:", error.message);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPatientId) {
      showToastFn({
        status: "error",
        message: "Please select a patient.",
      });
      return;
    }
    if (testNames.length === 0) {
      showToastFn({
        status: "error",
        message: "At least one test name is required.",
      });
      return;
    }
    if (!note.trim()) {
      showToastFn({ status: "error", message: "Note field is required." });
      return;
    }
    setLoading(true);

    const payload = {
      testname: testNames,
      note: note.trim(),
    };

    try {
      if (type === "edit" && initialData) {
        const requestOrderId = initialData.id || initialData._id;
        await UpdateRadiologyApi(payload, requestOrderId);
      } else {
        await CreateRadiologyOrderApi(payload, selectedPatientId);
      }
      const successMessage =
        type === "edit"
          ? "Radiology order updated successfully!"
          : "Radiology order created successfully!";
      showToastFn({ status: "success", message: successMessage });
      if (onSuccess) onSuccess(successMessage, "success");
      onClose();
      setNote("");
      setTestNames([]);
      setTestNameInput("");
      setSelectedPatientId("");
    } catch (error) {
      showToastFn({
        status: "error",
        message: `Failed to ${type === "edit" ? "update" : "create"} radiology order: ${error.message}`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

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
              {/* Patient Selection with Search */}
              <Flex mb={2} gap={4}>
                <Input
                  label="Search for Patient"
                  placeholder="Enter MRN, first name, or last name"
                  value={searchMRN}
                  onChange={(e) => setSearchMRN(e.target.value)}
                  leftIcon={<FiSearch size={16} color="blue.500" />}
                  flex="1"
                />
                <Button
                  onClick={handleSearchPatient}
                  w={["100%", "100%", "165px", "205px"]}
                >
                  Search
                </Button>
              </Flex>
              <Select
                placeholder={isLoadingPatients ? "Loading patients..." : "Select Patient"}
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                variant="outline"
                borderColor="gray.300"
                _hover={{ borderColor: "blue.400" }}
                isDisabled={isLoadingPatients}
              >
                {availablePatients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName} - {patient.MRN}
                  </option>
                ))}
              </Select>

              {/* Test Name Selection */}
              <Box>
                <Flex direction={{ base: "column", md: "row" }} alignItems="center" mb={2}>
                  <Box flex="1" mr={{ base: 0, md: 2 }}>
                    <Select
                      placeholder={availableTests.length > 0 ? "Select test name" : "Loading tests..."}
                      value={testNameInput}
                      onChange={(e) => setTestNameInput(e.target.value)}
                      variant="outline"
                      borderColor="gray.300"
                      _hover={{ borderColor: "blue.400" }}
                    >
                      {availableTests.map((test, index) => (
                        <option key={index} value={test}>
                          {test}
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
              </Box>
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
              disabled={loading || !selectedPatientId || testNames.length === 0 || !note.trim()}
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
