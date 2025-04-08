import React, { useState, useEffect, useRef } from "react";
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
  Text,
  Box,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import { FaSortNumericDown } from "react-icons/fa";
import { ConfirmPharmacyOrderApi, GetPriceOfDrugApi } from "../Utils/ApiCalls";
import Preloader from "./Preloader";

export default function ConfirmPharmacyOrderModal({
  isOpen,
  onClose,
  pharmacyId,
  onSuccess,
  order,
}) {
  const [option, setOption] = useState("");
  const [remark, setRemark] = useState("");
  const [qty, setQty] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [price, setPrice] = useState(null); // State for the drug price

  // Ref for quantity input container
  const quantityRef = useRef(null);

  // Helper function to show toast notifications
  const showToastFn = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  // Reset input fields (and price) when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setOption("");
      setRemark("");
      setQty("");
      setPrice(null);
    }
  }, [isOpen]);

  // Scroll to quantity input when "accept" option is selected
  useEffect(() => {
    if (option === "accept" && quantityRef.current) {
      quantityRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [option]);

  // When the modal opens, call the get price endpoint using the pharmacyId
  useEffect(() => {
    if (isOpen && pharmacyId) {
      GetPriceOfDrugApi(pharmacyId)
        .then((response) => {
          setPrice(response.price);
        })
        .catch((error) => {
          console.error("Error fetching drug price:", error.message);
        });
    }
  }, [isOpen, pharmacyId]);

  const handleSubmit = async () => {
    // Validate quantity if order is accepted
    if (option === "accept" && (!qty || Number(qty) <= 0)) {
      showToastFn({
        status: "error",
        message: "Quantity must be greater than 0.",
      });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        option: option === "accept",
        remark: remark.trim(), // remark is now optional
        qty: option === "accept" ? Number(qty) : 0,
      };
      await ConfirmPharmacyOrderApi(pharmacyId, payload);
      showToastFn({
        status: "success",
        message: "Pharmacy order confirmed successfully!",
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      showToastFn({
        status: "error",
        message: `Failed to confirm pharmacy order: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="lg"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW={["90%", "600px"]} maxH="90vh">
          <ModalHeader fontSize={["md", "lg"]}>
            Confirm Pharmacy Order
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              {/* Order Summary */}
              {order && (
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={3}
                  mb={3}
                  bg="gray.50"
                >
                  <Text fontWeight="bold" fontSize="md">
                    Patient: {order.patient?.firstName}{" "}
                    {order.patient?.lastName}
                  </Text>
                  <Text fontSize="sm">Prescription: {order.prescription}</Text>
                  <Text fontSize="sm">Dosage Form: {order.dosageform}</Text>
                  <Text fontSize="sm">Strength: {order.strength}</Text>
                  <Text fontSize="sm">Dosage: {order.dosage}</Text>
                  <Text fontSize="sm">Frequency: {order.frequency}</Text>
                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color="blue.blue500"
                  >
                    Price:{" "}
                    <Text
                      as="span"
                      fontWeight="bold"
                      fontSize="lg"
                      color="blue.blue500"
                    >
                      {price !== null ? price : "Loading..."}
                    </Text>
                  </Text>
                </Box>
              )}

              {/* Order Option */}
              <FormControl>
                <FormLabel fontSize="md">Order Option</FormLabel>
                <RadioGroup onChange={setOption} value={option}>
                  <Stack direction="row" spacing={3}>
                    <Radio value="accept" size="md">
                      Accept Order
                    </Radio>
                    <Radio value="reject" size="md">
                      Reject Order
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="md">Remark</FormLabel>
                <Textarea
                  id="remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter remark (optional)"
                  size="md"
                  resize="vertical"
                />
              </FormControl>

              {/* Quantity Input with a ref */}
              {option === "accept" && (
                <FormControl ref={quantityRef}>
                  <Input
                    label="Quantity"
                    id="quantity"
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    placeholder="Enter quantity"
                    size="md"
                    leftIcon={<FaSortNumericDown />}
                  />
                </FormControl>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              disabled={
                loading ||
                (option === "accept" && (!qty || Number(qty) <= 0))
              }
              isLoading={loading}
              size="md"
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
