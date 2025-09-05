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

export default function ViewLabResultModal({
  isOpen,
  onClose,
  oldPayload = {},
}) {
  const [testResults, setTestResults] = useState([]);
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setTestResults([]);
      setPatientName("");
      return;
    }

    if (oldPayload) {
      const results = Array.isArray(oldPayload.testresult)
        ? oldPayload.testresult
        : oldPayload.testresult
        ? [oldPayload.testresult]
        : [];
      setTestResults(results);
      setPatientName(oldPayload.patientName || "");
    }
  }, [isOpen, oldPayload]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "60%" }}>
        <ModalHeader>View Lab Result for {patientName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={6}>
            {testResults.length > 0 ? (
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
            ) : (
              <Text>No test results available.</Text>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
