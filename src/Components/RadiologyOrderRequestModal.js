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
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import { IoIosCloseCircle } from "react-icons/io";
import { SlPlus } from "react-icons/sl";
import { MdNote, MdPlaylistAdd } from "react-icons/md";
import {
  CreateRadiologyOrderApi,
  UpdateRadiologyApi,
  SettingsApi,
} from "../Utils/ApiCalls";

export default function RadiologyOrderRequestModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,
  // Mode can be "create" or "edit"
  type = "create",
  initialData,
  oldPayload
}) {
  const [note, setNote] = useState("");
  const [testNames, setTestNames] = useState([]);
  // This state will hold the currently selected test from the dropdown.
  const [testNameInput, setTestNameInput] = useState("");
  // Available test names loaded from the settings endpoint (for Radiology)
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Utility to show toast notifications
  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  // Pre-populate the form when editing/viewing
  useEffect(() => {
    if (isOpen) {
      if ((type === "edit" || type === "view") && initialData) {
        setNote(initialData.note || "");
        // Ensure testname is always stored as an array.
        setTestNames(
          Array.isArray(initialData.testname)
            ? initialData.testname
            : initialData.testname
            ? [initialData.testname]
            : []
        );
      } else {
        setNote("");
        setTestNames([]);
        setTestNameInput("");
      }
    }
  }, [isOpen, type, initialData]);

  // Fetch available radiology tests from the settings endpoint
  useEffect(() => {
    if (isOpen) {
      const fetchAvailableTests = async () => {
        try {
          const result = await SettingsApi();
          // Look for the service category with category "Radiology"
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

  const handleSubmit = async () => {
    // Basic validation: require at least one test name and a note.
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

    // Always send testname as an array
    const payload = {
      testname: testNames,
      note: note.trim(),
      appointmentid: oldPayload.id
    };

    try {
      if (type === "edit" && initialData) {
        const requestOrderId = initialData.id || initialData._id;
        await UpdateRadiologyApi(payload, requestOrderId);
      } else {
        // Retrieve patientId from local storage for creating a new order.
        const patientId = localStorage.getItem("patientId");
        await CreateRadiologyOrderApi(payload, patientId);
      }
      const successMessage = 
        type === "edit"
          ? "Radiology order updated successfully!"
          : "Radiology order created successfully!";
      showToast({ status: "success", message: successMessage });
      if (onSuccess) onSuccess(successMessage, "success");
      onClose();

      // Reset form state.
      setNote("");
      setTestNames([]);
      setTestNameInput("");
    } catch (error) {
      showToast({
        status: "error",
        message: `Failed to ${
          type === "edit" ? "update" : "create"
        } radiology order: ${error.message}`,
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
        <ModalContent maxW={["90%", "600px"]}>
          <ModalHeader fontSize={["lg", "xl"]}>
            {type === "edit"
              ? "Edit Radiology Order Request"
              : "Create Radiology Order Request"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={["10px", "15px"]}>
              <Box>
                {/* Dropdown for selecting a test name from available tests */}
                <Flex
                  direction={{ base: "column", md: "row" }}
                  alignItems={{ base: "stretch", md: "center" }}
                  mb={{ base: "10px", md: "15px" }}
                >
                  <Box flex="1" mr={{ base: 0, md: "2" }}>
                    <Select
                      placeholder={
                        availableTests.length > 0
                          ? "Select test name"
                          : "Loading tests..."
                      }
                      value={testNameInput}
                      onChange={(e) => setTestNameInput(e.target.value)}
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
                    w={{ base: "auto", md: "150px" }}
                    onClick={addTestName}
                    rightIcon={<SlPlus />}
                    size="sm"
                    disabled={!testNameInput}
                  >
                    Add
                  </Button>
                </Flex>
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
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
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
              </Box>
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter note"
                label="Note"
                leftIcon={<MdNote color="blue.500" />}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              disabled={loading || testNames.length === 0 || !note.trim()}
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
