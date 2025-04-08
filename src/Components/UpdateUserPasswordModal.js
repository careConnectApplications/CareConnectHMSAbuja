import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  InputGroup,
  InputLeftElement,
  Icon,
  Text,
} from "@chakra-ui/react";
import Button from "./Button";
import Input from "./Input";
import ShowToast from "./ToastNotification";
import { UpdateUserPasswordApi } from "../Utils/ApiCalls";
import { FaLock } from "react-icons/fa";

export default function UpdateUserPasswordModal({ isOpen, onSuccess, onClose, tempToken }) {
  const [formData, setFormData] = useState({ password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (formData.password.trim() === "") {
      showToast({ status: "error", message: "Password cannot be empty." });
      return;
    }
    setLoading(true);
    try {
      // Retrieve the online user from localStorage and extract the user id.
      const storedUser = localStorage.getItem("onlineUser");
      const userId = storedUser ? JSON.parse(storedUser)._id : null;
      if (!userId) {
        throw new Error("User not found in local storage.");
      }
      const response = await UpdateUserPasswordApi(formData, userId,tempToken);
      // Extract updated user details from the API response.
      const { queryresult } = response.data;
      // Base64 encode the password.
      const encodedPassword = btoa(queryresult.password);
      // Save the email and encoded password to localStorage.
      localStorage.setItem("email", queryresult.email);
      localStorage.setItem("password", encodedPassword);
      showToast({ status: "success", message: "Password updated successfully!" });
      if (onSuccess) {
        onSuccess();
      }
      setFormData({ password: "" });
    } catch (error) {
      showToast({ status: "error", message: `Failed to update password: ${error.message}` });
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
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isCentered
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Your Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              You are logging in for the first time. Please update your password from the default one provided. This step is required to access the application.
            </Text>
            <FormControl>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaLock} color="gray.300" />
                </InputLeftElement>
                <Input
                  label="New Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                />
              </InputGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              disabled={formData.password.trim() === "" || loading}
              isLoading={loading}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
