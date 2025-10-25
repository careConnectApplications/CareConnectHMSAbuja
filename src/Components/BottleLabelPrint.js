import React from "react";
import { Box, Text, SimpleGrid } from "@chakra-ui/react";

const BottleLabelPrint = React.forwardRef(({ labData }, ref) => {
  const patientName = labData.patient
    ? `${labData.patient.firstName || ""} ${
        labData.patient.lastName || ""
      }`.trim()
    : "N/A";
  const mrn = labData.patient?.MRN || "N/A";
  const testName = labData.testname || "N/A";
  const testId = labData.testid || "N/A";
  const date = labData.createdAt
    ? new Date(labData.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();
  const doctorName = labData.user
    ? `${labData.user.firstName || ""} ${labData.user.lastName || ""}`.trim()
    : "N/A";

  return (
    <Box ref={ref} p="4px" className="label-print-container" border="1px solid gray" rounded="4px">
      <Text
        textAlign="center"
        fontSize="6px"
        textTransform="uppercase"
        fontWeight="900"
        color="#242424"
      >
        LAB SPECIMEN
      </Text>
      <SimpleGrid columns={{ base: 2, md: 2 }} spacing={0.3} mt="4px">
        <Box>
          <Text fontWeight="800" fontSize="7px" textTransform="uppercase">
            Patient:
          </Text>
          <Text fontSize="7px" textTransform="capitalize">{patientName}</Text>
        </Box>
        <Box>
          <Text fontWeight="800" fontSize="7px" textTransform="uppercase">
            MRN:
          </Text>
          <Text fontSize="7px" textTransform="capitalize">{mrn}</Text>
        </Box>
        <Box>
          <Text fontWeight="800" fontSize="7px" textTransform="uppercase">
            Test:
          </Text>
          <Text fontSize="7px" textTransform="capitalize">{testName}</Text>
        </Box>
        <Box>
          <Text fontWeight="800" fontSize="7px" textTransform="uppercase">
            Test ID:
          </Text>
          <Text fontSize="7px" textTransform="capitalize">{testId}</Text>
        </Box>
        <Box>
          <Text fontWeight="800" fontSize="7px" textTransform="uppercase">
            Date:
          </Text>
          <Text fontSize="7px" textTransform="capitalize">{date}</Text>
        </Box>
        <Box>
          <Text fontWeight="800" fontSize="7px" textTransform="uppercase">
            Doctor:
          </Text>
          <Text fontSize="7px" textTransform="capitalize">{doctorName}</Text>
        </Box>
      </SimpleGrid>

      {labData.testresult && labData.testresult.length > 0 && (
        <Box mt="4px">
          <Text
            fontWeight="800"
            fontSize="7px"
            textTransform="uppercase"
            borderTop="1px dashed #000"
            pt="2px"
          >
            Results:
          </Text>
          {labData.testresult.map((result, index) => (
            <Text key={index} fontSize="6px" mt="1px" textTransform="capitalize">
              {result.subcomponent}: {result.result} {result.unit}
            </Text>
          ))}
        </Box>
      )}

      <Box textAlign="center" mt="4px" borderTop="1px dashed #000" pt="2px">
        <Text fontFamily="monospace" fontSize="9px" letterSpacing="0.5px">
          *{testId}*
        </Text>
        <Text fontSize="6px" mt="1px">
          {testId}
        </Text>
      </Box>
    </Box>
  );
});

export default BottleLabelPrint;