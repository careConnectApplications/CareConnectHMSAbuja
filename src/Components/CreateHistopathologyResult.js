import {
  HStack,
  Text,
  Select,
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
import React, { useState, useEffect } from "react";
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import { ProcessHistopathologyApi } from "../Utils/ApiCalls";
import { SlPlus } from "react-icons/sl";
import { MdOutlineDateRange } from "react-icons/md";
import { FaNoteSticky } from "react-icons/fa6";

export default function CreateHistopathologyResult({
  isOpen,
  onClose,
  activateNotifications,
  oldPayload,
}) {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({

    firstDayLMP: "",
    postMenopausal: "",
    oralContraceptive: "",
    IUDInPlace: "",
    parity: "",
    pregnant: "",
    postpartum: "",
    hysterectomy: "",
    LiquidPrep: "",
    CytoBrush: "",
    RoutinePap: "",
    Previous: "",
    cytologyReport: {
      adequancy: "",
      hormEvaluation: "",
      microbialFlora: "",
      specialFeatures: "",
      diagnosis: "",
      hpvResults: "",
      recommendation: "",
    },
    pathologistReport: {
      macro: "",
      micro: "",
      diagnosis: "",
      comment: "",
      sonographicFindings: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPayload((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (section, e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const finalPayload = {
      ...payload,
      histopathologyId: oldPayload.histopathologyId,
      serviceName: oldPayload.serviceName,
      testTypeId: oldPayload?.testName,
      parity: payload.parity || 0,
    };

    console.log("Final Payload:", finalPayload);

    try {

      const result = await ProcessHistopathologyApi(finalPayload, oldPayload._id);
      console.log("API Response:", result);
      if (result.status === 201) {
        setLoading(false);
        onClose();
        activateNotifications("Histopathology Result Submitted Successfully", "success");
      }
    } catch (e) {
      console.error("Error submitting histopathology result:", e);
      setLoading(false);
      activateNotifications(e.message, "error");
    }
  };

  useEffect(() => {
    
  }, [oldPayload]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="90vh" overflowY="auto">
        <ModalHeader>
          Process Histopathology Result for {oldPayload?.testName}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <Input
              label="First Day of LMP"
              type="date"
              name="firstDayLMP"
              leftIcon={<MdOutlineDateRange />}
              value={payload.firstDayLMP.split("T")[0]}
              onChange={handleChange}
            />
            <Input
              label="Parity"
              type="number"
              name="parity"
              leftIcon={<FaNoteSticky />}
              value={payload.parity}
              onChange={handleChange}
            />
            <Select placeholder="Post-Menopausal" name="postMenopausal" value={payload.postMenopausal} onChange={handleChange}>
              <option value={true}>Post-Menopausal: Yes</option>
              <option value={false}>Post-Menopausal: No</option>
            </Select>
            <Select placeholder="Oral Contraceptive" name="oralContraceptive" value={payload.oralContraceptive} onChange={handleChange}>
              <option value="Yes">Oral Contraceptive: Yes</option>
              <option value="No">Oral Contraceptive: No</option>
            </Select>
            <Select placeholder="IUD" name="IUDInPlace" value={payload.IUDInPlace} onChange={handleChange}>
              <option value="Yes">IUD in Place: Yes</option>
              <option value="No">IUD in Place: No</option>
            </Select>
            <Select placeholder="Pregnant" name="pregnant" value={payload.pregnant} onChange={handleChange}>
              <option value="Yes">Pregnant: Yes</option>
              <option value="No">Pregnant: No</option>
            </Select>
            <Select placeholder="Postpartum" name="postpartum" value={payload.postpartum} onChange={handleChange}>
              <option value="Yes">Postpartum: Yes</option>
              <option value="No">Postpartum: No</option>
            </Select>
            <Select placeholder="Hysterectomy" name="hysterectomy" value={payload.hysterectomy} onChange={handleChange}>
              <option value="Yes">Hysterectomy: Yes</option>
              <option value="No">Hysterectomy: No</option>
            </Select>
            <Select placeholder="LiquidPrep" name="LiquidPrep" value={payload.LiquidPrep} onChange={handleChange}>
              <option value="Yes">Liquid Prep: Yes</option>
              <option value="No">Liquid Prep: No</option>
            </Select>
            <Select placeholder="CytoBrush" name="CytoBrush" value={payload.CytoBrush} onChange={handleChange}>
              <option value="Yes">Cyto Brush: Yes</option>
              <option value="No">Cyto Brush: No</option>
            </Select>
            <Select placeholder="RoutinePap" name="RoutinePap" value={payload.RoutinePap} onChange={handleChange}>
              <option value="Yes">Routine Pap: Yes</option>
              <option value="No">Routine Pap: No</option>
            </Select>
            <Select placeholder="Previous" name="Previous" value={payload.Previous} onChange={handleChange}>
              <option value="Yes">Previous: Yes</option>
              <option value="No">Previous: No</option>
            </Select>
          </SimpleGrid>

          <Box mt={6}>
            <Heading size="md" mb={4}>Cytology Report</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Input
                label="Adequancy"
                name="adequancy"
                leftIcon={<FaNoteSticky />}
                value={payload.cytologyReport.adequancy}
                onChange={(e) => handleNestedChange("cytologyReport", e)}
              />
              <Input
                label="Hormonal Evaluation"
                name="hormEvaluation"
                leftIcon={<FaNoteSticky />}
                value={payload.cytologyReport.hormEvaluation}
                onChange={(e) => handleNestedChange("cytologyReport", e)}
              />
              <Input
                label="Microbial Flora"
                name="microbialFlora"
                leftIcon={<FaNoteSticky />}
                value={payload.cytologyReport.microbialFlora}
                onChange={(e) => handleNestedChange("cytologyReport", e)}
              />
              <Input
                label="Special Features"
                name="specialFeatures"
                leftIcon={<FaNoteSticky />}
                value={payload.cytologyReport.specialFeatures}
                onChange={(e) => handleNestedChange("cytologyReport", e)}
              />
              <Input
                label="HPV Results"
                name="hpvResults"
                leftIcon={<FaNoteSticky />}
                value={payload.cytologyReport.hpvResults}
                onChange={(e) => handleNestedChange("cytologyReport", e)}
              />


            </SimpleGrid>

            <SimpleGrid mt={10} columns={{ base: 1, md: 1 }} spacing={10}>
              <TextArea
                label="Diagnosis"
                name="diagnosis"
                value={payload.cytologyReport.diagnosis}
                onChange={(e) => handleNestedChange("cytologyReport", e)}
                mt={4}
              />
              <TextArea
                label="Recommendation"
                name="recommendation"
                value={payload.cytologyReport.recommendation}
                onChange={(e) => handleNestedChange("cytologyReport", e)}
                mt={4}
              />
            </SimpleGrid>

          </Box>

          <Box mt={6}>
            <Heading size="md" mb={4}>Pathologist Report</Heading>
            <SimpleGrid mt={10} columns={{ base: 1, md: 2 }} spacing={10}>
              <TextArea
                label="Macroscopic"
                name="macro"
                value={payload.pathologistReport.macro}
                onChange={(e) => handleNestedChange("pathologistReport", e)}
              />
              <TextArea
                label="Microscopic"
                name="micro"
                value={payload.pathologistReport.micro}
                onChange={(e) => handleNestedChange("pathologistReport", e)}
              />

               <TextArea
              label="Diagnosis"
              name="diagnosis"
              value={payload.pathologistReport.diagnosis}
              onChange={(e) => handleNestedChange("pathologistReport", e)}
              mt={4}
            />
            <TextArea
              label="Comment"
              name="comment"
              value={payload.pathologistReport.comment}
              onChange={(e) => handleNestedChange("pathologistReport", e)}
              mt={4}
            />
            <TextArea
              label="Sonographic Findings"
              name="sonographicFindings"
              value={payload.pathologistReport.sonographicFindings}
              onChange={(e) => handleNestedChange("pathologistReport", e)}
              mt={4}
            />
            </SimpleGrid>
           
          </Box>

          <Button mt="32px" onClick={handleSubmit} isLoading={loading} w="full">
            Submit Histopathology Result
          </Button>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
