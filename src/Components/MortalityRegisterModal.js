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
} from "@chakra-ui/react";
import Button from "./Button";
import Input from "./Input";
import { useColors } from "../Utils/colors";

export default function MortalityRegisterModal({
  isOpen,
  onClose,
  type,
  record,
  patientId,
  activateNotifications,
  onSuccess,
}) {
  const {
    bgColor,
    textColor,
    titleTextColor,
    primaryColor,
  } = useColors();

  const [formData, setFormData] = useState({
    dateOfDeath: "",
    timeOfDeath: "",
    type: "",
    ageAtDeath: "",
    causeOfDeath: "",
    immediateCause: "",
    underlyingCause: "",
    contributingFactors: "",
    placeOfDeath: "",
    attendingPhysician: "",
    certifiedBy: "",
    autopsy: "",
    autopsyFindings: "",
    familyNotified: "",
    status: "",
    certificateNumber: "",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (type === "edit" && record) {
      setFormData(record);
    } else if (type === "create") {
      setFormData({
        dateOfDeath: "",
        timeOfDeath: "",
        type: "",
        ageAtDeath: "",
        causeOfDeath: "",
        immediateCause: "",
        underlyingCause: "",
        contributingFactors: "",
        placeOfDeath: "",
        attendingPhysician: "",
        certifiedBy: "",
        autopsy: "",
        autopsyFindings: "",
        familyNotified: "",
        status: "",
        certificateNumber: "",
        notes: "",
      });
    }
  }, [type, record, isOpen]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const message = type === "create" 
        ? "Mortality record registered successfully"
        : "Mortality record updated successfully";
      
      activateNotifications(message, "success");
      onSuccess();
      onClose();
    } catch (error) {
      activateNotifications(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const isReadOnly = type === "view";
  const modalTitle = type === "create" 
    ? "Register Death"
    : type === "edit" 
    ? "Edit Mortality Record"
    : "View Mortality Record";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader color={titleTextColor}>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="16px" fontWeight="600" color={titleTextColor} mb="16px">
            Basic Information
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <Input
              label="Date of Death"
              type="date"
              value={formData.dateOfDeath}
              onChange={(e) => handleInputChange("dateOfDeath", e.target.value)}
              readOnly={isReadOnly}
            />

            <Input
              label="Time of Death"
              type="time"
              value={formData.timeOfDeath}
              onChange={(e) => handleInputChange("timeOfDeath", e.target.value)}
              readOnly={isReadOnly}
            />

            <Select
              placeholder="Type of death"
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              disabled={isReadOnly}
            >
              <option value="maternal">Maternal Death</option>
              <option value="perinatal">Perinatal Death</option>
              <option value="neonatal">Neonatal Death</option>
              <option value="stillbirth">Stillbirth</option>
            </Select>

            <Input
              label="Age at Death"
              value={formData.ageAtDeath}
              onChange={(e) => handleInputChange("ageAtDeath", e.target.value)}
              readOnly={isReadOnly}
              placeholder="e.g., 28 years, 2 days, etc."
            />

            <Select
              placeholder="Place of death"
              value={formData.placeOfDeath}
              onChange={(e) => handleInputChange("placeOfDeath", e.target.value)}
              disabled={isReadOnly}
            >
              <option value="hospital">Hospital</option>
              <option value="home">Home</option>
              <option value="transit">In Transit</option>
              <option value="other">Other</option>
            </Select>

            <Input
              label="Attending Physician"
              value={formData.attendingPhysician}
              onChange={(e) => handleInputChange("attendingPhysician", e.target.value)}
              readOnly={isReadOnly}
              placeholder="Dr. Name"
            />
          </SimpleGrid>

          <Text fontSize="16px" fontWeight="600" color={titleTextColor} mb="16px" mt="24px">
            Cause of Death
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box>
              <Text fontSize="14px" fontWeight="500" color={textColor} mb="8px">
                Immediate Cause of Death
              </Text>
              <Textarea
                value={formData.immediateCause}
                onChange={(e) => handleInputChange("immediateCause", e.target.value)}
                readOnly={isReadOnly}
                placeholder="Direct cause that led to death..."
                rows={3}
              />
            </Box>

            <Box>
              <Text fontSize="14px" fontWeight="500" color={textColor} mb="8px">
                Underlying Cause of Death
              </Text>
              <Textarea
                value={formData.underlyingCause}
                onChange={(e) => handleInputChange("underlyingCause", e.target.value)}
                readOnly={isReadOnly}
                placeholder="Disease or injury that initiated the chain of events..."
                rows={3}
              />
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1 }} spacing={4} mt={4}>
            <Box>
              <Text fontSize="14px" fontWeight="500" color={textColor} mb="8px">
                Contributing Factors
              </Text>
              <Textarea
                value={formData.contributingFactors}
                onChange={(e) => handleInputChange("contributingFactors", e.target.value)}
                readOnly={isReadOnly}
                placeholder="Other significant conditions contributing to death..."
                rows={2}
              />
            </Box>
          </SimpleGrid>

          <Text fontSize="16px" fontWeight="600" color={titleTextColor} mb="16px" mt="24px">
            Certification & Status
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <Input
              label="Certified By"
              value={formData.certifiedBy}
              onChange={(e) => handleInputChange("certifiedBy", e.target.value)}
              readOnly={isReadOnly}
              placeholder="Certifying physician"
            />

            <Select
              placeholder="Autopsy performed"
              value={formData.autopsy}
              onChange={(e) => handleInputChange("autopsy", e.target.value)}
              disabled={isReadOnly}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="pending">Pending</option>
            </Select>

            <Select
              placeholder="Family notified"
              value={formData.familyNotified}
              onChange={(e) => handleInputChange("familyNotified", e.target.value)}
              disabled={isReadOnly}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="pending">Pending</option>
            </Select>

            <Input
              label="Certificate Number"
              value={formData.certificateNumber}
              onChange={(e) => handleInputChange("certificateNumber", e.target.value)}
              readOnly={isReadOnly}
              placeholder="Death certificate number"
            />

            <Select
              placeholder="Status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              disabled={isReadOnly}
            >
              <option value="registered">Registered</option>
              <option value="pending">Pending Registration</option>
              <option value="under-review">Under Review</option>
              <option value="certified">Certified</option>
            </Select>
          </SimpleGrid>

          {formData.autopsy === "yes" && (
            <SimpleGrid columns={{ base: 1 }} spacing={4} mt={4}>
              <Box>
                <Text fontSize="14px" fontWeight="500" color={textColor} mb="8px">
                  Autopsy Findings
                </Text>
                <Textarea
                  value={formData.autopsyFindings}
                  onChange={(e) => handleInputChange("autopsyFindings", e.target.value)}
                  readOnly={isReadOnly}
                  placeholder="Summary of autopsy findings..."
                  rows={3}
                />
              </Box>
            </SimpleGrid>
          )}

          <SimpleGrid columns={{ base: 1 }} spacing={4} mt={4}>
            <Box>
              <Text fontSize="14px" fontWeight="500" color={textColor} mb="8px">
                Additional Notes
              </Text>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                readOnly={isReadOnly}
                placeholder="Any additional information, circumstances, or observations..."
                rows={4}
              />
            </Box>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter>
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
