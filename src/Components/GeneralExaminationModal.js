import { HStack, Radio, RadioGroup, Text } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Stack, SimpleGrid, Select
} from '@chakra-ui/react'
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import { UpdateExaminedPatientAPI, TakeVitalApi } from "../Utils/ApiCalls";
import { FaTemperatureHigh, FaHeartCircleCheck } from "react-icons/fa6";
import { FaTextHeight, FaHeartbeat } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { GiEnergyBreath } from "react-icons/gi";
import { GiWeight } from "react-icons/gi";
import { TbMichelinStarFilled } from "react-icons/tb";
import { FaNoteSticky } from "react-icons/fa6";
import { FaPercent } from "react-icons/fa";
import { SiHeadspace } from "react-icons/si";

export default function GeneralExaminationModal({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);

    const [ReflexRadio, setReflexRadio] = useState("");
    const [RadioGroups, setRadioGroups] = useState({
        reflexes: "",
        rootingreflexes: "",
        suckreflexes: "",
        mororeflexes: "",
        tonicneckreflexes: "",
        graspreflexes: "",
        steppingreflexes: "",
    });
    
    const handleRadioChange = (value, radioGroup )=>{
        setRadioGroups((prevRadioGroup)=>({
            ...prevRadioGroup,[radioGroup]: value
        }))
        
    }
  

    const [Payload, setPayload] = useState({

        currentlengthheight: "",
        currentlengthheightpercentage: "",
        currentlengthheightenote: "",
        currentweight: "",
        currentweightnote: "",
        percentageofweightexpected: "",
        headcircumference: "",
        anteriorfontanelle: "",
        posteriorfontanelle: "",
        chestcircumference: "",
        limbexamination: "",
        generalnote: "",
        neuronote: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = ()=>{

        const mergedPayload = { ...Payload, ...RadioGroups}
        setOldPayload({...oldPayload, ["paediatricsspecific"]: mergedPayload})
        activateNotifications("Saved Successfully", "success")
        onClose()
    }











    useEffect(() => {


    }, [isOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader> Physical Examination Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">General</Text>

                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>

                        <Input type="number" leftIcon={<FaTextHeight />} label="Current Length/Height" value={Payload.currentlengthheight} onChange={handlePayload} id="currentlengthheight" />
                        <Input type="number" leftIcon={<FaPercent />} label="% of Length/Height Expected" value={Payload.currentlengthheightpercentage} onChange={handlePayload} id="currentlengthheightpercentage" />
                        <Input type="text" leftIcon={<FaNoteSticky />} label="Length/Height Note" value={Payload.currentlengthheightenote} onChange={handlePayload} id="currentlengthheightenote" />
                        <Input type="number" leftIcon={<GiWeight />} label="Current Weight" value={Payload.currentweight} onChange={handlePayload} id="currentweight" />
                        <Input type="number" leftIcon={<FaPercent />} label="% of Weight Expected" value={Payload.percentageofweightexpected} onChange={handlePayload} id="percentageofweightexpected" />
                        <Input type="text" leftIcon={<FaNoteSticky />} label="Weight Note" value={Payload.currentweightnote} onChange={handlePayload} id="currentweightnote" />
                        <Input type="number" leftIcon={<SiHeadspace />} label="Head Circumference" value={Payload.headcircumference} onChange={handlePayload} id="headcircumference" />
                        <Select h="45px" borderWidth="2px" fontSize={Payload.anteriorfontanelle !== "" ? "16px" : "13px"} borderColor="#6B7280" id="anteriorfontanelle" value={Payload.anteriorfontanelle} onChange={handlePayload} placeholder="Anterior Fontanelle" >
                            <option value={`Present`}>Present</option>
                            <option value={`Absent`}>Absent</option>
                        </Select>
                        <Select h="45px" borderWidth="2px" borderColor="#6B7280" fontSize={Payload.posteriorfontanelle !== "" ? "16px" : "13px"} id="posteriorfontanelle" value={Payload.posteriorfontanelle} onChange={handlePayload} placeholder="Posterior Fontanelle" >
                            <option value={`Present`}>Present</option>
                            <option value={`Absent`}>Absent</option>
                        </Select>
                        <Input type="number" leftIcon={<SiHeadspace />} label="Chest Circumference" value={Payload.chestcircumference} onChange={handlePayload} id="chestcircumference" />
                        <Input type="number" leftIcon={<SiHeadspace />} label="Limb's Examination" value={Payload.limbexamination} onChange={handlePayload} id="limbexamination" />
                        <Input type="text" leftIcon={<FaNoteSticky />} label="Additional Note" value={Payload.generalnote} onChange={handlePayload} id="generalnote" />

                    </SimpleGrid>

                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">Neuro</Text>

                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 3}} spacing={5}>
                        <RadioGroup  onChange={(value)=>handleRadioChange(value, 'reflexes')} >
                        <Text fontSize="15px" fontWeight={"700"}>Reflexes</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Normal'>Normal</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Abnormal'>Abnormal</Radio>
                               
                            </Stack>
                        </RadioGroup>
                        <RadioGroup  onChange={(value)=>handleRadioChange(value, 'rootingreflexes')} >
                        <Text fontSize="15px" fontWeight={"700"}>Rooting Reflexes</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Normal'>Normal</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Abnormal'>Abnormal</Radio>
                               
                            </Stack>
                        </RadioGroup>
                        <RadioGroup  onChange={(value)=>handleRadioChange(value, 'suckreflexes')} >
                        <Text fontSize="15px" fontWeight={"700"}>Suck Reflexes</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Normal'>Normal</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Abnormal'>Abnormal</Radio>
                               
                            </Stack>
                        </RadioGroup>
                        <RadioGroup  onChange={(value)=>handleRadioChange(value, 'mororeflexes')}>
                        <Text fontSize="15px" fontWeight={"700"}>Moro Reflexes</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Normal'>Normal</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Abnormal'>Abnormal</Radio>
                               
                            </Stack>
                        </RadioGroup>
                        <RadioGroup  onChange={(value)=>handleRadioChange(value, 'tonicneckreflexes')} >
                        <Text fontSize="15px" fontWeight={"700"}>Tonic Neck Reflexes</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Normal'>Normal</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Abnormal'>Abnormal</Radio>
                               
                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value)=>handleRadioChange(value, 'graspreflexes')} >
                        <Text fontSize="15px" fontWeight={"700"}>Grasp Reflexes</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Normal'>Normal</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Abnormal'>Abnormal</Radio>
                               
                            </Stack>
                        </RadioGroup>
                        <RadioGroup  onChange={(value)=>handleRadioChange(value, 'steppingreflexes')}>
                        <Text fontSize="15px" fontWeight={"700"}>Stepping Reflexes</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Normal'>Normal</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Abnormal'>Abnormal</Radio>
                               
                            </Stack>
                        </RadioGroup>
                        <Input type="text" leftIcon={<FaNoteSticky />} label="Note" value={Payload.neuronote} onChange={handlePayload} id="neuronote" />
                    </SimpleGrid>


                    <Button mt="32px" isLoading={Loading} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
