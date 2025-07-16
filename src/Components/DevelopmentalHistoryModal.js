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


export default function DevelopmentalHistoryModal({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);


    const [RadioGroups, setRadioGroups] = useState({
        
        anyfoodallergies: "",
        contacttypesport: "",
        historyofcaraccident: "",
        everbeenseenonemergency: "",
        otherhistoryoftrauma: "",
        historyoffrequentfalls: "",
        anysignofmuscleweakness: "",







    });

    const handleRadioChange = (value, radioGroup) => {
        setRadioGroups((prevRadioGroup) => ({
            ...prevRadioGroup, [radioGroup]: value
        }))

    }


    const [Payload, setPayload] = useState({

        agewhenrolledover: "",
        satupunsupported: "",
        crawled: "",
        walked: "",
        spokefirstword: "",
        spokeinsentences: "",
        totaltrianed: "",
        anyfoodallergiesnote: "",
        contacttypesportnote: "",
        historyofcaraccidentnote: "",
        everbeenseenonemergencynote: "",
        otherhistoryoftraumanote: "",
        historyoffrequentfallsnote: "",
        anysignofmuscleweaknessnote: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        const mergedPayload = { ...Payload, ...RadioGroups }
        setOldPayload({ ...oldPayload, "developmentmilestonehistorydetails": mergedPayload })
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
                <ModalHeader>Developmental/Milestone History Details </ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                    <Input type="text" leftIcon={<FaNoteSticky />} label="Age When Rolled Over" value={Payload.agewhenrolledover} onChange={handlePayload} id="agewhenrolledover" />
                    <Input type="text" leftIcon={<FaNoteSticky />} label="Sat Up Unsupported" value={Payload.satupunsupported} onChange={handlePayload} id="satupunsupported" />
                    <Input type="text" leftIcon={<FaNoteSticky />} label="Crawled" value={Payload.crawled} onChange={handlePayload} id="crawled" />
                    <Input type="text" leftIcon={<FaNoteSticky />} label="Walked" value={Payload.walked} onChange={handlePayload} id="walked" />
                    <Input type="text" leftIcon={<FaNoteSticky />} label="Spoke First Word" value={Payload.spokefirstword} onChange={handlePayload} id="spokefirstword" />
                    <Input type="text" leftIcon={<FaNoteSticky />} label="Spoke in Sentence" value={Payload.spokeinsentences} onChange={handlePayload} id="spokeinsentences" />
                    <Input type="text" leftIcon={<FaNoteSticky />} label="total trained" value={Payload.totaltrianed} onChange={handlePayload} id="totaltrianed" />

                    </SimpleGrid>

                    <Text mt="5" fontSize="18px" fontWeight={"700"} color="blue.blue500">Other Developmental History</Text>

                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'anyfoodallergies')} >
                                <Text fontSize="15px" fontWeight={"700"}>Any Food Allergies</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Any Food Allergies Note" value={Payload.anyfoodallergiesnote} onChange={handlePayload} id="anyfoodallergiesnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'contacttypesport')} >
                                <Text fontSize="15px" fontWeight={"700"}>Contact Type Sport</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Contact Type Sport Note" value={Payload.contacttypesportnote} onChange={handlePayload} id="contacttypesportnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'historyofcaraccident')} >
                                <Text fontSize="15px" fontWeight={"700"}>History of Car Accident</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="History of Car Accident Note" value={Payload.historyofcaraccidentnote} onChange={handlePayload} id="historyofcaraccidentnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'everbeenseenonemergency')} >
                                <Text fontSize="15px" fontWeight={"700"}>Ever Been Seen On Emergency </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Ever Been Seen On Emergency Note" value={Payload.everbeenseenonemergencynote} onChange={handlePayload} id="everbeenseenonemergencynote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'otherhistoryoftrauma')} >
                                <Text fontSize="15px" fontWeight={"700"}>Other History Of Trauma</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Other History Of Trauma Note" value={Payload.otherhistoryoftraumanote} onChange={handlePayload} id="otherhistoryoftraumanote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'historyoffrequentfalls')} >
                                <Text fontSize="15px" fontWeight={"700"}>History Of Frequent Falls</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="History Of Frequent Falls Note" value={Payload.historyoffrequentfallsnote} onChange={handlePayload} id="historyoffrequentfallsnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'anysignofmuscleweakness')} >
                                <Text fontSize="15px" fontWeight={"700"}>Any Sign Of Muscle Weakness</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Any Sign Of Muscle Weakness Note" value={Payload.anysignofmuscleweaknessnote} onChange={handlePayload} id="anysignofmuscleweaknessnote" />

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
