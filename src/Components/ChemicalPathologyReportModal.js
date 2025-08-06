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
  Stack,
} from "@chakra-ui/react";
import Button from "./Button";
import TextArea from "./TextArea";
import { ProcessChemicalPathologyReportApi } from "../Utils/ApiCalls";
import ShowToast from "./ToastNotification";

export default function ChemicalPathologyReportModal({
  isOpen,
  onClose,
  testId,
  type,
  oldPayload = {},
  activateNotifications,
}) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [comment, setComment] = useState("");

  const showToast = (status, message) => {
    setToast({ status, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!isOpen) return;

    if ((type === "edit" || type === "view") && oldPayload?.comment) {
      setComment(oldPayload.comment);
    } else {
      setComment("");
    }
  }, [isOpen, type, oldPayload]);

  useEffect(() => {
    if (!isOpen) {
      setComment("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const reportPayload = {
        comment: comment,
      };

      const result = await ProcessChemicalPathologyReportApi(
        testId,
        reportPayload
      );
      if (result.status === 200) {
        // Store comment in localStorage
        localStorage.setItem(
          `chemical_pathology_comment_${testId}`,
          comment || ""
        );
        console.log("[DEBUG] Stored comment in localStorage:", {
          testId,
          comment,
        });

        showToast(
          "success",
          type === "new"
            ? "Chemical Pathology Report Processed Successfully"
            : "Chemical Pathology Report Updated Successfully"
        );
        activateNotifications(
          type === "new"
            ? "Chemical Pathology Report Processed Successfully"
            : "Chemical Pathology Report Updated Successfully",
          "success"
        );
        onClose();
      }
    } catch (e) {
      showToast("error", e.message);
      activateNotifications(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent maxW={{ base: "90%", md: "60%" }}>
          <ModalHeader>
            {type === "new"
              ? "Process Chemical Pathology Report"
              : type === "edit"
              ? "Edit Chemical Pathology Report"
              : "View Chemical Pathology Report"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={6}>
              <Box mb={4}>
                <Text fontWeight="500" mb={2} fontSize="14px">
                  Comment
                </Text>
                <TextArea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    type === "view" && !comment
                      ? "No comment available"
                      : "Enter your comment"
                  }
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                  isDisabled={type === "view"}
                />
              </Box>
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
