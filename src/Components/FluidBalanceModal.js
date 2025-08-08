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
} from "@chakra-ui/react";
import Button from "./Button";
import Input from "./Input";
import ShowToast from "./ToastNotification";
import {
  CreateFluidBalanceApi,
  UpdateFluidBalanceApi,
} from "../Utils/ApiCalls";

import { AiOutlineCalendar } from "react-icons/ai";
import { GiWaterDrop } from "react-icons/gi";
import { FaHashtag, FaSyringe } from "react-icons/fa";

export default function FluidBalanceModal({
  isOpen,
  onClose,
  admissionId,
  patientId,
  onSuccess,
  type = "create",
  initialData,
}) {

  const initialFormState = {
    patientId: patientId,
    inputamount: "",
    outputamount: "",
  };

  const [formData, setFormData] = useState(initialFormState); 
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  const handleInputChange = ({ target: { name, value } }) =>
    setFormData((p) => ({ ...p, [name]: value }));

  // Calculate fluid balance
  const fluidBalance = () => {
    const input = parseFloat(formData.inputamount) || 0;
    const output = parseFloat(formData.outputamount) || 0;
    return input - output;
  };


  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && initialData) {
        setFormData({
          datetime: initialData.datetime || "",
          inputamount: initialData.inputamount || "",
          outputamount: initialData.outputamount || "",
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, type, initialData]);

 
  const handleSubmit = async () => {
    // Only require inputamount and outputamount, datetime is optional
    if (!formData.inputamount || !formData.outputamount) {
      showToast({ status: "error", message: "Input amount and output amount are required." });
      return;
    }
    
    setLoading(true);
    try {
      // Create the simplified payload structure
      const payload = {
        inputamount: formData.inputamount,
        outputamount: formData.outputamount,
        ...(formData.datetime && { datetime: formData.datetime }) // Only include datetime if provided
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
      setFormData(initialFormState);
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

  // Updated validation - only require input and output amounts
  const isFormComplete = formData.inputamount && formData.outputamount;

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

           
            

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
              {/* Input Amount */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={GiWaterDrop} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Input Amount (ml)"
                    type="number"
                    name="inputamount"
                    value={formData.inputamount}
                    onChange={handleInputChange}
                    placeholder="Enter input amount (ml)"
                  />
                </InputGroup>
              </FormControl>

              {/* Output Amount */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaHashtag} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Output Amount (ml)"
                    type="number"
                    name="outputamount"
                    value={formData.outputamount}
                    onChange={handleInputChange}
                    placeholder="Enter output amount (ml)"
                  />
                </InputGroup>
              </FormControl>
            </SimpleGrid>

            <Divider my={4} />

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
                  value={`${fluidBalance()} ml`}
                  readOnly
                  bg="gray.50"
                  color={fluidBalance() >= 0 ? "green.600" : "red.600"}
                  fontWeight="bold"
                />
              </InputGroup>
            </FormControl>

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
