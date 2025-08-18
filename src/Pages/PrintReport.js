import {
    Box,
    Text,
    Image,
    Flex,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    HStack,
    Spacer,
  } from "@chakra-ui/react";
  import React, { useState, useEffect } from "react";
  import Button from "../Components/Button";
  import { IoMdArrowRoundBack } from "react-icons/io";
  import { MdLocalPrintshop } from "react-icons/md";
  import { useNavigate } from "react-router-dom";
  import logo from "../Assets/carelogo.png";
  import { FacilityName } from "../Utils/ApiConfig";
  
  export default function PrintReport() {
    const nav = useNavigate();
    const [Hide, setHide] = useState(false);
    const [PrintData, setPrintData] = useState({});
    const [TestResults, setTestResults] = useState([]);
  
    const printNow = () => {
      setHide(true);
      setTimeout(() => {
        window.print();
      }, 1000);
      setTimeout(() => {
        setHide(false);
      }, 2000);
    };
  
    useEffect(() => {
      const data = JSON.parse(localStorage.getItem("printData"));
      setPrintData(data);
      const results = Array.isArray(data.testresult)
        ? data.testresult
        : data.testresult
        ? [data.testresult]
        : [];
      setTestResults(results);
    }, []);
  
    return (
      <Box px="6%" mt="32px">
        {Hide === false && (
          <HStack mb="12px">
            <Button
              leftIcon={<IoMdArrowRoundBack />}
              w="150px"
              onClick={() => nav(-1)}
            >
              Back
            </Button>
            <Spacer />
            <Button w="150px" rightIcon={<MdLocalPrintshop />} onClick={printNow}>
              Print
            </Button>
          </HStack>
        )}
        <Flex justifyContent="center">
          <Image src={logo} width={"10%"} onClick={() => nav("/")} />
        </Flex>
        <Text
          textAlign="center"
          fontSize="20px"
          textTransform="uppercase"
          fontWeight="900"
          color="#242424"
        >
          {FacilityName}
        </Text>
        <Text
          textAlign="center"
          fontSize="16px"
          textTransform="uppercase"
          fontWeight="500"
          color="#242424"
        >
          {PrintData.summary
            ? "Peripheral Blood Film Report"
            : PrintData.clinicalnotes
            ? "ADH Bone Marrow Aspiration Report"
            : PrintData.comment
            ? "Chemical Pathology Report"
            : `${PrintData.testname} Report`}
        </Text>
        <Flex justifyContent="space-between" mt={4} mb={4}>
          <Box>
            <Text>
              <Text as="span" fontWeight="bold">
                Patient Name:
              </Text>{" "}
              {PrintData.patientName}
            </Text>
          </Box>
          <Box>
            <Text>
              <Text as="span" fontWeight="bold">
                Patient ID:
              </Text>{" "}
              {PrintData.patientId}
            </Text>
          </Box>
        </Flex>
        <Box border="1px solid #ccc" borderRadius="md" p={4}>
          {TestResults.length > 0 && (
            <Box mb={4}>
              <Text fontWeight="bold" mb={2} fontSize="lg">
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
                    {TestResults.map((result, index) => (
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
          <Box mt={4}>
            {PrintData.comment && (
              <>
                <Text fontWeight="bold">Comment:</Text>
                <Text>{PrintData.comment}</Text>
              </>
            )}

            {PrintData.clinicalnotes && (
              <>
                <Text fontWeight="bold">Clinical Notes:</Text>
                <Text whiteSpace="pre-wrap">
                  {Array.isArray(PrintData.clinicalnotes)
                    ? PrintData.clinicalnotes.join("\n")
                    : PrintData.clinicalnotes}
                </Text>
                <Text fontWeight="bold">Bone Consistency:</Text>
                <Text>{PrintData.boneconsistency}</Text>
                <Text fontWeight="bold">Aspiration:</Text>
                <Text>{PrintData.aspiration}</Text>
                <Text fontWeight="bold">Erythroid Ratio:</Text>
                <Text>{PrintData.erythroidratio}</Text>
                <Text fontWeight="bold">Erythropoiesis:</Text>
                <Text whiteSpace="pre-wrap">
                  {Array.isArray(PrintData.erythropoiesis)
                    ? PrintData.erythropoiesis.join("\n")
                    : PrintData.erythropoiesis}
                </Text>
                <Text fontWeight="bold">Leucopoesis:</Text>
                <Text whiteSpace="pre-wrap">
                  {Array.isArray(PrintData.leucopoesis)
                    ? PrintData.leucopoesis.join("\n")
                    : PrintData.leucopoesis}
                </Text>
                <Text fontWeight="bold">Megakaryopoiesis:</Text>
                <Text whiteSpace="pre-wrap">
                  {Array.isArray(PrintData.megakaryopoiesis)
                    ? PrintData.megakaryopoiesis.join("\n")
                    : PrintData.megakaryopoiesis}
                </Text>
                <Text fontWeight="bold">Plasma Cells:</Text>
                <Text whiteSpace="pre-wrap">
                  {Array.isArray(PrintData.plasmacells)
                    ? PrintData.plasmacells.join("\n")
                    : PrintData.plasmacells}
                </Text>
                <Text fontWeight="bold">Abnormal Cells:</Text>
                <Text>{PrintData.abnormalcells}</Text>
                <Text fontWeight="bold">Iron Store:</Text>
                <Text>{PrintData.ironstore}</Text>
                <Text fontWeight="bold">Conclusion:</Text>
                <Text whiteSpace="pre-wrap">
                  {Array.isArray(PrintData.conclusion)
                    ? PrintData.conclusion.join("\n")
                    : PrintData.conclusion}
                </Text>
              </>
            )}

            {PrintData.summary && (
              <>
                <Text fontWeight="bold">Summary:</Text>
                <Text whiteSpace="pre-wrap">
                  {Array.isArray(PrintData.summary)
                    ? PrintData.summary.join("\n")
                    : PrintData.summary}
                </Text>
                <Text fontWeight="bold">Red Blood Cell:</Text>
                <Text whiteSpace="pre-wrap">
                  {Array.isArray(PrintData.redbloodcell)
                    ? PrintData.redbloodcell.join("\n")
                    : PrintData.redbloodcell}
                </Text>
                <Text fontWeight="bold">White Blood Cell:</Text>
                <Text whiteSpace="pre-wrap">
                  {Array.isArray(PrintData.whitebloodcell)
                    ? PrintData.whitebloodcell.join("\n")
                    : PrintData.whitebloodcell}
                </Text>
                <Text fontWeight="bold">Platelet:</Text>
                <Text whiteSpace="pre-wrap">
                  {Array.isArray(PrintData.platelet)
                    ? PrintData.platelet.join("\n")
                    : PrintData.platelet}
                </Text>
                <Text fontWeight="bold">Impression:</Text>
                <Text whiteSpace="pre-wrap">
                  {Array.isArray(PrintData.impression)
                    ? PrintData.impression.join("\n")
                    : PrintData.impression}
                </Text>
                <Text fontWeight="bold">Suggestion:</Text>
                <Text whiteSpace="pre-wrap">
                  {Array.isArray(PrintData.suggestion)
                    ? PrintData.suggestion.join("\n")
                    : PrintData.suggestion}
                </Text>
              </>
            )}
          </Box>
        </Box>
      </Box>
    );
  }
