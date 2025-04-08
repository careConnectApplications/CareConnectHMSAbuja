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
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import { CreateVitalChartApi, UpdateVitalChartApi } from "../Utils/ApiCalls";

import { BiRuler } from "react-icons/bi";
import { GiWeightScale, GiLungs, GiSugarCane, GiBrain } from "react-icons/gi";
import { WiThermometer } from "react-icons/wi";
import { FaHeartbeat, FaArrowUp, FaArrowDown, FaTint, FaExclamationTriangle } from "react-icons/fa";

export default function SingleVitalModal({
  isOpen,
  onClose,
  patientId,
  onSuccess,
  type = "create",
  initialData,
}) {
  // Retrieve the patientId from props or localStorage.
  const storedPatientId =
    patientId || localStorage.getItem("patientId") || "6777ae3c4fb71984f5ee7689";

  // Retain the logic to get the admission id if needed for editing.
  let finalAdmissionId = localStorage.getItem("admissionId");
  const storedAdmission = localStorage.getItem("inPatient");

  if (storedAdmission) {
    try {
      const patient = JSON.parse(storedAdmission);
      if (patient.admission && Array.isArray(patient.admission) && patient.admission.length > 0) {
        finalAdmissionId = patient.admission[0];
      }
    } catch (err) {
      console.error("Error parsing stored patient data:", err);
    }
  }

  const initialFormState = {
    height: "",
    weight: "",
    temperature: "",
    heartrate: "",
    bloodpressuresystolic: "",
    bloodpressurediastolic: "",
    respiration: "",
    saturation: "",
    painscore: "",
    rbs: "",
    gcs: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Pre-populate the form when editing.
  useEffect(() => {
    if (isOpen && type === "edit" && initialData) {
      setFormData({
        height: initialData.height || "",
        weight: initialData.weight || "",
        temperature: initialData.temperature || "",
        heartrate: initialData.heartrate || "",
        bloodpressuresystolic: initialData.bloodpressuresystolic || "",
        bloodpressurediastolic: initialData.bloodpressurediastolic || "",
        respiration: initialData.respiration || "",
        saturation: initialData.saturation || "",
        painscore: initialData.painscore || "",
        rbs: initialData.rbs || "",
        gcs: initialData.gcs || "",
      });
    }
  }, [isOpen, type, initialData]);

  // Clear form data when the modal closes.
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    // Allow submit if at least one field is entered.
    if (!Object.values(formData).some((field) => field !== "")) {
      showToast({ status: "error", message: "At least one field must be entered." });
      return;
    }
    setLoading(true);
    try {
      if (type === "edit") {
        await UpdateVitalChartApi(formData, initialData.id);
        showToast({
          status: "success",
          message: "Vitals updated successfully!",
        });
      } else {
        // For create, pass the patient id from local storage.
        await CreateVitalChartApi(formData, storedPatientId);
        showToast({
          status: "success",
          message: "Vitals recorded successfully!",
        });
      }

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      showToast({
        status: "error",
        message: `Failed to ${type === "edit" ? "update" : "record"} vitals: ${error.message}`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Allow submit if at least one field is entered.
  const isAnyFieldEntered = Object.values(formData).some((field) => field !== "");

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent maxWidth={["90%", "60%"]}>
          <ModalHeader>{type === "edit" ? "Edit Vitals" : "Record Vitals"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={2} spacing={4}>
              {/* Height */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={BiRuler} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Height"
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="Enter height"
                  />
                </InputGroup>
              </FormControl>
              {/* Weight */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={GiWeightScale} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Weight"
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Enter weight"
                  />
                </InputGroup>
              </FormControl>
              {/* Temperature */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={WiThermometer} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Temperature"
                    type="text"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    placeholder="Enter temperature"
                  />
                </InputGroup>
              </FormControl>
              {/* Heart Rate */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaHeartbeat} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Heart Rate"
                    type="text"
                    name="heartrate"
                    value={formData.heartrate}
                    onChange={handleInputChange}
                    placeholder="Enter heart rate"
                  />
                </InputGroup>
              </FormControl>
              {/* Blood Pressure Systolic */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaArrowUp} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Blood Pressure Systolic"
                    type="text"
                    name="bloodpressuresystolic"
                    value={formData.bloodpressuresystolic}
                    onChange={handleInputChange}
                    placeholder="Enter systolic value"
                  />
                </InputGroup>
              </FormControl>
              {/* Blood Pressure Diastolic */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaArrowDown} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Blood Pressure Diastolic"
                    type="text"
                    name="bloodpressurediastolic"
                    value={formData.bloodpressurediastolic}
                    onChange={handleInputChange}
                    placeholder="Enter diastolic value"
                  />
                </InputGroup>
              </FormControl>
              {/* Respiration */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={GiLungs} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Respiration"
                    type="text"
                    name="respiration"
                    value={formData.respiration}
                    onChange={handleInputChange}
                    placeholder="Enter respiration rate"
                  />
                </InputGroup>
              </FormControl>
              {/* Saturation */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaTint} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Saturation"
                    type="text"
                    name="saturation"
                    value={formData.saturation}
                    onChange={handleInputChange}
                    placeholder="Enter saturation level"
                  />
                </InputGroup>
              </FormControl>
              {/* Pain Score */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaExclamationTriangle} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Pain Score"
                    type="text"
                    name="painscore"
                    value={formData.painscore}
                    onChange={handleInputChange}
                    placeholder="Enter pain score"
                  />
                </InputGroup>
              </FormControl>
              {/* RBS */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={GiSugarCane} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="RBS"
                    type="text"
                    name="rbs"
                    value={formData.rbs}
                    onChange={handleInputChange}
                    placeholder="Enter RBS value"
                  />
                </InputGroup>
              </FormControl>
              {/* GCS */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={GiBrain} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="GCS"
                    type="text"
                    name="gcs"
                    value={formData.gcs}
                    onChange={handleInputChange}
                    placeholder="Enter GCS value"
                  />
                </InputGroup>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              disabled={!isAnyFieldEntered || loading}
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
