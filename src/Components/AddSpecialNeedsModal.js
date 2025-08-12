import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import Button from "./Button";
import TextArea from "./TextArea";
import { UpdatePatientApi } from "../Utils/ApiCalls";

export default function AddSpecialNeedsModal({
  isOpen,
  onClose,
  patient,
  activateNotifications,
}) {
  const [loading, setLoading] = useState(false);
  const [specialNeeds, setSpecialNeeds] = useState("");

  useEffect(() => {
    if (patient) {
      setSpecialNeeds(patient.patient?.specialNeeds || "");
    }
  }, [patient]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await UpdatePatientApi({ specialNeeds }, patient.patient?._id);
      activateNotifications("Special needs updated successfully", "success");
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
            Add Special Need
          </Text>
          <ModalCloseButton onClick={onClose} />
        </ModalHeader>

        <ModalBody pb={6} mt={2}>
          <TextArea
            label="Special Needs"
            value={specialNeeds}
            onChange={(e) => setSpecialNeeds(e.target.value)}
            placeholder="Enter special needs"
          />
        </ModalBody>

        <ModalFooter  gap="5">
          <Button onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button isLoading={loading} onClick={handleSubmit}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
