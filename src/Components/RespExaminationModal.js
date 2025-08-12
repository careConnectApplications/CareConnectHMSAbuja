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

export default function RespExaminationModal({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState("");




    const [Payload, setPayload] = useState({

        respiratoryrhthm: "",
        respiratoryrate: "",
        respiratoryeffort: "",
        breathsoundsauscultation: "",
        localizedbreathsounds: "",
        respiratoryassessmentimpression: "",
        respremarks: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        setOldPayload({ ...oldPayload, "resp": Payload })
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
                <ModalHeader> Respiratory Assessment </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Select h="45px" borderWidth="2px" fontSize={Payload.respiratoryrhthm !== "" ? "16px" : "13px"} borderColor="#6B7280" id="respiratoryrhthm" value={Payload.respiratoryrhthm} onChange={handlePayload} placeholder="Select Respiratory Rhythm" >
                            {
                                Settings?.respiratoryrhythm?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>

                        <Input leftIcon={<FaNoteSticky />} label="Respiratory rate (bpm)" value={Payload.respiratoryrate} onChange={handlePayload} id="respiratoryrate" />


                        <Select h="45px" borderWidth="2px" fontSize={Payload.respiratoryeffort !== "" ? "16px" : "13px"} borderColor="#6B7280" id="respiratoryeffort" value={Payload.respiratoryeffort} onChange={handlePayload} placeholder="Select Heart Murmur Quality" >
                            {
                                Settings?.respiratoryeffort?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.breathsoundsauscultation !== "" ? "16px" : "13px"} borderColor="#6B7280" id="breathsoundsauscultation" value={Payload.breathsoundsauscultation} onChange={handlePayload} placeholder="Select Breath Sound Auscultation" >
                            {
                                Settings?.breathingsoundausculation?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.localizedbreathsounds !== "" ? "16px" : "13px"} borderColor="#6B7280" id="localizedbreathsounds" value={Payload.localizedbreathsounds} onChange={handlePayload} placeholder="Select Localized breath sounds" >
                            {
                                Settings?.localizedbreathsounds?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.respiratoryassessmentimpression !== "" ? "16px" : "13px"} borderColor="#6B7280" id="respiratoryassessmentimpression" value={Payload.respiratoryassessmentimpression} onChange={handlePayload} placeholder="Select Respiratory assessment impression" >
                            {
                                Settings?.respiratoryassessmentimpression?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>



                    </SimpleGrid>
                    <Input leftIcon={<FaNoteSticky />} label="Remarks" value={Payload.respremarks} onChange={handlePayload} id="respremarks" />







                    <Button mt="32px" isLoading={Loading} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
