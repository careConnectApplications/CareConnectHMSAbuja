import { HStack, Text, Select, Stack } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import Button from "./Button";
import Input from "./Input";
import { UpdateTestComponentApi, AddTestComponentApi, SettingsApi } from "../Utils/ApiCalls";
import { FaClipboardList } from "react-icons/fa";

export default function CreateTestComponentModal({ isOpen, onClose, type, activateNotifications, oldPayload }) {
  const [loading, setLoading] = useState(false);
  const [testNames, setTestNames] = useState([]);
  const [payload, setPayload] = useState({
    testname: "",
    subcomponients: ""
  });

  useEffect(() => {
    // When editing, set the existing payload; otherwise, clear it.
    if (type === "edit" && oldPayload) {
      setPayload({
        testname: oldPayload.testname || "",
        subcomponients: oldPayload.subcomponients ? oldPayload.subcomponients.join(", ") : ""
      });
    } else {
      setPayload({
        testname: "",
        subcomponients: ""
      });
    }
  }, [isOpen, type, oldPayload]);

  useEffect(() => {
    // Fetch test names from the settings API
    const fetchTestNames = async () => {
      try {
        const result = await SettingsApi();
        // Assuming the API returns an object with a testnames array
        setTestNames(result.testnames || []);
      } catch (e) {
        console.error("Error fetching test names:", e);
      }
    };
    fetchTestNames();
  }, []);

  const handleChange = (e) => {
    setPayload(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Convert comma separated string into an array and trim extra spaces
      const formattedPayload = {
        testname: payload.testname,
        subcomponients: payload.subcomponients
          .split(',')
          .map(item => item.trim())
          .filter(item => item) // remove any empty strings
      };

      let response;
      if (type === "new") {
        response = await AddTestComponentApi(formattedPayload);
      } else {
        response = await UpdateTestComponentApi(formattedPayload, oldPayload._id);
      }

      if (response.status === 200) {
        activateNotifications(
          type === "new" ? "Test Component Added Successfully" : "Test Component Updated Successfully",
          "success"
        );
        onClose();
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{type === "new" ? "Add New Test Component" : "Edit Test Component"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="15px">
            {/* Test Component Name Dropdown */}
            <Select
              onChange={handleChange}
              id="testname"
              value={payload.testname}
              placeholder="Select Test Name"
              border="2px solid"
              size="lg"
              fontSize={payload.testname ? "16px" : "13px"}
              borderColor="gray.500"
            >
              {testNames.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </Select>

            {/* Subcomponents Input: Comma separated values */}
            <Input
              val={!!payload.subcomponients}
              onChange={handleChange}
              id="subcomponients"
              value={payload.subcomponients}
              label="Subcomponents (comma separated)"
            />
          </Stack>

          <Button mt="32px" isLoading={loading} onClick={handleSubmit}>
            {type === "new" ? "Add Test Component" : "Update Test Component"}
          </Button>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
