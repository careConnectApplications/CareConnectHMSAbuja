import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import Button from "./Button";

const DischargePatientModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDischarging,
}) => {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const handleConfirm = () => {
    const dischargeReason = reason === "Other" ? otherReason : reason;
    onConfirm(dischargeReason);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Discharge Patient</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl as="fieldset">
            <FormLabel as="legend">Reason for Discharge</FormLabel>
            <RadioGroup onChange={setReason} value={reason}>
              <Stack>
                <Radio value="Discharged to Home">Discharged to Home</Radio>
                <Radio value="Left Against Medical Advice (LAMA)">
                  Left Against Medical Advice (LAMA)
                </Radio>
                <Radio value="Referred Out">Referred Out</Radio>
                <Radio value="Transferred">Transferred</Radio>
                <Radio value="Death">Death</Radio>
                <Radio value="Absconded">Absconded</Radio>
                <Radio value="Other">Other</Radio>
              </Stack>
            </RadioGroup>
            {reason === "Other" && (
              <Textarea
                mt={4}
                placeholder="Specify other reason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
            )}
          </FormControl>
        </ModalBody>
              <ModalFooter gap={4}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={handleConfirm}
            isLoading={isDischarging}
            ml={3}
          >
            Confirm Discharge
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DischargePatientModal;
