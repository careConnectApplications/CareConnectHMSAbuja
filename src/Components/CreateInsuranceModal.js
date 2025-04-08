import React, { useState, useEffect } from "react";
import { Stack } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import { CreateInsuranceApi, UpdateInsuranceAPI } from "../Utils/ApiCalls";

export default function CreateInsuranceModal({ isOpen, onClose, type, activateNotifications, oldPayload }) {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    hmoname: ""
  });

  useEffect(() => {
    if (type === "edit" && oldPayload) {
      setPayload(oldPayload);
    } else {
      setPayload({ hmoname: "" });
    }
  }, [isOpen, type, oldPayload]);

  const handleChange = (e) => {
    setPayload(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let response;
      if (type === "new") {
        response = await CreateInsuranceApi(payload);
      } else {
        response = await UpdateInsuranceAPI(payload, oldPayload._id);
      }
      if (response.status === 200 || response.status === 201) {
        activateNotifications(
          type === "new" ? "Insurance Added Successfully" : "Insurance Updated Successfully",
          "success"
        );
        onClose();
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {type === "new" ? "Add New Insurance" : "Edit Insurance"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="15px">
            <Input
              val={!!payload.hmoname}
              onChange={handleChange}
              id="hmoname"
              value={payload.hmoname}
              label="HMO Name"
            />
          </Stack>

          <Button mt="32px" isLoading={loading} onClick={handleSubmit}>
            {type === "new" ? "Add Insurance" : "Update Insurance"}
          </Button>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
