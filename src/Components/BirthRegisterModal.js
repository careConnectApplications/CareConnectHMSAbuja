import React from "react";
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

export default function BirthRegisterModal({ isOpen, onClose, patientId }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Add Birth Record
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text color="gray.600">
            Birth registration form will be implemented here with fields for:
            - Baby's name
            - Date and time of birth
            - Gender
            - Birth weight and length
            - APGAR scores (1 min and 5 min)
            - Birth type (vaginal, C-section, assisted)
            - Multiple birth details
            - Congenital anomalies if any
            - Attending physician/midwife
            - Birth certificate details
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Save Birth Record
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
