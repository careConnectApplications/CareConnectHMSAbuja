import { HStack, Text, Box, Flex, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import Button from "../Components/Button";
import Input from "../Components/Input";
import { MdLock } from "react-icons/md";
import ShowToast from "../Components/ToastNotification";
import { UpdatePasswordApi } from "../Utils/ApiCalls";

export default function PasswordReset() {
  // Retrieve the online user from localStorage to extract the userId
  const onlineUser = JSON.parse(localStorage.getItem("onlineUser"));

  const [payload, setPayload] = useState({
    currentPassword: "",
    newPassword: ""
  });
  const [toast, setToast] = useState(null);

  const handlePayload = (e) => {
    setPayload({ ...payload, [e.target.id]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      // Pass both the payload and the userId to the API call
      const result = await UpdatePasswordApi(payload, onlineUser._id);
      
      if (result.status) {
        // On successful update, encode the new password and save it to localStorage
        localStorage.setItem("password", btoa(payload.newPassword));
        setToast({ status: "success", message: result.msg || "Password updated successfully!" });
        // Clear the input fields
        setPayload({ currentPassword: "", newPassword: "" });
      } else {
        setToast({ status: "error", message: result.msg || "Failed to update password." });
      }
    } catch (e) {
      console.error("Error updating password", e);
      setToast({ status: "error", message: e.message || "An error occurred while updating your password." });
    } finally {
      // Clear the toast after 2 seconds
      setTimeout(() => {
        setToast(null);
      }, 2000);
    }
  };

  return (
    <Box
      mt="12px"
      bg="#fff"
      border="2px solid #EFEFEF"
      py="30px"
      px={["8px", "8px", "18px", "18px"]}
      rounded="10px"
    >
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Text fontSize="17px" fontWeight="600" lineHeight="20.57px" color="#1F2937">
        Password Reset
      </Text>
      <Text fontSize="13px" fontWeight="400" lineHeight="27px" color="#626974">
        Update your password
      </Text>

      <Stack mt="20px" spacing="15px" w="100%">
        <HStack justifyContent="space-between" w="100%">
          <Box w="30%">
            <Text fontSize="14px" fontWeight="500" lineHeight="22px" color="#1F2937">
              Current Password
            </Text>
          </Box>
          <Box w="70%">
            <Input
              leftIcon={<MdLock />}
              label="Current Password"
              type="password"
              value={payload.currentPassword}
              onChange={handlePayload}
              id="currentPassword"
            />
          </Box>
        </HStack>

        <HStack justifyContent="space-between" w="100%">
          <Box w="30%">
            <Text fontSize="14px" fontWeight="500" lineHeight="22px" color="#1F2937">
              New Password
            </Text>
          </Box>
          <Box w="70%">
            <Input
              leftIcon={<MdLock />}
              label="New Password"
              type="password"
              value={payload.newPassword}
              onChange={handlePayload}
              id="newPassword"
            />
          </Box>
        </HStack>
      </Stack>
      
      <Flex justifyContent="flex-end" alignItems="center" mt="20px">
        <Button w="10%" onClick={handleUpdate}>Update Password</Button>
      </Flex>
    </Box>
  );
}
