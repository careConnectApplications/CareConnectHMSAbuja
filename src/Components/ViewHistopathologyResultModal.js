import {
  HStack,
  Text,
  Box,
  SimpleGrid,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Heading,
} from "@chakra-ui/react";
import React from "react";

export default function ViewHistopathologyResultModal({
  isOpen,
  onClose,
  Resultdata,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="90vh" overflowY="auto">
        <ModalHeader>
          Histopathology Result for {Resultdata?.testTypeId}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <Box>
              <Text fontWeight="bold">First Day of LMP:</Text>
              <Text>{new Date(Resultdata?.firstDayLMP).toLocaleDateString()}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Parity:</Text>
              <Text>{Resultdata?.parity}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Post-Menopausal:</Text>
              <Text>{Resultdata?.postMenopausal ? "Yes" : "No"}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Oral Contraceptive:</Text>
              <Text>{Resultdata?.oralContraceptive ? "Yes" : "No"}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">IUD in Place:</Text>
              <Text>{Resultdata?.IUDInPlace ? "Yes" : "No"}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Pregnant:</Text>
              <Text>{Resultdata?.pregnant ? "Yes" : "No"}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Postpartum:</Text>
              <Text>{Resultdata?.postpartum ? "Yes" : "No"}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Hysterectomy:</Text>
              <Text>{Resultdata?.hysterectomy ? "Yes" : "No"}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Liquid Prep:</Text>
              <Text>{Resultdata?.LiquidPrep ? "Yes" : "No"}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Cyto Brush:</Text>
              <Text>{Resultdata?.CytoBrush ? "Yes" : "No"}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Routine Pap:</Text>
              <Text>{Resultdata?.RoutinePap ? "Yes" : "No"}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Previous:</Text>
              <Text>{Resultdata?.Previous ? "Yes" : "No"}</Text>
            </Box>
          </SimpleGrid>

          <Box mt={6}>
            <Heading size="md" mb={4}>Cytology Report</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontWeight="bold">Adequancy:</Text>
                <Text>{Resultdata?.cytologyReport?.adequancy}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Hormonal Evaluation:</Text>
                <Text>{Resultdata?.cytologyReport?.hormEvaluation}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Microbial Flora:</Text>
                <Text>{Resultdata?.cytologyReport?.microbialFlora}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Special Features:</Text>
                <Text>{Resultdata?.cytologyReport?.specialFeatures}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">HPV Results:</Text>
                <Text>{Resultdata?.cytologyReport?.hpvResults}</Text>
              </Box>
            </SimpleGrid>
            <Box mt={4}>
              <Text fontWeight="bold">Diagnosis:</Text>
              <Text>{Resultdata?.cytologyReport?.diagnosis}</Text>
            </Box>
            <Box mt={4}>
              <Text fontWeight="bold">Recommendation:</Text>
              <Text>{Resultdata?.cytologyReport?.recommendation}</Text>
            </Box>
          </Box>

          <Box mt={6}>
            <Heading size="md" mb={4}>Pathologist Report</Heading>
            <Box mt={4}>
              <Text fontWeight="bold">Macroscopic:</Text>
              <Text>{Resultdata?.pathologistReport?.macro}</Text>
            </Box>
            <Box mt={4}>
              <Text fontWeight="bold">Microscopic:</Text>
              <Text>{Resultdata?.pathologistReport?.micro}</Text>
            </Box>
            <Box mt={4}>
              <Text fontWeight="bold">Diagnosis:</Text>
              <Text>{Resultdata?.pathologistReport?.diagnosis}</Text>
            </Box>
            <Box mt={4}>
              <Text fontWeight="bold">Comment:</Text>
              <Text>{Resultdata?.pathologistReport?.comment}</Text>
            </Box>
            <Box mt={4}>
              <Text fontWeight="bold">Sonographic Findings:</Text>
              <Text>{Resultdata?.pathologistReport?.sonographicFindings}</Text>
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
