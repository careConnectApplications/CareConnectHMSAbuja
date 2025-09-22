import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  SimpleGrid,
  Textarea,
  Select,
  Box,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import Button from "./Button";
import Input from "./Input";
import { useColors } from "../Utils/colors";
import { SettingsApi } from "../Utils/ApiCalls";

export default function MortalityRegisterModal({
  isOpen,
  onClose,
  type,
  record,
  patientId,
  onCreate,
}) {
  const { bgColor, textColor, titleTextColor, primaryColor } = useColors();

  const [formData, setFormData] = useState({
    name: "",
    sex: "",
    dateOfBirth: "",
    age: "",
    patientCardNumber: "",
    ward: "",
    state: "",
    lga: "",
    maternalMortality: false,
    maternalDeath: "",
    other: "",
    neonatalDeath: "",
    neonatalOther: "",
    Deathunderfive: "",
    DeathunderfiveOther: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await SettingsApi();
        if (response.status) {
          setSettings(response);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  useEffect(() => {
    if ((type === "edit" || type === "view") && record) {
      setFormData(record);
    } else if (type === "create") {
      setFormData({
        name: "",
        sex: "",
        dateOfBirth: "",
        age: "",
        patientCardNumber: "",
        ward: "",
        state: "",
        lga: "",
        maternalMortality: false,
        maternalDeath: "",
        other: "",
        neonatalDeath: "",
        neonatalOther: "",
        Deathunderfive: "",
        DeathunderfiveOther: "",
      });
    }
  }, [type, record, isOpen]);

  const handleInputChange = (name, value) => {
    if (type === "view") return; // Prevent changes in view mode
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeathTypeChange = (value) => {
    if (type === "view") return; // Prevent changes in view mode
    // Update maternalMortality based on selection
    setFormData((prev) => ({
      ...prev,
      maternalMortality: value === "Maternal",
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const patientId = localStorage.getItem("patientId");
      const payload = {
        ...formData,
        patient: patientId || "",
      };
      await onCreate(payload);
      onClose();
    } catch (error) {
      // Optionally handle error UI here
    } finally {
      setIsLoading(false);
    }
  };

  const isReadOnly = type === "view";
  const modalTitle =
    type === "create"
      ? "Register Death"
      : type === "edit"
      ? "Edit Mortality Record"
      : "View Mortality Record";

  // Get the current death type for display
  const currentDeathType = formData.maternalMortality
    ? "Maternal"
    : formData.neonatalDeath
    ? "Neonatal"
    : formData.Deathunderfive
    ? "Under Five"
    : "Other";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader color={titleTextColor}>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxH="70vh" overflowY="auto">
          <Text
            fontSize="16px"
            fontWeight="600"
            color={titleTextColor}
            mb="16px"
          >
            Mortality Record Information
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              readOnly={isReadOnly}
            />
            <FormControl>
             
              <Select
                placeholder="Select Sex"
                value={formData.sex}
                onChange={(e) => handleInputChange("sex", e.target.value)}
                disabled={isReadOnly}
              >
                {settings?.sex?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              readOnly={isReadOnly}
            />
            <Input
              label="Age"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              readOnly={isReadOnly}
            />
            <Input
              label="Patient Card Number"
              value={formData.patientCardNumber}
              onChange={(e) =>
                handleInputChange("patientCardNumber", e.target.value)
              }
              readOnly={isReadOnly}
            />
            <Input
              label="Ward"
              value={formData.ward}
              onChange={(e) => handleInputChange("ward", e.target.value)}
              readOnly={isReadOnly}
            />
            <Input
              label="State"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              readOnly={isReadOnly}
            />
            <Input
              label="LGA"
              value={formData.lga}
              onChange={(e) => handleInputChange("lga", e.target.value)}
              readOnly={isReadOnly}
            />
          </SimpleGrid>

          <Text
            fontSize="16px"
            fontWeight="600"
            color={titleTextColor}
            mb="16px"
            mt="24px"
          >
            Death Details
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <FormControl>
              <FormLabel>Death Type</FormLabel>
              {isReadOnly ? (
                <Input value={currentDeathType} readOnly={true} />
              ) : (
                <Select
                  placeholder="Select Death Type"
                  value={currentDeathType}
                  onChange={(e) => handleDeathTypeChange(e.target.value)}
                  disabled={isReadOnly}
                >
                  <option value="Maternal">Maternal</option>
                  <option value="Neonatal">Neonatal</option>
                  <option value="Under Five">Under Five</option>
                  <option value="Other">Other</option>
                </Select>
              )}
            </FormControl>

            {/* Maternal Death Fields */}
            <FormControl>
              <FormLabel>Maternal Death Cause</FormLabel>
              {isReadOnly ? (
                <Input
                  value={formData.maternalDeath || "N/A"}
                  readOnly={true}
                />
              ) : (
                <Select
                  placeholder="Select Cause"
                  value={formData.maternalDeath}
                  onChange={(e) =>
                    handleInputChange("maternalDeath", e.target.value)
                  }
                  disabled={isReadOnly}
                >
                  <option value="">Select Cause</option>
                  {settings?.maternalDeath?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              )}
            </FormControl>

            {formData.maternalDeath === "Other" && (
              <Input
                label="Other Maternal Cause"
                value={formData.other}
                onChange={(e) => handleInputChange("other", e.target.value)}
                readOnly={isReadOnly}
              />
            )}

            {/* Neonatal Death Fields */}
            <FormControl>
              <FormLabel>Neonatal Death Cause</FormLabel>
              {isReadOnly ? (
                <Input
                  value={formData.neonatalDeath || "N/A"}
                  readOnly={true}
                />
              ) : (
                <Select
                  placeholder="Select Cause"
                  value={formData.neonatalDeath}
                  onChange={(e) =>
                    handleInputChange("neonatalDeath", e.target.value)
                  }
                  disabled={isReadOnly}
                >
                  <option value="">Select Cause</option>
                  {settings?.neonatalDeath?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              )}
            </FormControl>

            {formData.neonatalDeath === "⁠Others" && (
              <Input
                label="Other Neonatal Cause"
                value={formData.neonatalOther}
                onChange={(e) =>
                  handleInputChange("neonatalOther", e.target.value)
                }
                readOnly={isReadOnly}
              />
            )}

            {/* Under Five Death Fields */}
            <FormControl>
              <FormLabel>Under Five Death Cause</FormLabel>
              {isReadOnly ? (
                <Input
                  value={formData.Deathunderfive || "N/A"}
                  readOnly={true}
                />
              ) : (
                <Select
                  placeholder="Select Cause"
                  value={formData.Deathunderfive}
                  onChange={(e) =>
                    handleInputChange("Deathunderfive", e.target.value)
                  }
                  disabled={isReadOnly}
                >
                  <option value="">Select Cause</option>
                  {settings?.deathUnderFive?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              )}
            </FormControl>

            {formData.Deathunderfive === "Others" && (
              <Input
                label="Other Under Five Cause"
                value={formData.DeathunderfiveOther}
                onChange={(e) =>
                  handleInputChange("DeathunderfiveOther", e.target.value)
                }
                readOnly={isReadOnly}
              />
            )}

            {/* General Other Death Field */}
            <FormControl>
              <FormLabel>Other Death Cause</FormLabel>
              <Input
                value={formData.other}
                onChange={(e) => handleInputChange("other", e.target.value)}
                readOnly={isReadOnly}
                placeholder="Enter other cause of death"
              />
            </FormControl>
          </SimpleGrid>
        </ModalBody>
        <ModalFooter gap="4">
          <Button variant="outline" mr={3} onClick={onClose}>
            {isReadOnly ? "Close" : "Cancel"}
          </Button>
          {!isReadOnly && (
            <Button
              bg={primaryColor}
              color="white"
              _hover={{ bg: primaryColor }}
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              {type === "create" ? "Register Death" : "Update Record"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
