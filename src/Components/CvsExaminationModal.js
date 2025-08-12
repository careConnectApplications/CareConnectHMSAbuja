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
import { SettingsApi } from "../Utils/ApiCalls";

export default function CvsExaminationModal({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState("");


    const [Payload, setPayload] = useState({

        heartrate: "",
        bpsystolic: "",
        bpdiastolic: "",
        capillaryrefilltime: "",
        heartraterhythm: "",
        heartsound: "",
        heartmurmurgrade: "",
        heartmurmurquality: "",
        heartmurmurpitch: "",
        heartmurmurtiming: "",
        murmurlocationauscultation: "",
        murmurradiatingtobodylocation: "",
        jugularveindistention: "",
        jugularveindistentionheadup30degree: "",
        edema: "",
        temperatureextrmities: "",
        tissueperfusionassessmentimpression: "",
        cvsremark: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        setOldPayload({ ...oldPayload, "cvs": Payload })
        activateNotifications("Saved Successfully", "success")
        onClose()
    }


    const getSettings = async () => {
        try {
            const result = await SettingsApi();

            setSettings(result);
        } catch (e) {

        }
    };











    useEffect(() => {

        getSettings()
    }, [isOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader> Cardiovascular Examination</ModalHeader>
                <ModalCloseButton />
                <ModalBody>



                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                        <Input leftIcon={<FaHeartbeat />} label="Heart Rate (bpm)" value={Payload.heartrate} onChange={handlePayload} id="heartrate" />
                        <Input leftIcon={<MdBloodtype />} label="Bp (systolic)(mmHg)" value={Payload.bpsystolic} onChange={handlePayload} id="bpsystolic" />
                        <Input leftIcon={<MdBloodtype />} label="Bp (Diastolic)(mmHg)" value={Payload.bpdiastolic} onChange={handlePayload} id="bpdiastolic" />
                        <Input leftIcon={<GiEnergyBreath />} label="Capillary Refill Time (s)" value={Payload.capillaryrefilltime} onChange={handlePayload} id="capillaryrefilltime" />
                        <Input leftIcon={<GiEnergyBreath />} label="Heart Rate Rhythm (bpm)" value={Payload.heartraterhythm} onChange={handlePayload} id="heartraterhythm" />

                        <Select h="45px" borderWidth="2px" fontSize={Payload.heartsound !== "" ? "16px" : "13px"} borderColor="#6B7280" id="heartsound" value={Payload.heartsound} onChange={handlePayload} placeholder="Select Heart Sound" >
                            {
                                Settings?.heartsound?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>


                    </SimpleGrid>

                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">Murmur Assessment</Text>

                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Select h="45px" borderWidth="2px" fontSize={Payload.heartmurmurgrade !== "" ? "16px" : "13px"} borderColor="#6B7280" id="heartmurmurgrade" value={Payload.heartmurmurgrade} onChange={handlePayload} placeholder="Select Heart Murmur Grade" >
                            {
                                Settings?.heartmurmurgrade?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.heartmurmurquality !== "" ? "16px" : "13px"} borderColor="#6B7280" id="heartmurmurquality" value={Payload.heartmurmurquality} onChange={handlePayload} placeholder="Select Heart Murmur Quality" >
                            {
                                Settings?.heartmurmurquality?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.heartmurmurpitch !== "" ? "16px" : "13px"} borderColor="#6B7280" id="heartmurmurpitch" value={Payload.heartmurmurpitch} onChange={handlePayload} placeholder="Select Heart Murmur Pitch" >
                            {
                                Settings?.heartmurmurpitch?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.heartmurmurtiming !== "" ? "16px" : "13px"} borderColor="#6B7280" id="heartmurmurtiming" value={Payload.heartmurmurtiming} onChange={handlePayload} placeholder="Select Heart Murmur timing" >
                            {
                                Settings?.heartmurmurtiming?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.murmurlocationauscultation !== "" ? "16px" : "13px"} borderColor="#6B7280" id="murmurlocationauscultation" value={Payload.murmurlocationauscultation} onChange={handlePayload} placeholder="Select Murmur Location Auscultation" >
                            {
                                Settings?.murmurlocationausculation?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.murmurradiatingtobodylocation !== "" ? "16px" : "13px"} borderColor="#6B7280" id="murmurradiatingtobodylocation" value={Payload.murmurradiatingtobodylocation} onChange={handlePayload} placeholder="Select Murmur Radiating To Body Location" >
                            {
                                Settings?.murmurradiatingtobodylocation?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.jugularveindistention !== "" ? "16px" : "13px"} borderColor="#6B7280" id="jugularveindistention" value={Payload.jugularveindistention} onChange={handlePayload} placeholder="Select Jugular Vein Distention" >
                            {
                                Settings?.jugularveindistention?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>

                        <Input leftIcon={<FaNoteSticky />} label="Jugular Vein Distention Head Up 30 Deg" value={Payload.jugularveindistentionheadup30degree} onChange={handlePayload} id="jugularveindistentionheadup30degree" />
                    </SimpleGrid>

                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">Tissue Perfusion Assessment</Text>

                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                        <Input leftIcon={<GiEnergyBreath />} label="Edema" value={Payload.edema} onChange={handlePayload} id="edema" />

                        <Select h="45px" borderWidth="2px" fontSize={Payload.temperatureextrmities !== "" ? "16px" : "13px"} borderColor="#6B7280" id="temperatureextrmities" value={Payload.temperatureextrmities} onChange={handlePayload} placeholder="Select Temperature extremities" >
                            <option value={`Cold`} >Cold</option>
                            <option value={`Hot`} >Hot</option>
                            <option value={`Warm`} >Warm</option>


                        </Select>

                        <Select h="45px" borderWidth="2px" fontSize={Payload.tissueperfusionassessmentimpression !== "" ? "16px" : "13px"} borderColor="#6B7280" id="tissueperfusionassessmentimpression" value={Payload.tissueperfusionassessmentimpression} onChange={handlePayload} placeholder="Select Tissue perfusion assessment impression" >
                            <option value={`Within Define Limits`} >Within Define Limits</option>
                            <option value={`Other`} >Other</option>



                        </Select>


                    </SimpleGrid>

                    <Text  fontSize="18px" my="12px" fontWeight={"700"} color="blue.blue500">Remarks</Text>

                        <Input leftIcon={<FaNoteSticky />} label="Remarks" value={Payload.cvsremark} onChange={handlePayload} id="cvsremark" />
                   




                    <Button mt="32px" isLoading={Loading} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
