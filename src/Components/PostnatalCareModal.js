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

export default function PostnatalCareModal({
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
    daysPostDelivery: "",
    motherCondition: "",
    babyCondition: "",
    breastfeeding: "",
    breastfeedingIssues: "",
    motherTemperature: "",
    motherBloodPressure: "",
    motherPulse: "",
    motherRespiratoryRate: "",
    babyWeight: "",
    babyTemperature: "",
    feedingAmount: "",
    uterineInvolution: "",
    lochia: "",
    perinealHealing: "",
    contraceptionDiscussed: "",
    immunizations: "",
    complications: "",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (type === "edit" && record) {
      setFormData(record);
    } else if (type === "create") {
      setFormData({
        daysPostDelivery: "",
        motherCondition: "",
        babyCondition: "",
        breastfeeding: "",
        breastfeedingIssues: "",
        motherTemperature: "",
        motherBloodPressure: "",
        motherPulse: "",
        motherRespiratoryRate: "",
        babyWeight: "",
        babyTemperature: "",
        feedingAmount: "",
        uterineInvolution: "",
        lochia: "",
        perinealHealing: "",
        contraceptionDiscussed: "",
        immunizations: "",
        complications: "",
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
        ? "Postnatal care record created successfully"
        : "Postnatal care record updated successfully";
      
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
    ? "Add Postnatal Care Record"
    : type === "edit" 
    ? "Edit Postnatal Care Record"
    : "View Postnatal Care Record";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader color={titleTextColor}>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="16px" fontWeight="600" color={titleTextColor} mb="16px">
            General Information
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <Input
              label="Days Post Delivery"
              type="number"
              value={formData.daysPostDelivery}
              onChange={(e) => handleInputChange("daysPostDelivery", e.target.value)}
              readOnly={isReadOnly}
              placeholder="7"
            />

            <Select
              placeholder="Mother's condition"
              value={formData.motherCondition}
              onChange={(e) => handleInputChange("motherCondition", e.target.value)}
              disabled={isReadOnly}
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </Select>

            <Select
              placeholder="Baby's condition"
              value={formData.babyCondition}
              onChange={(e) => handleInputChange("babyCondition", e.target.value)}
              disabled={isReadOnly}
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </Select>
          </SimpleGrid>

          <Text fontSize="16px" fontWeight="600" color={titleTextColor} mb="16px" mt="24px">
            Mother's Vitals
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            <Input
              label="Temperature (°C)"
              type="number"
              step="0.1"
              value={formData.motherTemperature}
              onChange={(e) => handleInputChange("motherTemperature", e.target.value)}
              readOnly={isReadOnly}
              placeholder="36.5"
            />

            <Input
              label="Blood Pressure (mmHg)"
              value={formData.motherBloodPressure}
              onChange={(e) => handleInputChange("motherBloodPressure", e.target.value)}
              readOnly={isReadOnly}
              placeholder="120/80"
            />

            <Input
              label="Pulse (bpm)"
              type="number"
              value={formData.motherPulse}
              onChange={(e) => handleInputChange("motherPulse", e.target.value)}
              readOnly={isReadOnly}
              placeholder="80"
            />

            <Input
              label="Respiratory Rate"
              type="number"
              value={formData.motherRespiratoryRate}
              onChange={(e) => handleInputChange("motherRespiratoryRate", e.target.value)}
              readOnly={isReadOnly}
              placeholder="16"
            />
          </SimpleGrid>

          <Text fontSize="16px" fontWeight="600" color={titleTextColor} mb="16px" mt="24px">
            Baby's Assessment
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <Input
              label="Baby Weight (kg)"
              type="number"
              step="0.1"
              value={formData.babyWeight}
              onChange={(e) => handleInputChange("babyWeight", e.target.value)}
              readOnly={isReadOnly}
              placeholder="3.2"
            />

            <Input
              label="Baby Temperature (°C)"
              type="number"
              step="0.1"
              value={formData.babyTemperature}
              onChange={(e) => handleInputChange("babyTemperature", e.target.value)}
              readOnly={isReadOnly}
              placeholder="36.5"
            />

            <Input
              label="Feeding Amount (ml)"
              type="number"
              value={formData.feedingAmount}
              onChange={(e) => handleInputChange("feedingAmount", e.target.value)}
              readOnly={isReadOnly}
              placeholder="60"
            />
          </SimpleGrid>

          <Text fontSize="16px" fontWeight="600" color={titleTextColor} mb="16px" mt="24px">
            Breastfeeding & Recovery
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <Select
              placeholder="Breastfeeding status"
              value={formData.breastfeeding}
              onChange={(e) => handleInputChange("breastfeeding", e.target.value)}
              disabled={isReadOnly}
            >
              <option value="exclusive">Exclusive Breastfeeding</option>
              <option value="mixed">Mixed Feeding</option>
              <option value="formula">Formula Feeding</option>
              <option value="difficulties">Having Difficulties</option>
            </Select>

            <Select
              placeholder="Uterine involution"
              value={formData.uterineInvolution}
              onChange={(e) => handleInputChange("uterineInvolution", e.target.value)}
              disabled={isReadOnly}
            >
              <option value="normal">Normal</option>
              <option value="delayed">Delayed</option>
              <option value="subinvolution">Subinvolution</option>
            </Select>

            <Select
              placeholder="Lochia"
              value={formData.lochia}
              onChange={(e) => handleInputChange("lochia", e.target.value)}
              disabled={isReadOnly}
            >
              <option value="rubra">Lochia Rubra</option>
              <option value="serosa">Lochia Serosa</option>
              <option value="alba">Lochia Alba</option>
              <option value="offensive">Offensive</option>
              <option value="absent">Absent</option>
            </Select>

            <Select
              placeholder="Perineal healing"
              value={formData.perinealHealing}
              onChange={(e) => handleInputChange("perinealHealing", e.target.value)}
              disabled={isReadOnly}
            >
              <option value="healing-well">Healing Well</option>
              <option value="delayed-healing">Delayed Healing</option>
              <option value="infected">Infected</option>
              <option value="dehisced">Dehisced</option>
            </Select>

            <Select
              placeholder="Contraception discussed"
              value={formData.contraceptionDiscussed}
              onChange={(e) => handleInputChange("contraceptionDiscussed", e.target.value)}
              disabled={isReadOnly}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="declined">Declined</option>
            </Select>

            <Select
              placeholder="Immunizations"
              value={formData.immunizations}
              onChange={(e) => handleInputChange("immunizations", e.target.value)}
              disabled={isReadOnly}
            >
              <option value="up-to-date">Up to Date</option>
              <option value="pending">Pending</option>
              <option value="declined">Declined</option>
            </Select>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
            <Box>
              <Text fontSize="14px" fontWeight="500" color={textColor} mb="8px">
                Breastfeeding Issues
              </Text>
              <Textarea
                value={formData.breastfeedingIssues}
                onChange={(e) => handleInputChange("breastfeedingIssues", e.target.value)}
                readOnly={isReadOnly}
                placeholder="Describe any breastfeeding difficulties or issues..."
                rows={3}
              />
            </Box>

            <Box>
              <Text fontSize="14px" fontWeight="500" color={textColor} mb="8px">
                Complications
              </Text>
              <Textarea
                value={formData.complications}
                onChange={(e) => handleInputChange("complications", e.target.value)}
                readOnly={isReadOnly}
                placeholder="List any complications or concerns..."
                rows={3}
              />
            </Box>
          </SimpleGrid>

          <Box mt={4}>
            <Text fontSize="14px" fontWeight="500" color={textColor} mb="8px">
              Additional Notes
            </Text>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              readOnly={isReadOnly}
              placeholder="Any additional observations, instructions, or follow-up plans..."
              rows={4}
            />
          </Box>
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
              {type === "create" ? "Create Record" : "Update Record"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
