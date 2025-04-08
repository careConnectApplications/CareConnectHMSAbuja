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
  Box,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
  Icon,
  Select,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import { CreateBloodMonitoringApi, UpdateBloodMonitoringApi } from "../Utils/ApiCalls";
import { FaVial, FaTint } from "react-icons/fa";

export default function BloodMonitoringChartModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,
  type = "create",
  initialData,
}) {
  const initialFormState = {
    typeoftestRBSFBS: "",
    value: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && initialData) {
        setFormData({
          typeoftestRBSFBS: initialData.typeoftestRBSFBS || "",
          value: initialData.value || "",
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, type, initialData]);

  const handleSubmit = async () => {
    if (!formData.typeoftestRBSFBS || !formData.value) {
      showToast({
        status: "error",
        message: "Both test type and value are required.",
      });
      return;
    }
    setLoading(true);
    try {
      if (type === "edit") {
        await UpdateBloodMonitoringApi(formData, initialData.id);
      } else {
        await CreateBloodMonitoringApi(formData, admissionId);
      }
      showToast({
        status: "success",
        message:
          type === "edit"
            ? "Blood monitoring chart updated successfully!"
            : "Blood monitoring chart created successfully!",
      });
      if (onSuccess) onSuccess(formData);
      onClose();
      setFormData(initialFormState);
    } catch (error) {
      showToast({
        status: "error",
        message: `Failed to ${type === "edit" ? "update" : "create"} blood monitoring chart: ${error.message}`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = Object.values(formData).every((field) => field !== "");

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
        size="md"
      >
        <ModalOverlay />
        <ModalContent maxW={{ base: "95%", md: "600px" }}>
          <ModalHeader >
            {type === "edit" ? "Edit Blood Monitoring Chart" : "Create Blood Monitoring Chart"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} mt={2}>
            <Box mb={4}>
              <SimpleGrid columns={1} spacing={4}>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaVial} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      label="Type of Test (RBS/FBS)"
                      name="typeoftestRBSFBS"
                      value={formData.typeoftestRBSFBS}
                      onChange={handleInputChange}
                      placeholder="Enter test type"
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaTint} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      name="value"
                      label="Value"
                      value={formData.value}
                      onChange={handleInputChange}
                      placeholder="Enter value"
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            </Box>
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
