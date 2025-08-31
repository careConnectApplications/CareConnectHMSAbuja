import { Text, Box, Flex, Stack, SimpleGrid, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, HStack, Checkbox } from '@chakra-ui/react'
import React, { useState } from 'react'
import MainLayout from "../Layouts/Index";
import { useColors } from '../Utils/colors';
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TextArea from "../Components/TextArea";
import ShowToast from "../Components/ToastNotification";
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { AddAnaesthesiaFormAPI } from "../Utils/ApiCalls";

export default function AddAnaesthesiaForm() {
  const {
    bgColor,
    textColor,
    borderColor,
    titleTextColor,
    subTitleTextColor,
    primaryColor,
    secondaryColor,
    NavListBg,
  } = useColors();
  const { id } = useParams();
  const nav = useNavigate();
  const pathName = localStorage.getItem("pathname") || "/";

  const [payload, setPayload] = useState({
    preopeassessment: "",
    allergies: "",
    weight: "",
    asa: "",
    temp: "",
    premedication: "",
    timegivenpremedication: "",
    timeoflastfood: "",
    vlinesite: "",
    cannulasize: "",
    bloodloss: "",
    totalinput: "",
  });

  const [Technique, setTechnique] = useState([]);
  const [techniqueNote, setTechniqueNote] = useState("");

  const [PostInstructions, setPostInstructions] = useState([]);
  const [postInstructionNote, setPostInstructionNote] = useState("");

  const [Monitors, setMonitors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", status: "" });

  const handleScalarChange = (e) => {
    setPayload(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const addTechnique = () => {
    if (!techniqueNote.trim()) return;
    setTechnique([...Technique, techniqueNote.trim()]);
    setTechniqueNote("");
  };
  const removeTechnique = (item) => {
    setTechnique(Technique.filter(t => t !== item));
  };

  const addPostInstruction = () => {
    if (!postInstructionNote.trim()) return;
    setPostInstructions([...PostInstructions, postInstructionNote.trim()]);
    setPostInstructionNote("");
  };
  const removePostInstruction = (item) => {
    setPostInstructions(PostInstructions.filter(p => p !== item));
  };

  const handleMonitorChange = (monitor) => {
    setMonitors(prev =>
      prev.includes(monitor)
        ? prev.filter(item => item !== monitor)
        : [...prev, monitor]
    );
  };

  const monitorOptions = ["ECG", "NIBP", "SPO2", "TEMP", "EtCO2"];

  const showNotification = (message, status) => {
    setToast({ show: true, message, status });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fullPayload = {
        ...payload,
        technique: Technique,
        postofinstruction: PostInstructions,
        monitors: Monitors,
      };
      const res = await AddAnaesthesiaFormAPI(fullPayload, id);
      if (res.status === 200) {
        showNotification("Anaesthesia form submitted", "success");
        setTimeout(() => nav(pathName), 2000);
      }
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {toast.show && <ShowToast message={toast.message} status={toast.status} />}
      <Seo title="Add Anaesthesia Form" description="Care Connect Theatre Anaesthesia Form" />

      <HStack>
        <Text color={titleTextColor} fontWeight="600" fontSize="18px">
          Anaesthesia Form
        </Text>
      </HStack>
      <Text color={subTitleTextColor} mt="9px" fontWeight="400" fontSize="12px">
        Create, View and manage all Anaesthesia Forms in one place.
      </Text>

      <Box
        bg={bgColor}
        border={`1px solid ${borderColor}`}
        mt="12px"
        py="17px"
        px={["18px", "18px"]}
        rounded="10px"
      >
        <Button
          leftIcon={<IoMdArrowRoundBack />}
          px="40px"
          w="100px"
          onClick={() => nav(pathName)}
        >
          Back
        </Button>

        <Accordion allowToggle mt="32px">
          {/* Basic Details */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: `1px solid ${primaryColor}`, color: textColor }}
              _focus={{ outline: "none" }}
              border={`1px solid ${borderColor}`}
              _expanded={{ rounded: "8px 8px 0 0", border: 0 }}
              bg={bgColor}
              color={textColor}
              rounded="8px"
            >
              <Box flex="1" textAlign="left">Anaesthesia Details</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg={bgColor} rounded="0 0 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt="32px">
                <Input bColor={borderColor} id="preopeassessment" label="Pre-op Assessment" value={payload.preopeassessment} onChange={handleScalarChange} />
                <Input bColor={borderColor} id="allergies" label="Allergies" value={payload.allergies} onChange={handleScalarChange} />
                <Input bColor={borderColor} id="weight" label="Weight" value={payload.weight} onChange={handleScalarChange} />
                <Input bColor={borderColor} id="asa" label="ASA Grade" value={payload.asa} onChange={handleScalarChange} />
                <Input bColor={borderColor} id="temp" label="Temperature" value={payload.temp} onChange={handleScalarChange} />
                <Input bColor={borderColor} id="premedication" label="Premedication" value={payload.premedication} onChange={handleScalarChange} />
                <Input bColor={borderColor} id="timegivenpremedication" label="Time Given Premedication" type="date" value={payload.timegivenpremedication} onChange={handleScalarChange} />
                <Input bColor={borderColor} id="timeoflastfood" label="Time of Last Food" type="date" value={payload.timeoflastfood} onChange={handleScalarChange} />
                <Input bColor={borderColor} id="vlinesite" label="V-line Site" value={payload.vlinesite} onChange={handleScalarChange} />
                <Input bColor={borderColor} id="cannulasize" label="Cannula Size" value={payload.cannulasize} onChange={handleScalarChange} />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Technique */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: `1px solid ${primaryColor}`, color: textColor }}
              _focus={{ outline: "none" }}
              border={`1px solid ${borderColor}`}
              _expanded={{ rounded: "8px 8px 0 0", border: 0 }}
              bg={bgColor}
              color={textColor}
              rounded="8px"
            >
              <Box flex="1" textAlign="left">Technique</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg={bgColor} rounded="0 0 8px 8px">
              <Stack spacing={4} pt="10">
                <TextArea
                  bColor={borderColor}
                  label="Technique Note"
                  value={techniqueNote}
                  onChange={e => setTechniqueNote(e.target.value)}
                />
              </Stack>
              <Flex justify="flex-end" mt="2">
                <Button onClick={addTechnique} w={["100%", "100%", "184px", "184px"]}>Add</Button>
              </Flex>
              <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                {Technique.map((item, i) => (
                  <Flex
                    key={i}
                    cursor="pointer"
                    px="10px"
                    py="10px"
                    rounded="20px"
                    fontSize="12px"
                    _hover={{ bg: "blue.blue400" }}
                    bg={primaryColor}
                    w="100%"
                    justify="space-between"
                    align="center"
                  >
                    <Text color={bgColor} fontWeight="500" textTransform="capitalize">{item}</Text>
                    <Box fontSize="20px" color={bgColor} onClick={() => removeTechnique(item)}>×</Box>
                  </Flex>
                ))}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Monitors */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: `1px solid ${primaryColor}`, color: textColor }}
              _focus={{ outline: "none" }}
              border={`1px solid ${borderColor}`}
              _expanded={{ rounded: "8px 8px 0 0", border: 0 }}
              bg={bgColor}
              color={textColor}
              rounded="8px"
            >
              <Box flex="1" textAlign="left">Monitors</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg={bgColor} rounded="0 0 8px 8px">
              <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} mt="16px">
                {monitorOptions.map(monitor => (
                  <Checkbox
                    key={monitor}
                    isChecked={Monitors.includes(monitor)}
                    onChange={() => handleMonitorChange(monitor)}
                  >
                    {monitor}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Input / Output */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: `1px solid ${primaryColor}`, color: textColor }}
              _focus={{ outline: "none" }}
              border={`1px solid ${borderColor}`}
              _expanded={{ rounded: "8px 8px 0 0", border: 0 }}
              bg={bgColor}
              color={textColor}
              rounded="8px"
            >
              <Box flex="1" textAlign="left">Input / Output</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg={bgColor} rounded="0 0 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt="32px">
                <Input bColor={borderColor} id="bloodloss" label="Blood Loss" value={payload.bloodloss} onChange={handleScalarChange} />
                <Input bColor={borderColor} id="totalinput" label="Total Input" value={payload.totalinput} onChange={handleScalarChange} />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Post Instructions */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: `1px solid ${primaryColor}`, color: textColor }}
              _focus={{ outline: "none" }}
              border={`1px solid ${borderColor}`}
              _expanded={{ rounded: "8px 8px 0 0", border: 0 }}
              bg={bgColor}
              color={textColor}
              rounded="8px"
            >
              <Box flex="1" textAlign="left">Post Instructions</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg={bgColor} rounded="0 0 8px 8px">
              <Stack spacing={4} pt="10">
                <TextArea
                  bColor={borderColor}
                  label="Post Instruction Note"
                  value={postInstructionNote}
                  onChange={e => setPostInstructionNote(e.target.value)}
                />
              </Stack>
              <Flex justify="flex-end" mt="2">
                <Button onClick={addPostInstruction} w={["100%", "100%", "184px", "184px"]}>Add</Button>
              </Flex>
              <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                {PostInstructions.map((item, i) => (
                  <Flex
                    key={i}
                    cursor="pointer"
                    px="10px"
                    py="10px"
                    rounded="20px"
                    fontSize="12px"
                    _hover={{ bg: "blue.blue400" }}
                    bg={primaryColor}
                    w="100%"
                    justify="space-between"
                    align="center"
                  >
                    <Text color={bgColor} fontWeight="500" textTransform="capitalize">{item}</Text>
                    <Box fontSize="20px" color={bgColor} onClick={() => removePostInstruction(item)}>×</Box>
                  </Flex>
                ))}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Flex justify="center" mt="10px">
          <Button
            w={["100%", "100%", "184px", "184px"]}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Submit
          </Button>
        </Flex>
      </Box>
    </MainLayout>
  )
}
