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
import Button from "./Button";
import Input from "./Input";
import ShowToast from "./ToastNotification";
import { CreateFluidBalanceApi, UpdateFluidBalanceApi, SettingsApi } from "../Utils/ApiCalls";

import { GiWaterDrop, GiMeal, GiMedicinePills } from "react-icons/gi";
import { FaBalanceScale, FaSyringe, FaHashtag, FaExclamationTriangle } from "react-icons/fa";

export default function FluidBalanceModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,
  // Defaults to "create" mode; pass type="edit" and initialData when updating.
  type = "create",
  initialData,
}) {
  const initialFormState = {
    // Fluid Intake
    oralfluids: "",
    tubefeedingvolume: "",
    IVfluidtype: "",
    IVfluidvolume: "",
    IVfluidrate: "",
    medication: "",
    totalintake: "",
    // Fluid Output
    urineoutput: "",
    stoolfrequency: "",
    stoolamount: "",
    consistency: "",
    vomitamount: "",
    drainage: "",
    totaloutput: "",
    // Net Fluid Balance
    netfliudbalancefor24hours: "",
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
          oralfluids: initialData.oralfluids || "",
          tubefeedingvolume: initialData.tubefeedingvolume || "",
          IVfluidtype: initialData.IVfluidtype || "",
          IVfluidvolume: initialData.IVfluidvolume || "",
          IVfluidrate: initialData.IVfluidrate || "",
          medication: initialData.medication || "",
          totalintake: initialData.totalintake || "",
          urineoutput: initialData.urineoutput || "",
          stoolfrequency: initialData.stoolfrequency || "",
          stoolamount: initialData.stoolamount || "",
          consistency: initialData.consistency || "",
          vomitamount: initialData.vomitamount || "",
          drainage: initialData.drainage || "",
          totaloutput: initialData.totaloutput || "",
          netfliudbalancefor24hours: initialData.netfliudbalancefor24hours || "",
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
        await UpdateFluidBalanceApi(formData, initialData._id || initialData.id);
        showToast({
          status: "success",
          message: "Fluid balance updated successfully!",
        });
      } else {
        await CreateFluidBalanceApi(formData, admissionId);
        showToast({
          status: "success",
          message: "Fluid balance created successfully!",
        });
      }
      if (onSuccess) {
        onSuccess();
      }
      onClose();
      setFormData(initialFormState);
    } catch (error) {
      showToast({
        status: "error",
        message: `Failed to ${type === "edit" ? "update" : "create"} fluid balance: ${error.message}`,
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
            {type === "edit" ? "Edit Fluid Balance" : "Create Fluid Balance"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} mt={2}>
            {/* Fluid Intake Section */}
            <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
              Fluid Intake
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {/* Oral Fluids – Dropdown from settings.oralfluids */}
              <FormControl>
                <InputGroup>
                  <Select
                    placeholder="Select Oral Fluid"
                    name="oralfluids"
                    value={formData.oralfluids}
                    onChange={handleInputChange}
                    borderWidth="2px"
                    borderColor="#6B7280"
                  >
                    {settings?.oralfluids?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
              </FormControl>
              {/* Tube Feeding Volume – Text Input */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={GiMeal} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Tube Feeding Volume"
                    type="text"
                    name="tubefeedingvolume"
                    value={formData.tubefeedingvolume}
                    onChange={handleInputChange}
                    placeholder="Enter tube feeding volume"
                  />
                </InputGroup>
              </FormControl>
              {/* IV Fluid Type – Text Input */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSyringe} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="IV Fluid Type"
                    type="text"
                    name="IVfluidtype"
                    value={formData.IVfluidtype}
                    onChange={handleInputChange}
                    placeholder="Enter IV fluid type"
                  />
                </InputGroup>
              </FormControl>
              {/* IV Fluid Volume – Text Input */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSyringe} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="IV Fluid Volume"
                    type="text"
                    name="IVfluidvolume"
                    value={formData.IVfluidvolume}
                    onChange={handleInputChange}
                    placeholder="Enter IV fluid volume"
                  />
                </InputGroup>
              </FormControl>
              {/* IV Fluid Rate – Text Input */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaHashtag} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="IV Fluid Rate"
                    type="text"
                    name="IVfluidrate"
                    value={formData.IVfluidrate}
                    onChange={handleInputChange}
                    placeholder="Enter IV fluid rate"
                  />
                </InputGroup>
              </FormControl>
              {/* Medication – Dropdown from settings.medication */}
              <FormControl>
                <InputGroup>
                  <Select
                    placeholder="Select Medication"
                    name="medication"
                    value={formData.medication}
                    onChange={handleInputChange}
                    borderWidth="2px"
                    borderColor="#6B7280"
                  >
                    {settings?.medication?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
              </FormControl>
              {/* Total Intake – Text Input */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaHashtag} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Total Intake"
                    type="text"
                    name="totalintake"
                    value={formData.totalintake}
                    onChange={handleInputChange}
                    placeholder="Enter total intake"
                  />
                </InputGroup>
              </FormControl>
            </SimpleGrid>

            <Divider my={4} />

            {/* Fluid Output Section */}
            <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
              Fluid Output
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {/* Urine Output – Text Input */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={GiWaterDrop} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Urine Output"
                    type="text"
                    name="urineoutput"
                    value={formData.urineoutput}
                    onChange={handleInputChange}
                    placeholder="Enter urine output"
                  />
                </InputGroup>
              </FormControl>
              {/* Stool Frequency – Dropdown from settings.bmfrequency */}
              <FormControl>
                <InputGroup>
                  <Select
                    placeholder="Select Stool Frequency"
                    name="stoolfrequency"
                    value={formData.stoolfrequency}
                    onChange={handleInputChange}
                    borderWidth="2px"
                    borderColor="#6B7280"
                  >
                    {settings?.bmfrequency?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
              </FormControl>
              {/* Stool Amount – Text Input */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaHashtag} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Stool Amount"
                    type="text"
                    name="stoolamount"
                    value={formData.stoolamount}
                    onChange={handleInputChange}
                    placeholder="Enter stool amount"
                  />
                </InputGroup>
              </FormControl>
              {/* Consistency – Dropdown from settings.consistencystool */}
              <FormControl>
                <InputGroup>
                  <Select
                    placeholder="Select Stool Consistency"
                    name="consistency"
                    value={formData.consistency}
                    onChange={handleInputChange}
                    borderWidth="2px"
                    borderColor="#6B7280"
                  >
                    {settings?.consistencystool?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
              </FormControl>
              {/* Vomit Amount – Text Input */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaExclamationTriangle} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Vomit Amount"
                    type="text"
                    name="vomitamount"
                    value={formData.vomitamount}
                    onChange={handleInputChange}
                    placeholder="Enter vomit amount"
                  />
                </InputGroup>
              </FormControl>
              {/* Drainage – Dropdown from settings.drainage */}
              <FormControl>
                <InputGroup>
                  <Select
                    placeholder="Select Drainage"
                    name="drainage"
                    value={formData.drainage}
                    onChange={handleInputChange}
                    borderWidth="2px"
                    borderColor="#6B7280"
                  >
                    {settings?.drainage?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
              </FormControl>
              {/* Total Output – Text Input */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaHashtag} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Total Output"
                    type="text"
                    name="totaloutput"
                    value={formData.totaloutput}
                    onChange={handleInputChange}
                    placeholder="Enter total output"
                  />
                </InputGroup>
              </FormControl>
            </SimpleGrid>

            <Divider my={4} />

            {/* Net Fluid Balance Section */}
            <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
              Net Fluid Balance (24 Hours)
            </Text>
            <FormControl>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaBalanceScale} color="gray.300" />
                </InputLeftElement>
                <Input
                  label="Net Fluid Balance for 24 Hours"
                  type="text"
                  name="netfliudbalancefor24hours"
                  value={formData.netfliudbalancefor24hours}
                  onChange={handleInputChange}
                  placeholder="Enter net fluid balance for 24 hours"
                />
              </InputGroup>
            </FormControl>
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
