import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  HStack,
  Text,
} from "@chakra-ui/react";
import {
  AddBedFeeApi,
} from "../Utils/ApiCalls";
import { FaDollarSign } from "react-icons/fa";
import Button from "./Button";
import Input from "./Input";


const BedFeeModal = ({
  isOpen,
  onClose,
  admissionId,
  patientId,
  activateNotifications,
  trigger,
  setTrigger,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bedfee: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        bedfee: "",
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.bedfee) {
      activateNotifications("Please fill the bed fee", "error");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        bedfee: parseInt(formData.bedfee) || 0,
      };
      const response = await AddBedFeeApi(admissionId, payload);
      if (response.status === 200) {
        activateNotifications("Bed fee added successfully", "success");
        setTrigger(!trigger);
        onClose();
      }
    } catch (error) {
      activateNotifications(error.message || "Operation failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Bed Fee</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="15px">
            <Input
              val={formData.bedfee !== ""}
              
              onChange={handleChange}
              name="bedfee"
              value={formData.bedfee}
              label="Bed Fee"
              type="number"
            />
          </Stack>

          <HStack mt="32px" justifyContent="flex-end">
            <Button isLoading={isLoading} onClick={handleSubmit}>
              Add Fee
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BedFeeModal;
