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
  InputGroup,
  InputLeftElement,
  Icon,
  Select,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import {
  CreateMedicationChartApi,
  UpdateMedicalChartApi,
  SettingsApi,
} from "../Utils/ApiCalls";
import { FaPills, FaSyringe } from "react-icons/fa";
import { MdNote } from "react-icons/md";

export default function MedicalChartModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,
  // Default to "create" mode; pass type="edit" and initialData when updating.
  type = "create",
  initialData,
}) {
  let storedAdmission = localStorage.getItem("inPatient");
  let finalAdmissionId = admissionId;
  if (!finalAdmissionId && storedAdmission) {
    try {
      const patient = JSON.parse(storedAdmission);
      if (patient.admission && Array.isArray(patient.admission)) {
        finalAdmissionId = patient.admission[0];
      } else {
        finalAdmissionId = localStorage.getItem("admissionId");
      }
    } catch (err) {
      finalAdmissionId = localStorage.getItem("admissionId");
    }
  }

  const initialFormState = {
    drug: "",
    note: "",
    dose: "",
    frequency: "",
    route: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({});

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch settings when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchSettings = async () => {
        try {
          const settingsData = await SettingsApi();
          setSettings(settingsData);
        } catch (error) {
          console.error("Error fetching settings:", error);
        }
      };
      fetchSettings();
    }
  }, [isOpen]);

  // Pre-populate the form when editing.
  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && initialData) {
        setFormData({
          drug: initialData.drug || "",
          note: initialData.note || "",
          dose: initialData.dose || "",
          frequency: initialData.frequency || "",
          route: initialData.route || "",
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, type, initialData]);

  const handleSubmit = async () => {
    // Ensure all fields are completed.
    if (Object.values(formData).some((field) => field === "")) {
      showToast({ status: "error", message: "All fields are required." });
      return;
    }
    setLoading(true);
    try {
      if (type === "edit") {
        // Update the existing medical chart.
        await UpdateMedicalChartApi(formData, initialData.id);
        showToast({
          status: "success",
          message: "Medical chart updated successfully!",
        });
      } else {
        // Create a new medical chart.
        await CreateMedicationChartApi(formData, finalAdmissionId);
        showToast({
          status: "success",
          message: "Medical chart created successfully!",
        });
      }
      if (onSuccess) {
        onSuccess();
      }
      onClose();
      setFormData(initialFormState);
    } catch (error) {
      showToast({
        status: "error",
        message: `Failed to ${
          type === "edit" ? "update" : "create"
        } medical chart: ${error.message}`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = Object.values(formData).every((field) => field);

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent
          maxW={{ base: "95%", md: "60%" }}
          maxH={{ base: "90vh", md: "auto" }}
        >
          <ModalHeader fontSize={{ base: "lg", md: "xl" }}>
            {type === "edit" ? "Edit Medical Chart" : "Create Medical Chart"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {/* Drug remains a text input */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaPills} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Drug"
                    type="text"
                    name="drug"
                    value={formData.drug}
                    onChange={handleInputChange}
                    placeholder="Enter drug name"
                  />
                </InputGroup>
              </FormControl>
              {/* Note remains a text input */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdNote} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Note  (optional)"
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Enter note  (optional)"
                  />
                </InputGroup>
              </FormControl>
              {/* Dose remains a text input */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSyringe} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Dose"
                    type="text"
                    name="dose"
                    value={formData.dose}
                    onChange={handleInputChange}
                    placeholder="Enter dose"
                  />
                </InputGroup>
              </FormControl>
              {/* Frequency as a dropdown */}
              <FormControl>
                <InputGroup>
                  <Select
                    placeholder="Select Frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    borderWidth="2px"
                    borderColor="#6B7280"
                  >
                    {settings?.medicationchartfrequency?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
              </FormControl>
              {/* Route as a dropdown */}
              <FormControl>
                <InputGroup>
                  <Select
                    placeholder="Select Route"
                    name="route"
                    value={formData.route}
                    onChange={handleInputChange}
                    borderWidth="2px"
                    borderColor="#6B7280"
                  >
                    {settings?.medicationchartroute?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
              </FormControl>
            </SimpleGrid>
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
