import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Flex,
  Text,
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Stack,
} from "@chakra-ui/react";
import Button from "./Button";
import TextArea from "./TextArea";
import { ProcessPeripheralBloodFilmReportApi } from "../Utils/ApiCalls";
import ShowToast from "./ToastNotification";

export default function PeripheralBloodFilmReportModal({
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
    summary: "",
    redbloodcell: "",
    whitebloodcell: "",
    platelet: "",
    impression: "",
    suggestion: "",
  });
  const [items, setItems] = useState({
    summary: [],
    redbloodcell: [],
    whitebloodcell: [],
    platelet: [],
    impression: [],
    suggestion: [],
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
      setItems({
        summary: Array.isArray(oldPayload.summary) ? oldPayload.summary : [],
        redbloodcell: Array.isArray(oldPayload.redbloodcell)
          ? oldPayload.redbloodcell
          : [],
        whitebloodcell: Array.isArray(oldPayload.whitebloodcell)
          ? oldPayload.whitebloodcell
          : [],
        platelet: Array.isArray(oldPayload.platelet) ? oldPayload.platelet : [],
        impression: Array.isArray(oldPayload.impression)
          ? oldPayload.impression
          : [],
        suggestion: Array.isArray(oldPayload.suggestion)
          ? oldPayload.suggestion
          : [],
      });
    }
  }, [isOpen, type, oldPayload]);

  useEffect(() => {
    if (isOpen) return;
    setPayload({
      summary: "",
      redbloodcell: "",
      whitebloodcell: "",
      platelet: "",
      impression: "",
      suggestion: "",
    });
    setItems({
      summary: [],
      redbloodcell: [],
      whitebloodcell: [],
      platelet: [],
      impression: [],
      suggestion: [],
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
      const reportPayload = { ...items };
      const result = await ProcessPeripheralBloodFilmReportApi(
        testId,
        reportPayload
      );
      if (result.status === 200) {
        showToast(
          "success",
          type === "new"
            ? "Peripheral Blood Film Report Processed Successfully"
            : "Peripheral Blood Film Report Updated Successfully"
        );
        onClose();
      }
    } catch (e) {
      showToast("error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field, label) => {
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
              ? "Process Peripheral Blood Film Report"
              : type === "edit"
              ? "Edit Peripheral Blood Film Report"
              : "View Peripheral Blood Film Report"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={6}>
              {renderField("summary", "Summary")}
              {renderField("redbloodcell", "Red Blood Cell")}
              {renderField("whitebloodcell", "White Blood Cell")}
              {renderField("platelet", "Platelet")}
              {renderField("impression", "Impression")}
              {renderField("suggestion", "Suggestion")}
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
