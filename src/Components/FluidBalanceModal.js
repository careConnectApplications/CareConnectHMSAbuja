import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  SimpleGrid,
  Divider,
  Text,
  InputGroup,
  InputLeftElement,
  Icon,
  Box,
  Flex,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import Button from "./Button";
import Input from "./Input";
import TextArea from "./TextArea";
import DatePicker from "./DatePicker";
import ShowToast from "./ToastNotification";
import {
  CreateFluidBalanceApi,
  UpdateFluidBalanceApi,
} from "../Utils/ApiCalls";

import { AiOutlineCalendar } from "react-icons/ai";
import { GiWaterDrop } from "react-icons/gi";
import { FaHashtag, FaSyringe, FaPlus, FaTrash } from "react-icons/fa";

export default function FluidBalanceModal({
  isOpen,
  onClose,
  admissionId,
  patientId,
  onSuccess,
  type = "create",
  initialData,
}) {

  const initialRecordState = {
    inputamount: "",
    outputamount: "",
    intaketype: "",
    intakeroute: "",
    outputtype: "",
    outputroute: "",
    observationalNotes: "",
    dateFrom: "",
    dateTo: "",
  };

  const [fluidRecords, setFluidRecords] = useState([initialRecordState]); 
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  const handleInputChange = (index, { target: { name, value } }) => {
    setFluidRecords((prev) => 
      prev.map((record, i) => 
        i === index ? { ...record, [name]: value } : record
      )
    );
  };

  // Calculate fluid balance for a specific record
  const calculateBalance = (record) => {
    const input = parseFloat(record.inputamount) || 0;
    const output = parseFloat(record.outputamount) || 0;
    return input - output;
  };

  // Add new fluid record
  const addFluidRecord = () => {
    setFluidRecords((prev) => [...prev, { ...initialRecordState }]);
  };

  // Remove fluid record
  const removeFluidRecord = (index) => {
    if (fluidRecords.length > 1) {
      setFluidRecords((prev) => prev.filter((_, i) => i !== index));
    }
  };


  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && initialData) {
        // If editing, set up records from initial data
        const records = initialData.fluidRecords || [initialData];
        setFluidRecords(records.map(record => ({
          inputamount: record.inputamount || "",
          outputamount: record.outputamount || "",
          intaketype: record.intaketype || "Oral",
          intakeroute: record.intakeroute || "Mouth",
          outputtype: record.outputtype || "Urine",
          outputroute: record.outputroute || "Catheter",
          observationalNotes: record.observationalNotes || "",
          dateFrom: record.dateFrom || "",
          dateTo: record.dateTo || "",
        })));
      } else {
        setFluidRecords([{ ...initialRecordState }]);
      }
    }
  }, [isOpen, type, initialData]);

 
  const handleSubmit = async () => {
    // Validate all records
    const invalidRecords = fluidRecords.some(record => 
      !record.inputamount || !record.outputamount
    );
    
    if (invalidRecords) {
      showToast({ 
        status: "error", 
        message: "Input amount and output amount are required for all records." 
      });
      return;
    }
    
    setLoading(true);
    try {
      // Create the payload structure with fluidRecords array
      const payload = {
        patientId: patientId,
        fluidRecords: fluidRecords.map(record => ({
          inputamount: parseFloat(record.inputamount),
          outputamount: parseFloat(record.outputamount),
          balance: calculateBalance(record),
          intaketype: record.intaketype,
          intakeroute: record.intakeroute,
          outputtype: record.outputtype,
          outputroute: record.outputroute,
          observationalNotes: record.observationalNotes,
          dateFrom: record.dateFrom,
          dateTo: record.dateTo,
        })),
      };
      
      if (type === "edit") {
        await UpdateFluidBalanceApi(
          payload,
          initialData._id || initialData.id
        );
        showToast({
          status: "success",
          message: "Fluid balance updated successfully!",
        });
      } else {
        await CreateFluidBalanceApi(payload, admissionId);
        showToast({
          status: "success",
          message: "Fluid balance created successfully!",
        });
      }
      onSuccess?.();
      onClose();
      setFluidRecords([{ ...initialRecordState }]);
    } catch (e) {
      showToast({
        status: "error",
        message: `Failed to ${
          type === "edit" ? "update" : "create"
        } fluid balance: ${e.message}`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Updated validation - require input and output amounts for all records
  const isFormComplete = fluidRecords.every(record => 
    record.inputamount && record.outputamount
  );

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
        size="lg"
      >
        <ModalOverlay />
        <ModalContent maxW={{ base: "95%", md: "80%" }}>
          <ModalHeader>
            {type === "edit" ? "Edit Fluid Balance" : "Create Fluid Balance"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} mt={2}>
            {/* Add Button */}
            <Flex justify="flex-end" mb={4}>
              <Button
                leftIcon={<FaPlus />}
                w="200px"
                onClick={addFluidRecord}
              >
                Add Fluid Record
              </Button>
            </Flex>

            <VStack spacing={6} align="stretch">
              {fluidRecords.map((record, index) => (
                <Box key={index} border="1px" borderColor="gray.200" borderRadius="md" p={4}>
                  {/* Record Header */}
                  <Flex justify="space-between" align="center" mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.500">
                      Fluid Record {index + 1}
                    </Text>
                    {fluidRecords.length > 1 && (
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFluidRecord(index)}
                        aria-label="Remove record"
                      />
                    )}
                  </Flex>

                  {/* Input/Output Amounts */}
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                    <FormControl>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={GiWaterDrop} color="gray.300" />
                        </InputLeftElement>
                        <Input
                          label="Input Amount (ml)"
                          type="number"
                          name="inputamount"
                          value={record.inputamount}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Enter input amount (ml)"
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FaHashtag} color="gray.300" />
                        </InputLeftElement>
                        <Input
                          label="Output Amount (ml)"
                          type="number"
                          name="outputamount"
                          value={record.outputamount}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Enter output amount (ml)"
                        />
                      </InputGroup>
                    </FormControl>
                  </SimpleGrid>

                  {/* Intake Details */}
                  <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
                    Intake Details
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                    <FormControl>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FaSyringe} color="gray.300" />
                        </InputLeftElement>
                        <Input
                          label="Intake Type"
                          type="text"
                          name="intaketype"
                          value={record.intaketype}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Enter intake type"
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={GiWaterDrop} color="gray.300" />
                        </InputLeftElement>
                        <Input
                          label="Intake Route"
                          type="text"
                          name="intakeroute"
                          value={record.intakeroute}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Enter intake route"
                        />
                      </InputGroup>
                    </FormControl>
                  </SimpleGrid>

                  {/* Output Details */}
                  <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
                    Output Details
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                    <FormControl>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FaHashtag} color="gray.300" />
                        </InputLeftElement>
                        <Input
                          label="Output Type"
                          type="text"
                          name="outputtype"
                          value={record.outputtype}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Enter output type"
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FaSyringe} color="gray.300" />
                        </InputLeftElement>
                        <Input
                          label="Output Route"
                          type="text"
                          name="outputroute"
                          value={record.outputroute}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Enter output route"
                        />
                      </InputGroup>
                    </FormControl>
                  </SimpleGrid>

                  {/* Date Range */}
                  <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
                    Date Range
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                    <FormControl>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={AiOutlineCalendar} color="gray.300" />
                        </InputLeftElement>
                        <Input
                          type="datetime-local"
                          label="Date From"
                          name="dateFrom"
                          value={record.dateFrom}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Select start date"
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={AiOutlineCalendar} color="gray.300" />
                        </InputLeftElement>
                        <Input
                         type="datetime-local"
                          label="Date To"
                          name="dateTo"
                          value={record.dateTo}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Select end date"
                        />
                      </InputGroup>
                    </FormControl>
                  </SimpleGrid>

                  {/* Observational Notes */}
               

                  {/* Fluid Balance Calculation */}
                  <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
                    Fluid Balance
                  </Text>
                  <FormControl>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FaHashtag} color="gray.300" />
                      </InputLeftElement>
                      <Input
                        label="Fluid Balance (ml)"
                        type="text"
                        value={`${calculateBalance(record)} ml`}
                        readOnly
                        bg="gray.50"
                        color={calculateBalance(record) >= 0 ? "green.600" : "red.600"}
                        fontWeight="bold"
                      />
                    </InputGroup>
                  </FormControl>

                     <FormControl mb={4} mt="10">
                    <TextArea
                      label="Observational Notes"
                      name="observationalNotes"
                      value={record.observationalNotes}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Enter observational notes"
                      rows={3}
                    />
                  </FormControl>
                </Box>
              ))}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              disabled={!isFormComplete || loading}
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
