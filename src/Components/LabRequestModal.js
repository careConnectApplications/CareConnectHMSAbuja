import { HStack, Text, Badge } from "@chakra-ui/react";
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
  Textarea,
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import {
  SettingsApi,
  RequestLabOrderApi,
  GetAllClinicApi,
  GetPriceOfService,
} from "../Utils/ApiCalls";
import { IoIosCloseCircle } from "react-icons/io";
import { FaNoteSticky } from "react-icons/fa6";

export default function LabRequestModal({
  isOpen,
  onClose,
  type,
  activateNotifications,
  oldPayload,
  onSuccess,
}) {
  // Retrieve appointment and patient ids from local storage
  const patientId = localStorage.getItem("patientId");

  // Component state
  const [Loading, setLoading] = useState(false);
  const [Settings, setSettings] = useState({});
  const [TestNames, setTestNames] = useState([]);
  const [testPrices, setTestPrices] = useState({});

  // Priority options
  const priorityOptions = ["urgent", "routine"];

  // Expanded payload includes department (lab), testNames, priority, and notes
  const [Payload, setPayload] = useState({
    department: "",
    testNames: "",
    priority: "",
    notes: "",
  });

  // New state to store lab list
  const [labs, setLabs] = useState([]);

  const handleClose = () => {
    // Reset all form fields when closing
    setPayload({
      department: "",
      testNames: "",
      priority: "",
      notes: "",
    });
    setTestNames([]);
    setTestPrices({});
    onClose();
  };

  // Generic handler to update the payload.
  const handlePayload = (e) => {
    const { id, value } = e.target;
    setPayload({ ...Payload, [id]: value });

    if (id === "testNames") {
      if (value && !TestNames.includes(value)) {
        setTestNames([...TestNames, value]);
        // Clear the select input after selection
        setPayload((prev) => ({ ...prev, testNames: "" }));
      }
    }
  };

  // Fetch prices when testNames changes
  useEffect(() => {
    const fetchTestPrices = async () => {
      if (TestNames.length === 0) {
        setTestPrices({});
        return;
      }

      const newPrices = { ...testPrices };
      let hasChanges = false;

      // Fetch prices for newly added tests that don't have prices yet
      for (const test of TestNames) {
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
        if (!TestNames.includes(test)) {
          delete newPrices[test];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setTestPrices(newPrices);
      }
    };

    fetchTestPrices();
  }, [TestNames]);

  // Calculate total price
  const totalPrice = Object.values(testPrices).reduce((sum, price) => {
    if (typeof price === "number") return sum + price;
    return sum;
  }, 0);

  // Fetch settings (which includes test name lists, etc.)
  const getSettings = async () => {
    try {
      const result = await SettingsApi();
      setSettings(result);
    } catch (e) {
      console.error("Error fetching settings:", e);
    }
  };

  // Fetch lab details by calling GetAllClinicApi and filter for labs
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

  // Function to trigger lab order request
  const RequestLabOrder = async () => {
    setLoading(true);
    try {
      // Include priority and notes in the API call payload
      const result = await RequestLabOrderApi(
        {
          testname: TestNames,
          appointmentunderscoreid: oldPayload._id,
          department: Payload.department,
          priority: Payload.priority,
          notes: Payload.notes,
        },
        patientId
      );

      if (result.status === 200) {
        setLoading(false);
        handleClose();
        activateNotifications("Lab Order Requested Successfully", "success");
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
    }
  };

  // Remove a test from the selected list
  const removeTestName = (item) => {
    const updatedTestNames = TestNames.filter((test) => test !== item);
    setTestNames(updatedTestNames);
  };

  // Run on component mount: fetch settings and labs
  useEffect(() => {
    getSettings();
    getLabs();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "50%" }}>
        <ModalHeader> Lab Order For {oldPayload.appointmentid} </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <>
            {/* Lab selection drop down */}
            <SimpleGrid mt="12px" columns={{ base: 1, md: 1 }} spacing={5}>
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
            </SimpleGrid>

            {/* Priority selection */}
            <SimpleGrid mt="12px" columns={{ base: 1, md: 1 }} spacing={5}>
              <Select
                onChange={handlePayload}
                placeholder="Select Priority"
                border="2px solid"
                id="priority"
                value={Payload.priority}
                size="lg"
                fontSize={Payload.priority !== "" ? "16px" : "13px"}
                borderColor="gray.500"
              >
                {priorityOptions.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </SimpleGrid>

            {/* Test selection drop down */}
            <SimpleGrid mt="12px" columns={{ base: 1, md: 1 }} spacing={5}>
              <Select
                onChange={handlePayload}
                placeholder="Select Test Name"
                border="2px solid"
                id="testNames"
                value={Payload.testNames}
                size="lg"
                fontSize={Payload.testNames !== "" ? "16px" : "13px"}
                borderColor="gray.500"
              >
                {Settings?.testnames?.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </SimpleGrid>

            {/* Display the selected test names with prices */}
            {TestNames.length > 0 && (
              <>
                <Text mt="12px" fontSize="sm" fontWeight="bold">
                  Selected Tests:
                </Text>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>
                  {TestNames.map((item, i) => (
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

                {/* Display total price */}
                <Flex justifyContent="flex-end" mt="12px">
                  <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                    Total: {totalPrice.toFixed(2)}
                  </Badge>
                </Flex>
              </>
            )}

            {/* Notes field */}
            <SimpleGrid mt="12px" columns={{ base: 1, md: 1 }} spacing={5}>
              <Textarea
                placeholder="Enter notes for the lab"
                border="2px solid"
                id="notes"
                value={Payload.notes}
                onChange={handlePayload}
                size="lg"
                fontSize={Payload.notes !== "" ? "16px" : "13px"}
                borderColor="gray.500"
                rows={3}
              />
            </SimpleGrid>

            <Button mt="32px" onClick={RequestLabOrder} isLoading={Loading}>
              Request Lab Order
            </Button>
          </>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
