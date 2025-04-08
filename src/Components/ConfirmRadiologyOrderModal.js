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
  Radio,
  RadioGroup,
  HStack,
  Textarea,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import ShowToast from "./ToastNotification";
import { ConfirmRadiologyOrderApi } from "../Utils/ApiCalls";

export default function ConfirmRadiologyOrderModal({
  isOpen,
  onClose,
  radiologyId, // radiologyId is the id of the selected radiology order
  onSuccess,
}) {
  // No default option selected.
  const [option, setOption] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  // Reset fields when the modal is closed.
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
        // Convert the selection into a boolean.
        option: option === "accept",
        remark: remark.trim(), // Remark is now optional.
      };
      await ConfirmRadiologyOrderApi(radiologyId, payload);
      showToast({
        status: "success",
        message: `Radiology order ${
          option === "accept" ? "accepted" : "rejected"
        } successfully!`,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      showToast({
        status: "error",
        message: `Failed to confirm radiology order: ${error.message}`,
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
          <ModalHeader fontSize={["lg", "xl"]}>
            Confirm Radiology Order
          </ModalHeader>
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
