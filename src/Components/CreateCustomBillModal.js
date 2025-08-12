import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  useToast,
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import {
  CreateCustomBillApi,
  SettingsApi,
} from "../Utils/ApiCalls";
import { useParams } from "react-router-dom";

export default function CreateCustomBillModal({ isOpen, onClose }) {
  const { id: patientId } = useParams();
  const toast = useToast();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  let patientDetails = JSON.parse(localStorage.getItem("patientDetails"));
  const [formData, setFormData] = useState({
    serviceCategory: "",
    serviceType: "",
    phoneNumber: patientDetails?.phoneNumber || "",
    MRN: patientDetails?.MRN || "",
  });

  const getSettings = async () => {
    try {
      const result = await SettingsApi();
      setSettings(result);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await CreateCustomBillApi(formData, patientId);
      toast({
        title: "Success",
        description: "Custom bill created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({
        serviceCategory: "",
        serviceType: "",
        phoneNumber: "",
        MRN: "",
      });
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Could not create custom bill.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Custom Bill</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Select
            name="serviceCategory"
            value={formData.serviceCategory}
            onChange={handleInputChange}
            placeholder="Select Service Category"
            fontSize={formData.serviceCategory !== "" ? "16px" : "13px"}
            size="lg"
            border="2px solid"
            borderColor="gray.500"
          >
            {settings?.servicecategory?.map((item, i) => (
              <option key={i} value={item.category}>
                {item.category}
              </option>
            ))}
          </Select>

          {formData.serviceCategory !== "" && (
            <Select
              mt={4}
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              placeholder="Select Service Type"
              border="2px solid"
              size="lg"
              fontSize={formData.serviceType !== "" ? "16px" : "13px"}
              borderColor="gray.500"
            >
              {settings?.servicecategory
                ?.filter((item) => item.category === formData.serviceCategory)[0]
                ?.type?.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
            </Select>
          )}

          <Input
            mt={4}
            val={formData.serviceType !== "" ? true : false}
            onChange={handleInputChange}
            name="phoneNumber"
            value={formData.phoneNumber}
            label="Phone Number"
          />
          <Input
            mt={4}
            val={formData.phoneNumber !== "" ? true : false}
            onChange={handleInputChange}
            name="MRN"
            value={formData.MRN}
            label="MRN"
            readOnly
          />
        </ModalBody>

        <ModalFooter>
          <Button isLoading={loading} onClick={handleSubmit}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
