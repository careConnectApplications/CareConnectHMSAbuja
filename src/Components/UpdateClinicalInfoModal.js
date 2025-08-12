import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Text,
  FormControl,
  Select,
  Divider,
  Box,
} from "@chakra-ui/react";
import { FaHeart, FaMedkit } from "react-icons/fa";
import Input from "./Input";
import Button from "./Button";
import { UpdatePatientApi } from "../Utils/ApiCalls";
import ShowToast from "./ToastNotification";

export default function UpdateClinicalInfoModal({
  isOpen,
  onClose,
  patient,
  activateNotifications,
}) {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    bloodGroup: "",
    genotype: "",
    bp: "",
    heartRate: "",
    temperature: "",
  });

  useEffect(() => {
    if (patient) {
      setPayload({
        bloodGroup: patient.patient?.bloodGroup || "",
        genotype: patient.patient?.genotype || "",
        bp: patient.patient?.bp || "",
        heartRate: patient.patient?.heartRate || "",
        temperature: patient.patient?.temperature || "",
      });
    }
  }, [patient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await UpdatePatientApi(payload, patient.patient?._id);
      activateNotifications("Clinical information updated successfully", "success");
      onClose();
    } catch (err) {
      let errorMessage = "Something went wrong!";
      if (err?.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      activateNotifications(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        isCentered
      >
        <ModalOverlay />
        <ModalContent p={4} borderRadius="md" boxShadow="md">
          <ModalHeader>
            <Text fontSize="xl" fontWeight="bold" color="blue.blue500">
              Update Clinical Information
            </Text>
            <ModalCloseButton onClick={onClose} />
          </ModalHeader>

          <ModalBody pb={6} mt={2}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <Select
                  h="45px"
                  borderWidth="2px"
                  borderColor="#6B7280"
                  name="bloodGroup"
                  value={payload.bloodGroup}
                  onChange={handleInputChange}
                  placeholder="Select Blood Group"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Select>
              </FormControl>
              <FormControl>
                <Select
                  h="45px"
                  borderWidth="2px"
                  borderColor="#6B7280"
                  name="genotype"
                  value={payload.genotype}
                  onChange={handleInputChange}
                  placeholder="Select Genotype"
                >
                  <option value="AA">AA</option>
                  <option value="AS">AS</option>
                  <option value="AC">AC</option>
                  <option value="SS">SS</option>
                  <option value="SC">SC</option>
                </Select>
              </FormControl>
              <Input
                id="bp"
                label="Blood Pressure"
                value={payload.bp}
                onChange={handleInputChange}
                name="bp"
                placeholder="e.g. 120/80"
                leftIcon={<FaHeart />}
              />
              <Input
                id="heartRate"
                label="Heart Rate"
                value={payload.heartRate}
                onChange={handleInputChange}
                name="heartRate"
                type="number"
                placeholder="e.g. 72"
                leftIcon={<FaHeart />}
              />
              <Input
                id="temperature"
                label="Temperature"
                value={payload.temperature}
                onChange={handleInputChange}
                name="temperature"
                type="number"
                placeholder="e.g. 98.6"
                leftIcon={<FaMedkit />}
              />
            </SimpleGrid>
          </ModalBody>

          <ModalFooter gap="5">
            <Button onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button isLoading={loading} onClick={handleSubmit}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
