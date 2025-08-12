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

export default function MedicalHistoryModal({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);


    const [RadioGroups, setRadioGroups] = useState({
        attentiondeficitdisorderhyperactivitydisorder: "",
        constipation: "",
        fatigue: "",
        orthopedicconditions: "",
        allergies: "",
        diabetes: "",
        headaches: "",
        scoliosis: "",
        asthma: "",
        digestiveproblems: "",
        hearingdifficulties: "",
        seizures: "",
        blooddisorder: "",
        depressionanxiety: "",
        heartproblems: "",
        sleepdisturbances: "",
        chroniccolds: "",
        dyslexia: "",
        kidneydisorders: "",
        torticollis: "",
        colic: "",
        earinfections: "",
        lymphdisorders: "",
        visiondifficulties: "",
        autism: "",
        sensoryprocessingchallenges: "",
        

    });

    const handleRadioChange = (value, radioGroup) => {
        setRadioGroups((prevRadioGroup) => ({
            ...prevRadioGroup, [radioGroup]: value
        }))

    }


    const [Payload, setPayload] = useState({

        attentiondeficitdisorderhyperactivitydisordernote: "",
        constipationnote: "",
        fatiguenote: "",
        orthopedicconditionsnote: "",
        allergiesnote: "",
        diabetesnote: "",
        headachesnote: "",
        scoliosisnote: "",
        asthmanote: "",
        digestiveproblemsnote: "",
        hearingdifficultiesnote: "",
        seizuresnote: "",
        blooddisordernote: "",
        depressionanxietynote: "",
        heartproblemsnote: "",
        sleepdisturbancesnote: "",
        chroniccoldsnote: "",
        dyslexianote: "",
        kidneydisordersnote: "",
        torticollisnote: "",
        colicnote: "",
        earinfectionsnote: "",
        lymphdisordersnote: "",
        visiondifficultiesnote: "",
        autismnote: "",
        sensoryprocessingchallengesnote: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        const mergedPayload = { ...Payload, ...RadioGroups }
        setOldPayload({ ...oldPayload, "medicalhistory": mergedPayload })
        activateNotifications("Saved Successfully", "success")
        onClose()
    }









    const [Disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (Object.values(Payload).some(value => value !== null && value !== "" && value !== undefined) || Object.values(RadioGroups).some(value => value !== null && value !== "" && value !== undefined)) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }

    }, [isOpen, RadioGroups, Payload]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "80%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader> Medical History </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">General</Text>

                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'attentiondeficitdisorderhyperactivitydisorder')} >
                                <Text fontSize="15px" fontWeight={"700"}>Attention Deficit / Hyperactivity Disorder</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Attention Deficit Disorder Note" value={Payload.attentiondeficitdisorderhyperactivitydisordernote} onChange={handlePayload} id="attentiondeficitdisorderhyperactivitydisordernote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'constipation')} >
                                <Text fontSize="15px" fontWeight={"700"}>Constipation</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Constipation Note" value={Payload.constipationnote} onChange={handlePayload} id="constipationnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'fatigue')} >
                                <Text fontSize="15px" fontWeight={"700"}>Fatigue</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Fatigue Note" value={Payload.fatiguenote} onChange={handlePayload} id="fatiguenote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'orthopedicconditions')} >
                                <Text fontSize="15px" fontWeight={"700"}>Orthopedic Conditions</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Orthopedic ConditionsNote" value={Payload.orthopedicconditionsnote} onChange={handlePayload} id="orthopedicconditionsnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'allergies')} >
                                <Text fontSize="15px" fontWeight={"700"}>Allergies</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Allergies Note" value={Payload.allergiesnote} onChange={handlePayload} id="allergiesnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'diabetes')} >
                                <Text fontSize="15px" fontWeight={"700"}>Diabetes</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Diabetes Note" value={Payload.diabetesnote} onChange={handlePayload} id="diabetesnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'headaches')} >
                                <Text fontSize="15px" fontWeight={"700"}>Headaches</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Headaches Note" value={Payload.headachesnote} onChange={handlePayload} id="headachesnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'scoliosis')} >
                                <Text fontSize="15px" fontWeight={"700"}>Scoliosis</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Scoliosis Note" value={Payload.scoliosisnote} onChange={handlePayload} id="scoliosisnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'asthma')} >
                                <Text fontSize="15px" fontWeight={"700"}>Asthma</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Asthmanote Note" value={Payload.asthmanote} onChange={handlePayload} id="asthmanote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'digestiveproblems')} >
                                <Text fontSize="15px" fontWeight={"700"}>Digestive problems</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Digestive problems Note" value={Payload.digestiveproblemsnote} onChange={handlePayload} id="digestiveproblemsnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'hearingdifficulties')} >
                                <Text fontSize="15px" fontWeight={"700"}>Hearing Difficulties </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Hearing Difficulties Note" value={Payload.hearingdifficultiesnote} onChange={handlePayload} id="hearingdifficultiesnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'seizures')} >
                                <Text fontSize="15px" fontWeight={"700"}>Seizures </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Seizures Note" value={Payload.seizuresnote} onChange={handlePayload} id="seizuresnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'blooddisorder')} >
                                <Text fontSize="15px" fontWeight={"700"}>Blood Disorder </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Blood Disorder Note" value={Payload.blooddisordernote} onChange={handlePayload} id="blooddisordernote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'depressionanxiety')} >
                                <Text fontSize="15px" fontWeight={"700"}>Depression Anxiety </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Depression Anxiety Note" value={Payload.depressionanxietynote} onChange={handlePayload} id="depressionanxietynote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'heartproblems')} >
                                <Text fontSize="15px" fontWeight={"700"}>Heart Problems </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Heart Problems Note" value={Payload.heartproblemsnote} onChange={handlePayload} id="heartproblemsnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'sleepdisturbances')} >
                                <Text fontSize="15px" fontWeight={"700"}>Sleep Disturbances </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Sleep Disturbances Note" value={Payload.sleepdisturbancesnote} onChange={handlePayload} id="sleepdisturbancesnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'chroniccolds')} >
                                <Text fontSize="15px" fontWeight={"700"}>Chroniccolds </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Chroniccolds Note" value={Payload.chroniccoldsnote} onChange={handlePayload} id="chroniccoldsnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'dyslexia')} >
                                <Text fontSize="15px" fontWeight={"700"}>Dyslexia </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Dyslexia Note" value={Payload.dyslexianote} onChange={handlePayload} id="dyslexianote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'kidneydisorders')} >
                                <Text fontSize="15px" fontWeight={"700"}>Kidney Disorders </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Kidney Disorders Note" value={Payload.kidneydisordersnote} onChange={handlePayload} id="kidneydisordersnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'torticollis')} >
                                <Text fontSize="15px" fontWeight={"700"}>Torticollis </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Torticollis Note" value={Payload.torticollisnote} onChange={handlePayload} id="torticollisnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'colic')} >
                                <Text fontSize="15px" fontWeight={"700"}>Colic </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Colic Note" value={Payload.colicnote} onChange={handlePayload} id="colicnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'earinfections')} >
                                <Text fontSize="15px" fontWeight={"700"}>Ear Infections </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Ear Infections Note" value={Payload.earinfectionsnote} onChange={handlePayload} id="earinfectionsnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'lymphdisorders')} >
                                <Text fontSize="15px" fontWeight={"700"}>Lymph Disorders </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Lymph Disorders Note" value={Payload.lymphdisordersnote} onChange={handlePayload} id="lymphdisordersnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'visiondifficulties')} >
                                <Text fontSize="15px" fontWeight={"700"}>Vision Difficulties </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Vision Difficulties Note" value={Payload.visiondifficultiesnote} onChange={handlePayload} id="visiondifficultiesnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'autism')} >
                                <Text fontSize="15px" fontWeight={"700"}>Autism </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Autism Note" value={Payload.autismnote} onChange={handlePayload} id="autismnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'sensoryprocessingchallenges')} >
                                <Text fontSize="15px" fontWeight={"700"}>Sensory Processing Challenges </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Sensory Processing Challenges Note" value={Payload.sensoryprocessingchallengesnote} onChange={handlePayload} id="sensoryprocessingchallengesnote" />

                        </Stack>

                      
                    </SimpleGrid>

                


                    <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
