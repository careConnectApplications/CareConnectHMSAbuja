import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  SimpleGrid,
  Divider,
  Text,
  InputGroup,
  InputLeftElement,
  Icon,
  Select,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import { CreateInsulinApi, UpdateInsulinApi, SettingsApi } from "../Utils/ApiCalls";

import { AiOutlineCalendar } from "react-icons/ai";
import { GiWaterDrop, GiMeal, GiFruitBowl } from "react-icons/gi";
import { FaHashtag } from "react-icons/fa";

export default function InsulinChartModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,
  // Defaults to "create" mode; pass type="edit" and initialData when updating.
  type = "create",
  initialData,
}) {
  const initialFormState = {
    // Blood Glucose Monitoring
    dateandtimeofbloodglucosemonitoring: "",
    premealbloodglucoselevel: "",
    postmealbloodglucoselevel: "",
    fastingbloodglucose: "",
    // Insulin Administration
    dateandtimeofinsulinadministration: "",
    typeofinsulin: "",
    dosage: "",
    route: "",
    // Nutritional Factors
    mealtimes: "",
    carbonhydrateintakeestimation: "",
    // Hypoglycemia or Hyperglycemia Episodes
    symtoms: "",
    interventionprovided: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({});

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch settings when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchSettings = async () => {
        try {
          const settingsData = await SettingsApi();
          setSettings(settingsData);
        } catch (error) {
          console.error("Error fetching settings:", error);
        }
      };
      fetchSettings();
    }
  }, [isOpen]);

  // Pre-populate the form when editing.
  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && initialData) {
        setFormData({
          dateandtimeofbloodglucosemonitoring:
            initialData.dateandtimeofbloodglucosemonitoring || "",
          premealbloodglucoselevel: initialData.premealbloodglucoselevel || "",
          postmealbloodglucoselevel: initialData.postmealbloodglucoselevel || "",
          fastingbloodglucose: initialData.fastingbloodglucose || "",
          dateandtimeofinsulinadministration:
            initialData.dateandtimeofinsulinadministration || "",
          typeofinsulin: initialData.typeofinsulin || "",
          dosage: initialData.dosage || "",
          route: initialData.route || "",
          mealtimes: initialData.mealtimes || "",
          carbonhydrateintakeestimation:
            initialData.carbonhydrateintakeestimation || "",
          symtoms: initialData.symtoms || "",
          interventionprovided: initialData.interventionprovided || "",
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, type, initialData]);

  const handleSubmit = async () => {
    // Ensure all fields are completed.
    if (Object.values(formData).some((field) => field === "")) {
      showToast({ status: "error", message: "All fields are required." });
      return;
    }
    setLoading(true);
    try {
      if (type === "edit") {
        await UpdateInsulinApi(formData, initialData._id || initialData.id);
        showToast({
          status: "success",
          message: "Insulin chart updated successfully!",
        });
      } else {
        await CreateInsulinApi(formData, admissionId);
        showToast({
          status: "success",
          message: "Insulin chart created successfully!",
        });
      }
      if (onSuccess) onSuccess();
      onClose();
      setFormData(initialFormState);
    } catch (error) {
      showToast({
        status: "error",
        message: `Failed to ${type === "edit" ? "update" : "create"} insulin chart: ${error.message}`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = Object.values(formData).every((field) => field !== "");

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        isCentered 
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent maxW={{ base: "95%", md: "80%" }} maxH={{ base: "90vh", md: "auto" }}>
          <ModalHeader>
            {type === "edit" ? "Edit Insulin Chart" : "Create Insulin Chart"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} mt={2}>
            {/* Blood Glucose Monitoring Section */}
            <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
              Blood Glucose Monitoring
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={AiOutlineCalendar} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Date & Time of Blood Glucose Monitoring"
                    type="datetime-local"
                    name="dateandtimeofbloodglucosemonitoring"
                    value={formData.dateandtimeofbloodglucosemonitoring}
                    onChange={handleInputChange}
                    placeholder="Select date and time"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={GiWaterDrop} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Premeal Blood Glucose Level"
                    type="text"
                    name="premealbloodglucoselevel"
                    value={formData.premealbloodglucoselevel}
                    onChange={handleInputChange}
                    placeholder="Enter premeal level"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={GiWaterDrop} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Postmeal Blood Glucose Level"
                    type="text"
                    name="postmealbloodglucoselevel"
                    value={formData.postmealbloodglucosemonitoring}
                    onChange={handleInputChange}
                    placeholder="Enter postmeal level"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={GiWaterDrop} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Fasting Blood Glucose"
                    type="text"
                    name="fastingbloodglucose"
                    value={formData.fastingbloodglucose}
                    onChange={handleInputChange}
                    placeholder="Enter fasting level"
                  />
                </InputGroup>
              </FormControl>
            </SimpleGrid>

            <Divider my={4} />

            {/* Insulin Administration Section */}
            <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
              Insulin Administration
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={AiOutlineCalendar} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Date & Time of Insulin Administration"
                    type="datetime-local"
                    name="dateandtimeofinsulinadministration"
                    value={formData.dateandtimeofinsulinadministration}
                    onChange={handleInputChange}
                    placeholder="Select date and time"
                  />
                </InputGroup>
              </FormControl>
              {/* Type of Insulin as Dropdown */}
              <FormControl>
                <InputGroup>
                  <Select
                    placeholder="Select Type of Insulin"
                    name="typeofinsulin"
                    value={formData.typeofinsulin}
                    onChange={handleInputChange}
                    borderWidth="2px"
                    borderColor="#6B7280"
                  >
                    {settings?.typeofinsulin?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaHashtag} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Dosage"
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder="Enter dosage"
                  />
                </InputGroup>
              </FormControl>
              {/* Route as Dropdown */}
              <FormControl>
                <InputGroup>
                  <Select
                    placeholder="Select Route"
                    name="route"
                    value={formData.route}
                    onChange={handleInputChange}
                    borderWidth="2px"
                    borderColor="#6B7280"
                  >
                    {settings?.insulinroute?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
              </FormControl>
            </SimpleGrid>

            <Divider my={4} />

            {/* Nutritional Factors Section */}
            <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
              Nutritional Factors
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={GiMeal} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Meal Times"
                    type="text"
                    name="mealtimes"
                    value={formData.mealtimes}
                    onChange={handleInputChange}
                    placeholder="Enter meal times"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={GiFruitBowl} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Carbohydrate Intake Estimation"
                    type="text"
                    name="carbonhydrateintakeestimation"
                    value={formData.carbonhydrateintakeestimation}
                    onChange={handleInputChange}
                    placeholder="Enter carbohydrate intake estimation"
                  />
                </InputGroup>
              </FormControl>
            </SimpleGrid>

            <Divider my={4} />

            {/* Hypoglycemia or Hyperglycemia Episodes Section */}
            <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
              Hypoglycemia or Hyperglycemia Episodes
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {/* Symptoms as Dropdown */}
              <FormControl>
                <InputGroup>
                  <Select
                    placeholder="Select Symptoms"
                    name="symtoms"
                    value={formData.symtoms}
                    onChange={handleInputChange}
                    borderWidth="2px"
                    borderColor="#6B7280"
                  >
                    {settings?.insulinsymptoms?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
              </FormControl>
              {/* Intervention Provided as Dropdown */}
              <FormControl>
                <InputGroup>
                  <Select
                    placeholder="Select Intervention Provided"
                    name="interventionprovided"
                    value={formData.interventionprovided}
                    onChange={handleInputChange}
                    borderWidth="2px"
                    borderColor="#6B7280"
                  >
                    {settings?.insulininterventionprovided?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              disabled={!isFormComplete || loading}
              isLoading={loading}
            >
              {type === "edit" ? "Update" : "Submit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
