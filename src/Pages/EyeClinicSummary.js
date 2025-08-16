import React from "react";
import { Box, Text } from "@chakra-ui/react";
import MainLayout from "../Layouts/Index";
import EyePreliminaryTest from "./EyePreliminaryTest";
import EyeExamination from "./EyeExamination";
import OperationNotes from "./OperationNotes";
import LensPrescription from "./LensPrescription";
import EyeConsultation from "./EyeConsultation";
import Seo from "../Utils/Seo";

export default function EyeClinicSummary() {
  return (
    <MainLayout>
      <Seo title="Eye Clinic Summary" description="A summary of all eye clinic records" />
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Eye Clinic Summary
      </Text>
      <Box mb={8}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          Preliminary Tests
        </Text>
        <EyePreliminaryTest hide={true} />
      </Box>
      <Box mb={8}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          Eye Examination
        </Text>
        <EyeExamination hide={true} />
      </Box>
      <Box mb={8}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          Operation Notes
        </Text>
        <OperationNotes hide={true} />
      </Box>
      <Box mb={8}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          Lens Prescription
        </Text>
        <LensPrescription hide={true} />
      </Box>
      <Box>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          Eye Consultation
        </Text>
        <EyeConsultation hide={true} />
      </Box>
    </MainLayout>
  );
}
