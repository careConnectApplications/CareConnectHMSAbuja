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
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import {
  CreateNursingCarePlanApi,
  UpdateNursingCarePlanApi,
} from "../Utils/ApiCalls";
import {
  FaNotesMedical,
  FaClipboardList,
  FaTasks,
  FaCheckCircle,
} from "react-icons/fa";

export default function NursingCarePlanModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,
  type = "create",
  initialData,
}) {
  const initialFormState = {
    nursingdiagnosis: "",
    objectives: "",
    actionintervention: "",
    evaluation: "",
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
          nursingdiagnosis: initialData.nursingdiagnosis
            ? initialData.nursingdiagnosis.join(", ")
            : "",
          objectives: initialData.objectives || "",
          actionintervention: initialData.actionintervention || "",
          evaluation: initialData.evaluation || "",
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, type, initialData]);

  const handleSubmit = async () => {
    // Check if all fields are filled
    if (
      !formData.nursingdiagnosis ||
      !formData.objectives ||
      !formData.actionintervention ||
      !formData.evaluation
    ) {
      showToast({
        status: "error",
        message: "All fields are required.",
      });
      return;
    }
    setLoading(true);
    try {
      // Prepare payload: convert comma-separated string to an array
      const payload = {
        nursingdiagnosis: formData.nursingdiagnosis
          .split(",")
          .map((diag) => diag.trim())
          .filter((diag) => diag !== ""),
        objectives: formData.objectives,
        actionintervention: formData.actionintervention,
        evaluation: formData.evaluation,
      };

      if (type === "edit") {
        // initialData.id contains the nursing care plan id
        await UpdateNursingCarePlanApi(payload, initialData._id);
        showToast({
          status: "success",
          message: "Nursing care plan updated successfully!",
        });
      } else {
        await CreateNursingCarePlanApi(payload, admissionId);
        showToast({
          status: "success",
          message: "Nursing care plan created successfully!",
        });
      }
      if (onSuccess) onSuccess(payload);
      onClose();
      setFormData(initialFormState);
    } catch (error) {
      showToast({
        status: "error",
        message: `Failed to ${type === "edit" ? "update" : "create"} nursing care plan: ${
          error.message
        }`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = Object.values(formData).every(
    (field) => field !== ""
  );

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
          <ModalHeader>
            {type === "edit"
              ? "Edit Nursing Care Plan"
              : "Create Nursing Care Plan"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} mt={2}>
            <Box mb={4}>
              <SimpleGrid columns={1} spacing={4}>
                {/* Nursing Diagnosis Field */}
                <FormControl>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaNotesMedical} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      label="Nursing Diagnosis "
                      name="nursingdiagnosis"
                      value={formData.nursingdiagnosis}
                      onChange={handleInputChange}
                      placeholder="Enter diagnoses"
                    />
                  </InputGroup>
                </FormControl>
                {/* Objectives Field */}
                <FormControl>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaClipboardList} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      label="Objectives"
                      name="objectives"
                      value={formData.objectives}
                      onChange={handleInputChange}
                      placeholder="Enter objectives"
                    />
                  </InputGroup>
                </FormControl>
                {/* Action Intervention Field */}
                <FormControl>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaTasks} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      label="Action Intervention"
                      name="actionintervention"
                      value={formData.actionintervention}
                      onChange={handleInputChange}
                      placeholder="Enter action interventions"
                    />
                  </InputGroup>
                </FormControl>
                {/* Evaluation Field */}
                <FormControl>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaCheckCircle} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      label="Evaluation"
                      name="evaluation"
                      value={formData.evaluation}
                      onChange={handleInputChange}
                      placeholder="Enter evaluation"
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
