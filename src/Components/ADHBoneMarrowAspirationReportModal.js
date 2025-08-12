import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Stack,
  Input as ChakraInput,
} from "@chakra-ui/react";
import Button from "./Button";
import TextArea from "./TextArea";
import { ProcessADHBoneMarrowAspirationReportApi } from "../Utils/ApiCalls";
import ShowToast from "./ToastNotification";

export default function ADHBoneMarrowAspirationReportModal({
  isOpen,
  onClose,
  testId,
  type,
  oldPayload = {},
  activateNotifications,
}) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [payload, setPayload] = useState({
    clinicalnotes: "",
    boneconsistency: "",
    aspiration: "",
    erythroidratio: "",
    erythropoiesis: "",
    leucopoesis: "",
    megakaryopoiesis: "",
    plasmacells: "",
    abnormalcells: "",
    ironstore: "",
    conclusion: "",
  });
  const [items, setItems] = useState({
    clinicalnotes: [],
    erythropoiesis: [],
    leucopoesis: [],
    megakaryopoiesis: [],
    plasmacells: [],
    conclusion: [],
  });

  const showToast = (status, message) => {
    setToast({ status, message });
    setTimeout(() => setToast(null), 3000);
    if (activateNotifications) {
      activateNotifications(message, status);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    if ((type === "edit" || type === "view") && oldPayload) {
      // Initialize items with proper array values
      setItems({
        clinicalnotes: Array.isArray(oldPayload.clinicalnotes)
          ? oldPayload.clinicalnotes
          : oldPayload.clinicalnotes
          ? [oldPayload.clinicalnotes]
          : [],
        erythropoiesis: Array.isArray(oldPayload.erythropoiesis)
          ? oldPayload.erythropoiesis
          : oldPayload.erythropoiesis
          ? [oldPayload.erythropoiesis]
          : [],
        leucopoesis: Array.isArray(oldPayload.leucopoesis)
          ? oldPayload.leucopoesis
          : oldPayload.leucopoesis
          ? [oldPayload.leucopoesis]
          : [],
        megakaryopoiesis: Array.isArray(oldPayload.megakaryopoiesis)
          ? oldPayload.megakaryopoiesis
          : oldPayload.megakaryopoiesis
          ? [oldPayload.megakaryopoiesis]
          : [],
        plasmacells: Array.isArray(oldPayload.plasmacells)
          ? oldPayload.plasmacells
          : oldPayload.plasmacells
          ? [oldPayload.plasmacells]
          : [],
        conclusion: Array.isArray(oldPayload.conclusion)
          ? oldPayload.conclusion
          : oldPayload.conclusion
          ? [oldPayload.conclusion]
          : [],
      });

      // Initialize payload with proper string values
      setPayload({
        clinicalnotes: "",
        boneconsistency: oldPayload.boneconsistency || "",
        aspiration: oldPayload.aspiration || "",
        erythroidratio: oldPayload.erythroidratio || "",
        erythropoiesis: "",
        leucopoesis: "",
        megakaryopoiesis: "",
        plasmacells: "",
        abnormalcells: oldPayload.abnormalcells || "",
        ironstore: oldPayload.ironstore || "",
        conclusion: "",
      });
    }
  }, [isOpen, type, oldPayload]);

  useEffect(() => {
    if (isOpen) return;
    setPayload({
      clinicalnotes: "",
      boneconsistency: "",
      aspiration: "",
      erythroidratio: "",
      erythropoiesis: "",
      leucopoesis: "",
      megakaryopoiesis: "",
      plasmacells: "",
      abnormalcells: "",
      ironstore: "",
      conclusion: "",
    });
    setItems({
      clinicalnotes: [],
      erythropoiesis: [],
      leucopoesis: [],
      megakaryopoiesis: [],
      plasmacells: [],
      conclusion: [],
    });
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setPayload((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddItem = (field) => {
    if (!payload[field].trim()) return;

    setItems((prev) => ({
      ...prev,
      [field]: [...prev[field], payload[field].trim()],
    }));
    setPayload((prev) => ({ ...prev, [field]: "" }));
  };

  const removeItem = (field, item) => {
    setItems((prev) => ({
      ...prev,
      [field]: prev[field].filter((i) => i !== item),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const reportPayload = {
        ...items,
        boneconsistency: payload.boneconsistency,
        aspiration: payload.aspiration,
        erythroidratio: payload.erythroidratio,
        abnormalcells: payload.abnormalcells,
        ironstore: payload.ironstore,
      };

      const result = await ProcessADHBoneMarrowAspirationReportApi(
        testId,
        reportPayload
      );
      if (result.status === 200) {
        showToast(
          "success",
          type === "new"
            ? "ADH Bone Marrow Aspiration Report Processed Successfully"
            : "ADH Bone Marrow Aspiration Report Updated Successfully"
        );
        onClose();
      }
    } catch (e) {
      showToast("error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (field, label, placeholder = "") => {
    const isDisabled = type === "view";

    return (
      <Box mb={4}>
        <Text fontWeight="500" mb={2} fontSize="14px">
          {label}
        </Text>
        <ChakraInput
          value={payload[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          size="md"
          border="2px solid"
          borderColor="gray.500"
          isDisabled={isDisabled}
        />
      </Box>
    );
  };

  const renderTagField = (field, label) => {
    const isDisabled = type === "view";

    return (
      <Box mb={4}>
        <Text fontWeight="500" mb={2} fontSize="14px">
          {label}
        </Text>
        {!isDisabled && (
          <Flex mb={2}>
            <TextArea
              value={payload[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()} (press Enter to add)`}
              size="lg"
              border="2px solid"
              borderColor="gray.500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddItem(field);
                }
              }}
            />
          </Flex>
        )}
        <Wrap spacing={2}>
          {items[field].map((item, index) => (
            <WrapItem key={index}>
              <Tag
                size="lg"
                borderRadius="full"
                variant="solid"
                bg="blue.blue500"
              >
                <TagLabel>{item}</TagLabel>
                {!isDisabled && (
                  <TagCloseButton onClick={() => removeItem(field, item)} />
                )}
              </Tag>
            </WrapItem>
          ))}
          {items[field].length === 0 && isDisabled && (
            <Text color="gray.500">N/A</Text>
          )}
        </Wrap>
      </Box>
    );
  };

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent
          maxW={{ base: "90%", md: "60%" }}
          maxH="80vh"
          overflowY="auto"
        >
          <ModalHeader>
            {type === "new"
              ? "Process ADH Bone Marrow Aspiration Report"
              : type === "edit"
              ? "Edit ADH Bone Marrow Aspiration Report"
              : "View ADH Bone Marrow Aspiration Report"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={6}>
              {renderTagField("clinicalnotes", "Clinical Notes")}
              {renderInputField("boneconsistency", "Bone Consistency")}
              {renderInputField("aspiration", "Aspiration")}
              {renderInputField("erythroidratio", "Erythroid Ratio")}
              {renderTagField("erythropoiesis", "Erythropoiesis")}
              {renderTagField("leucopoesis", "Leucopoesis")}
              {renderTagField("megakaryopoiesis", "Megakaryopoiesis")}
              {renderTagField("plasmacells", "Plasma Cells")}
              {renderInputField("abnormalcells", "Abnormal Cells")}
              {renderInputField("ironstore", "Iron Store")}
              {renderTagField("conclusion", "Conclusion")}
            </Stack>
          </ModalBody>
          <ModalFooter>
            {(type === "new" || type === "edit") && (
              <Button isLoading={loading} onClick={handleSubmit}>
                {type === "new" ? "Submit" : "Update"}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
