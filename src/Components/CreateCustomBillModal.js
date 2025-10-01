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
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import {
  CreateCustomBillApi,
  SettingsApi,
  GetServiceTypesByCategoryApi,
} from "../Utils/ApiCalls";
import { useParams } from "react-router-dom";

export default function CreateCustomBillModal({ isOpen, onClose }) {
  const { id: patientId } = useParams();
  const toast = useToast();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [billType, setBillType] = useState("custom");
  const [departments, setDepartments] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  let patientDetails = JSON.parse(localStorage.getItem("patientDetails"));
  const [formData, setFormData] = useState({
    serviceCategory: "",
    serviceType: "",
    amount: "",
    phoneNumber: patientDetails?.phoneNumber || "",
    MRN: patientDetails?.MRN || "",
    option: "custom",
    department: "",
  });

  const getSettings = async () => {
    try {
      const result = await SettingsApi();
      setSettings(result);

      // Corrected department extraction
      const combinedDepartments = [
        ...(result?.department?.map((item) => item.name) || []),
        ...(result?.clinics?.map((item) => item.clinic) || []), // Changed from item.department to item.clinic
        ...(result?.pharmacy?.map((item) => item.name) || []),
      ];

      // Remove duplicates and set departments
      const uniqueDepartments = [...new Set(combinedDepartments)];
      setDepartments(uniqueDepartments);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "serviceCategory") {
      try {
        const response = await GetServiceTypesByCategoryApi(value);
        if (response && Array.isArray(response.queryresult)) {
          const formattedTypes = response.queryresult.map((serviceName) => ({
            service: serviceName,
          }));
          setServiceTypes(formattedTypes);
        } else {
          setServiceTypes([]);
        }
      } catch (error) {
        console.error("Failed to fetch service types:", error);
        setServiceTypes([]);
      }
    }
  };

  const handleBillTypeChange = (value) => {
    setBillType(value);
    setFormData({
      ...formData,
      option: value,
      serviceType: "",
      amount: "",
      department: "",
    });
  };

  const activateNotifications = (message, status) => {
    toast({
      title: status === "success" ? "Success" : "Error",
      description: message,
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    let payload;
    if (billType === "custom") {
      payload = {
        serviceCategory: formData.serviceCategory,
        serviceType: formData.serviceType,
        amount: formData.amount,
        phoneNumber: formData.phoneNumber,
        MRN: formData.MRN,
      };
    } else {
      payload = {
        serviceCategory: formData.serviceCategory,
        serviceType: formData.serviceType,
        phoneNumber: formData.phoneNumber,
        option: "fixed",
        department: formData.department,
      };
    }
    try {
      const response = await CreateCustomBillApi(payload, patientId);

      // Check if the response has status: true (as shown in your API example)
      if (response.data && response.data.status === true) {
        activateNotifications(
          response.data.message || "Custom bill created successfully.",
          "success"
        );
        setFormData({
          serviceCategory: "",
          serviceType: "",
          amount: "",
          phoneNumber: patientDetails?.phoneNumber || "",
          MRN: patientDetails?.MRN || "",
          option: "custom",
          department: "",
        });
        setBillType("custom");
        onClose();
      } else {
        activateNotifications(
          response.data?.message || "Could not create custom bill.",
          "error"
        );
      }
    } catch (error) {
      activateNotifications(
        error.response?.data?.message || "Could not create custom bill.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Generate New Bill</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <RadioGroup onChange={handleBillTypeChange} value={billType} mb={4}>
            <Stack direction="row" spacing={5}>
              <Radio value="custom">Custom Bill</Radio>
              <Radio value="fixed">Fixed Bill</Radio>
            </Stack>
          </RadioGroup>

          <Select
            name="serviceCategory"
            value={formData.serviceCategory}
            onChange={handleInputChange}
            placeholder="Select Service Category"
            fontSize="16px"
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

          {billType === "custom" ? (
            <>
              <Input
                mt={4}
                val={formData.serviceType !== ""}
                onChange={handleInputChange}
                name="serviceType"
                value={formData.serviceType}
                label="Service Type"
              />
              <Input
                mt={4}
                val={formData.amount !== ""}
                onChange={handleInputChange}
                name="amount"
                value={formData.amount}
                label="Amount"
              />
            </>
          ) : (
            <>
              <Select
                mt={4}
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                placeholder="Select Service Type"
                fontSize="16px"
                size="lg"
                border="2px solid"
                borderColor="gray.500"
              >
                {serviceTypes.map((service, i) => (
                  <option key={i} value={service.service}>
                    {service.service}
                  </option>
                ))}
              </Select>
              <Select
                mt={4}
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Select Department"
                fontSize="16px"
                size="lg"
                border="2px solid"
                borderColor="gray.500"
              >
                {departments.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </>
          )}

          <Input
            mt={4}
            val={formData.phoneNumber !== ""}
            onChange={handleInputChange}
            name="phoneNumber"
            value={formData.phoneNumber}
            label="Phone Number"
          />
          <Input
            mt={4}
            val={formData.MRN !== ""}
            onChange={handleInputChange}
            name="MRN"
            value={formData.MRN}
            label="MRN"
            readOnly
          />
        </ModalBody>

        <ModalFooter>
          <Button isLoading={loading} onClick={handleSubmit}>
            Generate 
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
