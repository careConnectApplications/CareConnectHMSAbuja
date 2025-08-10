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
  Select,
  Stack,
  HStack,
  Badge,
  Textarea,
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
  SearchRadiologyApi,
  GetPriceOfService,
} from "../Utils/ApiCalls";

export default function RadiologyOrderRequestModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,
  type = "create",
  initialData,
  oldPayload = {},
}) {
  const patientId = localStorage.getItem("patientId");
  const [note, setNote] = useState("");
  const [testNames, setTestNames] = useState([]);
  const [testNameInput, setTestNameInput] = useState("");
  const [availableTests, setAvailableTests] = useState([]);
  const [testPrices, setTestPrices] = useState({});

  const [searchTestQuery, setSearchTestQuery] = useState("");
  const [testSearchResults, setTestSearchResults] = useState([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  const [selectedTestInfo, setSelectedTestInfo] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch prices when testNames changes
  useEffect(() => {
    const fetchTestPrices = async () => {
      if (testNames.length === 0) {
        setTestPrices({});
        return;
      }

      const newPrices = { ...testPrices };
      let hasChanges = false;

      // Fetch prices for newly added tests that don't have prices yet
      for (const test of testNames) {
        if (!newPrices[test]) {
          try {
            const response = await GetPriceOfService(
              { servicetype: test },
              patientId
            );
            newPrices[test] = response.data?.price || "N/A";
            hasChanges = true;
          } catch (error) {
            console.error(`Error fetching price for ${test}:`, error);
            newPrices[test] = "N/A";
            hasChanges = true;
          }
        }
      }

      // Remove prices for tests that are no longer in the list
      Object.keys(newPrices).forEach((test) => {
        if (!testNames.includes(test)) {
          delete newPrices[test];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setTestPrices(newPrices);
      }
    };

    fetchTestPrices();
  }, [testNames]);

  // Calculate total price
  const totalPrice = Object.values(testPrices).reduce((sum, price) => {
    if (typeof price === "number") return sum + price;
    return sum;
  }, 0);

  const showToast = ({ status, message }) => {
    setToast({ status, message });
    setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    if (!isOpen) return;

    if ((type === "edit" || type === "view") && initialData) {
      setNote(initialData.note || "");
      const tests = Array.isArray(initialData.testname)
        ? initialData.testname
        : initialData.testname
        ? [initialData.testname]
        : [];
      setTestNames(tests);

      // Initialize prices if available in initialData
      if (initialData.testPrices) {
        setTestPrices(initialData.testPrices);
      }
    } else {
      setNote("");
      setTestNames([]);
      setTestNameInput("");
      setSearchTestQuery("");
      setTestSearchResults([]);
      setSelectedTestInfo(null);
      setShowSearchResults(false);
      setTestPrices({});
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

  // Enhanced search with debouncing to improve performance
  useEffect(() => {
    const searchTests = async (query) => {
      if (!query || query.trim().length < 2) {
        setTestSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      try {
        setIsLoadingTests(true);
        setShowSearchResults(true);
        const res = await SearchRadiologyApi(query.trim());
        if (res?.queryresult) {
          setTestSearchResults(res.queryresult);
        } else {
          setTestSearchResults([]);
        }
      } catch (err) {
        console.error("Error searching radiology:", err.message);
        setTestSearchResults([]);
        showToast({
          status: "error",
          message: "Search failed. Please try again.",
        });
      } finally {
        setIsLoadingTests(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchTests(searchTestQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTestQuery]);

  // Handle test selection from search results
  const handleTestSelect = (test) => {
    const testName = test.servicetype || test;
    if (!testNames.includes(testName)) {
      setTestNames([...testNames, testName]);
    }
    setSelectedTestInfo({ name: testName, id: test._id || null });
    setSearchTestQuery("");
    setTestSearchResults([]);
    setShowSearchResults(false);
    setTestNameInput("");
  };

  const addTestName = () => {
    if (!testNameInput.trim()) return;
    if (!testNames.includes(testNameInput.trim())) {
      setTestNames([...testNames, testNameInput.trim()]);
    }
    setTestNameInput("");
  };

  const removeTestName = (name) => {
    setTestNames(testNames.filter((t) => t !== name));
    // Remove the price entry when test is removed
    setTestPrices((prev) => {
      const newPrices = { ...prev };
      delete newPrices[name];
      return newPrices;
    });
  };

  const handleSubmit = async () => {
    if (testNames.length === 0) {
      showToast({
        status: "error",
        message: "At least one test name is required.",
      });
      return;
    }
    if (!note.trim()) {
      showToast({ status: "error", message: "Note field is required." });
      return;
    }

    setLoading(true);
    const payload = {
      testname: testNames,
      note: note.trim(),
      appointmentid: oldPayload?.id || oldPayload?._id || "",
      testPrices, // Include the test prices in the payload
      totalPrice: totalPrice,
    };

    try {
      if (type === "edit" && initialData) {
        const id = initialData.id || initialData._id;
        await UpdateRadiologyApi(payload, id);
      } else {
        await CreateRadiologyOrderApi(payload, patientId);
      }
      const msg =
        type === "edit"
          ? "Radiology order updated successfully!"
          : "Radiology order created successfully!";
      showToast({ status: "success", message: msg });
      if (onSuccess) onSuccess(msg, "success");
      onClose();
    } catch (err) {
      showToast({
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

  const isSubmitDisabled = loading || testNames.length === 0 || !note.trim();

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent maxW={["90%", "600px"]}>
          <ModalHeader fontSize={["lg", "xl"]}>
            {type === "edit"
              ? "Edit Radiology Order Request"
              : "Create Radiology Order Request"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <Stack spacing={["10px", "15px"]}>
              {/* -------- Enhanced Test Search Input -------- */}
              <Box position="relative" className="search-container">
                <Input
                  label="Search for Radiology Test"
                  placeholder="Enter test name (minimum 2 characters)"
                  value={searchTestQuery}
                  onChange={(e) => setSearchTestQuery(e.target.value)}
                  leftIcon={<FiSearch size={16} color="blue.500" />}
                />

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    right={0}
                    zIndex={1000}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    boxShadow="xl"
                    maxH="300px"
                    overflowY="auto"
                    mt={1}
                  >
                    {isLoadingTests ? (
                      <Box p={4}>
                        <Text color="gray.500" fontSize="sm" textAlign="center">
                          Searching tests...
                        </Text>
                      </Box>
                    ) : testSearchResults.length > 0 ? (
                      testSearchResults.map((test, index) => (
                        <Box
                          key={test._id || index}
                          p={4}
                          cursor="pointer"
                          _hover={{ bg: "blue.50", borderColor: "blue.200" }}
                          onClick={() => handleTestSelect(test)}
                          borderBottom="1px solid"
                          borderColor="gray.100"
                          _last={{ borderBottom: "none" }}
                          transition="all 0.2s"
                        >
                          <Text
                            fontWeight="medium"
                            fontSize="sm"
                            color="gray.800"
                          >
                            {test.servicetype}
                          </Text>
                          {test.price && (
                            <Text fontSize="xs" color="green.600" mt={1}>
                              Price: ₦{parseFloat(test.price).toFixed(2)}
                            </Text>
                          )}
                          {testNames.includes(test.servicetype) && (
                            <Badge colorScheme="green" size="sm" mt={1}>
                              Already Added
                            </Badge>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Box p={4}>
                        <Text color="gray.500" fontSize="sm" textAlign="center">
                          No tests found matching "{searchTestQuery}"
                        </Text>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>

              {/* -------- Fallback Test dropdown & add button -------- */}
              <Box>

                <Flex
                  direction={{ base: "column", md: "row" }}
                  alignItems={{ base: "stretch", md: "center" }}
                >
                  <Box flex="1" mr={{ base: 0, md: "2" }}>
                    <Select
                      placeholder="Select from available tests"
                      value={testNameInput}
                      onChange={(e) => setTestNameInput(e.target.value)}
                      bg="gray.50"
                      borderColor="gray.300"
                    >
                      {availableTests.map((test, idx) => (
                        <option key={idx} value={test}>
                          {test}
                        </option>
                      ))}
                    </Select>
                  </Box>

                  <Button
                    mt={{ base: 2, md: 0 }}
                    w={{ base: "auto", md: "120px" }}
                    onClick={addTestName}
                    rightIcon={<SlPlus />}
                    size="sm"
                    disabled={!testNameInput}
                    colorScheme="blue"
                  >
                    Add
                  </Button>
                </Flex>
              </Box>

              {/* -------- Selected Tests Display -------- */}
              {testNames.length > 0 && (
                <>
                  <Text mt="12px" fontSize="sm" fontWeight="bold">
                    Selected Tests:
                  </Text>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
                    {testNames.map((item, idx) => (
                      <Flex
                        key={idx}
                        cursor="pointer"
                        px="10px"
                        py="10px"
                        rounded="25px"
                        bg="blue.blue500"
                        color="white"
                        fontSize="13px"
                        _hover={{ bg: "blue.blue400" }}
                        w="100%"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Text
                            color="#fff"
                            fontWeight="500"
                            textTransform="capitalize"
                          >
                            {item}
                          </Text>
                          <Text fontSize="10px" color="#fff">
                            Price: {testPrices[item] || "Loading..."}
                          </Text>
                        </Box>
                        <Box
                          fontSize="20px"
                          color="#fff"
                          onClick={() => removeTestName(item)}
                        >
                          <IoIosCloseCircle />
                        </Box>
                      </Flex>
                    ))}
                  </SimpleGrid>

                  {/* -------- Total Price Display -------- */}
                  <Flex justifyContent="flex-end" mt="12px">
                    <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                      Total: ₦{totalPrice.toFixed(2)}
                    </Badge>
                  </Flex>
                </>
              )}

              {/* -------- Note -------- */}
              <Textarea
                placeholder="Enter notes for the radiology"
                border="2px solid"
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                size="lg"
                fontSize={note !== "" ? "16px" : "13px"}
                borderColor="gray.500"
                rows={3}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
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
