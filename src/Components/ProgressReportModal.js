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
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import ShowToast from "./ToastNotification";
import {
  CreateProgressReportApi,
  UpdateProgressReportApi,
} from "../Utils/ApiCalls";

export default function ProgressReportModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,
  // Mode can be "create", "edit", or "view"
  type = "create",
  initialData,
}) {
  // Initial form state: a single field "report"
  const initialFormState = {
    report: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  // Update form state on input change (only enabled in create/edit modes)
  const handleInputChange = (e) => {
    if (type !== "view") {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  // Pre-populate form data if editing or viewing; otherwise reset to initial state.
  useEffect(() => {
    if (isOpen) {
      if ((type === "edit" || type === "view") && initialData) {
        setFormData({
          report: initialData.report || "",
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, type, initialData]);

  const handleSubmit = async () => {
    // In view mode, just close the modal.
    if (type === "view") {
      onClose();
      return;
    }
    // Ensure the report field is not empty
    if (!formData.report) {
      showToast({ status: "error", message: "Report field is required." });
      return;
    }
    setLoading(true);
    try {
      if (type === "edit") {
        await UpdateProgressReportApi(formData, initialData.id);
        showToast({
          status: "success",
          message: "Progress report updated successfully!",
        });
      } else {
        await CreateProgressReportApi(formData, admissionId);
        showToast({
          status: "success",
          message: "Progress report created successfully!",
        });
      }
      if (onSuccess) onSuccess();
      onClose();
      setFormData(initialFormState);
    } catch (error) {
      showToast({
        status: "error",
        message: `Failed to ${type === "edit" ? "update" : "create"} progress report: ${error.message}`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent
          maxW={{ base: "95%", md: "60%" }}
          maxH={{ base: "90vh", md: "auto" }}
        >
          <ModalHeader fontSize={{ base: "lg", md: "xl" }}>
            {type === "edit"
              ? "Edit Progress Report"
              : type === "view"
              ? "View Progress Report"
              : "Create Progress Report"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Report</FormLabel>
              <Textarea
                name="report"
                value={formData.report}
                onChange={handleInputChange}
                placeholder="Enter progress report details..."
                isReadOnly={type === "view"}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            {type === "view" ? (
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            ) : (
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                disabled={loading || !formData.report}
                isLoading={loading}
              >
                {type === "edit" ? "Update" : "Submit"}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
