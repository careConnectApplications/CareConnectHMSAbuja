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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import Button from "./Button";
import Preloader from "./Preloader";
import TextArea from "./TextArea";
import { ValidateLabResultApi } from "../Utils/ApiCalls";
import { useColors } from "../Utils/colors";

const ValidateLabResultModal = ({
  isOpen,
  onClose,
  oldPayload,
  onValidationSuccess,
  activateNotifications,
}) => {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [patientName, setPatientName] = useState("");
  const { primaryColor, secondaryColor } = useColors();

  useEffect(() => {
    if (!isOpen) {
      setComment("");
      setTestResults([]);
      setPatientName("");
      return;
    }

    if (oldPayload) {
      // Extract test results from oldPayload
      const results = Array.isArray(oldPayload.testresult)
        ? oldPayload.testresult
        : oldPayload.testresult
        ? [oldPayload.testresult]
        : [];
      setTestResults(results);
      
      // Set patient name
      setPatientName(oldPayload.patientName || "");
    }
  }, [isOpen, oldPayload]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { validationremarks: comment };
      await ValidateLabResultApi(oldPayload._id, payload);
      activateNotifications("Lab result validated successfully.", "success");
      onValidationSuccess();
      onClose();
    } catch (error) {
      activateNotifications(
        error.message || "There was an error validating the lab result.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "60%" }}>
        {loading && <Preloader />}
        <ModalHeader>
          Validate Lab Result for {patientName}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={6}>
            {testResults.length > 0 && (
              <Box>
                <Text fontWeight="bold" mb={4}>
                  Test Results
                </Text>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Component</Th>
                        <Th>Result</Th>
                        <Th>Reference Range</Th>
                        <Th>Unit</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {testResults.map((result, index) => (
                        <Tr key={index}>
                          <Td>{result.subcomponent || "Main Result"}</Td>
                          <Td>{result.result || "N/A"}</Td>
                          <Td>{result.nranges || "N/A"}</Td>
                          <Td>{result.unit || "N/A"}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            <Box mb={4}>
              <Text fontWeight="500" mb={2} fontSize="14px">
                Validation Remarks
              </Text>
              <TextArea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter validation remarks here..."
                size="lg"
                border="2px solid"
                borderColor="gray.500"
              />
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button 
            isLoading={loading} 
            onClick={handleSubmit}
            backgroundColor={primaryColor}
            color={secondaryColor}
          >
            Validate
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ValidateLabResultModal;
