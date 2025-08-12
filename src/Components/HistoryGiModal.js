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
import Button from "./Button";
import { FaNoteSticky } from "react-icons/fa6";
import { IoColorFilter } from "react-icons/io5";
import { SettingsApi } from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";

export default function HistoryGiModal({ isOpen, onClose, setOldPayload, activateNotifications, oldPayload }) {

    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState("");




    const [Payload, setPayload] = useState({
        nausea: "",
        typeofdiet: "",
        giboweleliminationpattern: "",
        bmfrequency: "",
        bmusualtimeoftheday: "",
        bmregularity: "",
        usualconsistency: "",
        dateoflastbm: "",
        consistency: "",
        color: "",
        amount: "",
        appearance: "",
        historyofgidisorders: "",
        historyofsurgicalprocedureofgisystem: "",
        historygiremark: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        setOldPayload({ ...oldPayload, "historygi": Payload })
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


        if (Object.values(Payload).some(value => value !== null && value !== "" && value !== undefined)) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }


        getSettings()
    }, [isOpen, Payload]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader> Gastro-intestinal History </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>


                        <Select h="45px" borderWidth="2px" fontSize={Payload.nausea !== "" ? "16px" : "13px"} borderColor="#6B7280" id="nausea" value={Payload.nausea} onChange={handlePayload} placeholder="Select Nausea" >
                            {
                                Settings?.nausea?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.typeofdiet !== "" ? "16px" : "13px"} borderColor="#6B7280" id="typeofdiet" value={Payload.typeofdiet} onChange={handlePayload} placeholder="Select Type of Diet" >
                            {
                                Settings?.typeofdiet?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.giboweleliminationpattern !== "" ? "16px" : "13px"} borderColor="#6B7280" id="giboweleliminationpattern" value={Payload.giboweleliminationpattern} onChange={handlePayload} placeholder="Select Bowel elimination pattern" >
                            {
                                Settings?.giboweleliminationpattern?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.bmfrequency !== "" ? "16px" : "13px"} borderColor="#6B7280" id="bmfrequency" value={Payload.bmfrequency} onChange={handlePayload} placeholder="Select BM frequency" >
                            {
                                Settings?.bmfrequency?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.bmusualtimeoftheday !== "" ? "16px" : "13px"} borderColor="#6B7280" id="bmusualtimeoftheday" value={Payload.bmusualtimeoftheday} onChange={handlePayload} placeholder="Select BM Usual Time of the Day" >
                            {
                                Settings?.bmusualtimeoftheday?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.bmregularity !== "" ? "16px" : "13px"} borderColor="#6B7280" id="bmregularity" value={Payload.bmregularity} onChange={handlePayload} placeholder="Select BM regularity" >
                            {
                                Settings?.bmregularity?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>

                        <Select h="45px" borderWidth="2px" fontSize={Payload.usualconsistency !== "" ? "16px" : "13px"} borderColor="#6B7280" id="usualconsistency" value={Payload.usualconsistency} onChange={handlePayload} placeholder="Select Usual consistency" >
                            {
                                Settings?.usualconsistency?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>


                        <Input leftIcon={<FaArrowsToDot />} type="date" label="Date Of Last BM" value={Payload.dateoflastbm} onChange={handlePayload} id="dateoflastbm" />

                        <Select h="45px" borderWidth="2px" fontSize={Payload.consistency !== "" ? "16px" : "13px"} borderColor="#6B7280" id="consistency" value={Payload.consistency} onChange={handlePayload} placeholder="Select Consistency" >
                            {
                                Settings?.consistency?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.color !== "" ? "16px" : "13px"} borderColor="#6B7280" id="color" value={Payload.color} onChange={handlePayload} placeholder="Select Color" >
                            {
                                Settings?.color?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.amount !== "" ? "16px" : "13px"} borderColor="#6B7280" id="amount" value={Payload.amount} onChange={handlePayload} placeholder="Select Amount" >
                            {
                                Settings?.amount?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.appearance !== "" ? "16px" : "13px"} borderColor="#6B7280" id="appearance" value={Payload.appearance} onChange={handlePayload} placeholder="Select Appearance" >
                            {
                                Settings?.appearance?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                    <Input leftIcon={<FaNoteSticky />} label="History of GI Disorders" value={Payload.historyofgidisorders} onChange={handlePayload} id="historyofgidisorders" />
                    <Input leftIcon={<FaNoteSticky />} label="History of Surgical Procedure of GI System" value={Payload.historyofsurgicalprocedureofgisystem} onChange={handlePayload} id="historyofsurgicalprocedureofgisystem" />
                    </SimpleGrid>

                    <Input leftIcon={<FaNoteSticky />} label="Remarks" value={Payload.historygiremark} onChange={handlePayload} id="historygiremark" />


                    <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
