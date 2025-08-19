import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import Button from "./Button";

const UpdateClaimStatusModal = ({ isOpen, onClose, onSubmit, claimId }) => {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit(claimId, { status });
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Claim Status</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select
              placeholder="Select status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Submitted">Submitted</option>
              <option value="Re-submitted">Re-submitted</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rejected">Rejected</option>
              <option value="Paid">Paid</option>
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Update
          </Button>
          <Button onClick={onClose} background="gray.400">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateClaimStatusModal;
