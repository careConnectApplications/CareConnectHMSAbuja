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

export default function GiExaminationModal({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState("");




    const [Payload, setPayload] = useState({

        bowelsoundauscultation: "",
        bowelsoundbyqualityauscultation: "",
        bsquadauscultation: "",
        physiologicfindingbypalpation: "",
        giassessmentimpression: "",
        giremarks: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        setOldPayload({ ...oldPayload, ["gi"]: Payload })
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
                <ModalHeader> Gastro-Intestinal Assessment </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Select h="45px" borderWidth="2px" fontSize={Payload.bowelsoundauscultation !== "" ? "16px" : "13px"} borderColor="#6B7280" id="bowelsoundauscultation" value={Payload.bowelsoundauscultation} onChange={handlePayload} placeholder="Select Bowel sound auscultation" >
                            {
                                Settings?.bowelsoundausculation?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>

                        <Select h="45px" borderWidth="2px" fontSize={Payload.bowelsoundbyqualityauscultation !== "" ? "16px" : "13px"} borderColor="#6B7280" id="bowelsoundbyqualityauscultation" value={Payload.bowelsoundbyqualityauscultation} onChange={handlePayload} placeholder="Select Bowel sound by quality of auscultation" >
                            {
                                Settings?.bowelsoundbyqualityausculation?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>



                        <Select h="45px" borderWidth="2px" fontSize={Payload.bsquadauscultation !== "" ? "16px" : "13px"} borderColor="#6B7280" id="bsquadauscultation" value={Payload.bsquadauscultation} onChange={handlePayload} placeholder="Select BS quad auscultation" >
                            {
                                Settings?.bsquadausculation?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.physiologicfindingbypalpation !== "" ? "16px" : "13px"} borderColor="#6B7280" id="physiologicfindingbypalpation" value={Payload.physiologicfindingbypalpation} onChange={handlePayload} placeholder="Select Physiologic finding by palpation" >
                            {
                                Settings?.physiologicfindingbypalpation?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.giassessmentimpression !== "" ? "16px" : "13px"} borderColor="#6B7280" id="giassessmentimpression" value={Payload.giassessmentimpression} onChange={handlePayload} placeholder="Select GI assessment impression" >
                            {
                                Settings?.gIassessmentimpression?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                       



                    </SimpleGrid>
                    <Input leftIcon={<FaNoteSticky />} label="Remarks" value={Payload.giremarks} onChange={handlePayload} id="giremarks" />







                    <Button mt="32px" isLoading={Loading} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
