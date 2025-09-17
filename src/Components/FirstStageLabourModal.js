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

export default function FirstStageLabourModal({ isOpen, onClose, mode, data, patientId }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === "create" ? "Add" : mode === "edit" ? "Edit" : "View"} First Stage Labour Record
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text color="gray.600">
            First stage labour form will be implemented here with fields for:
            - Cervical dilation
            - Effacement
            - Station
            - Contractions
            - Fetal heart rate
            - Membranes status
            - And other relevant medical data
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          {mode !== "view" && (
            <Button onClick={onClose}>
              {mode === "create" ? "Save" : "Update"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
