import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Stack,
  FormControl,
  FormLabel,
  Textarea,
  Radio,
  RadioGroup,
  HStack,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import ShowToast from "./ToastNotification";
import { ConfirmLabOrderApi } from "../Utils/ApiCalls";

export default function ConfirmLabOrderModal({
  isOpen,
  onClose,
  labOrderId,
  onSuccess,
}) {
  // No default selection; user must choose explicitly.
  const [option, setOption] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  // Reset input fields when the modal is closed.
  useEffect(() => {
    if (!isOpen) {
      setOption("");
      setRemark("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!option) {
      showToast({ status: "error", message: "Please select an order option." });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        // Convert selection into a boolean: true if accept, false if reject.
        option: option === "accept",
        remark: remark.trim(), // Remark is now optional.
      };
      await ConfirmLabOrderApi(labOrderId, payload);
      showToast({
        status: "success",
        message: `Lab order ${option === "accept" ? "accepted" : "rejected"} successfully!`,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      showToast({
        status: "error",
        message: `Failed to confirm lab order: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent maxW={["90%", "600px"]}>
          <ModalHeader fontSize={["lg", "xl"]}>Confirm Lab Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={["10px", "15px"]}>
              <FormControl as="fieldset">
                <FormLabel as="legend">Order Option</FormLabel>
                <RadioGroup onChange={setOption} value={option}>
                  <HStack spacing="24px">
                    <Radio value="accept">Accept Order</Radio>
                    <Radio value="reject">Reject Order</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Remark</FormLabel>
                <Textarea
                  id="remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter remark (optional)"
                  size="md"
                  resize="vertical"
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              disabled={loading || !option}
              isLoading={loading}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
