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
  useDisclosure,
} from "@chakra-ui/react";
import Button from "./Button";
import TextArea from "./TextArea";
import { ProcessChemicalPathologyReportApi } from "../Utils/ApiCalls";
import ShowToast from "./ToastNotification";
import { MdLocalPrintshop } from "react-icons/md";
import { useNavigate } from "react-router-dom";

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
  const [testResults, setTestResults] = useState([]);
  const [patientName, setPatientName] = useState("");
  const navigate = useNavigate();

  const showToast = (status, message) => {
    setToast({ status, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!isOpen) {
      setComment("");
      setTestResults([]);
      setPatientName("");
      return;
    }

    if (oldPayload) {
      setComment(oldPayload.comment || "");
      const results = Array.isArray(oldPayload.testresult)
        ? oldPayload.testresult
        : oldPayload.testresult
        ? [oldPayload.testresult]
        : [];
      setTestResults(results);
      setPatientName(oldPayload.patientName || "");
    }
  }, [isOpen, oldPayload, type]);

  const handleSubmit = () => {
    setLoading(true);
    const reportPayload = {
      comment: comment,
    };

    ProcessChemicalPathologyReportApi(testId, reportPayload)
      .then((result) => {
        if (result.status === 200) {
          localStorage.setItem(
            `chemical_pathology_comment_${testId}`,
            comment || ""
          );
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
      })
      .catch((e) => {
        showToast("error", e.message);
        activateNotifications(e.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "60%" }}>
        <ModalHeader>
          {type === "new"
            ? `Process Chemical Pathology Report for ${patientName}`
            : type === "edit"
            ? `Edit Chemical Pathology Report for ${patientName}`
            : `View Chemical Pathology Report for ${patientName}`}
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
  );
}
