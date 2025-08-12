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
  CreateWardRoundApi,
  UpdateWardRoundApi,
} from "../Utils/ApiCalls";
    

export default function WardRoundModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,
  // Mode can be "create", "edit", or "view"
  type = "create",
  initialData,
}) {
  // Initial form state: a single field "admissionNote"
  const initialFormState = {
    admissionNote: "",
    admissionId: admissionId,
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
          admissionNote: initialData.admissionNote || "",
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
    // Ensure the admissionNote field is not empty
    if (!formData.admissionNote) {
      showToast({ status: "error", message: "Admission note field is required." });
      return;
    }
    setLoading(true);
    try {
      if (type === "edit") {
        await UpdateWardRoundApi(formData, initialData._id);
        showToast({
          status: "success",
          message: "Ward round updated successfully!",
        });
      } else {
        await CreateWardRoundApi(formData);
        showToast({
          status: "success",
          message: "Ward round created successfully!",
        });
      }
      if (onSuccess) onSuccess();
      onClose();
      setFormData(initialFormState);
    } catch (error) {
      showToast({
        status: "error",
        message: `Failed to ${type === "edit" ? "update" : "create"} ward round: ${error.message}`,
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
              ? "Edit Ward Round"
              : type === "view"
              ? "View Ward Round"
              : "Create Ward Round"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Admission Note</FormLabel>
              <Textarea
                name="admissionNote"
                value={formData.admissionNote}
                onChange={handleInputChange}
                placeholder="Enter doctor's observation note..."
                isReadOnly={type === "view"}
                rows={6}
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
                disabled={loading || !formData.admissionNote}
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
