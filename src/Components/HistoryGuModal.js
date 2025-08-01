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

export default function HistoryGuModal({ isOpen, onClose, setOldPayload, activateNotifications, oldPayload }) {

    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState("");




    const [Payload, setPayload] = useState({
        historyofgenitourinarydisorders: "",
        historyofsrgicalprocedureforgusyetm: "",
        numberstools: "",
        fluidoutputemesis: "",
        guboweleliminationpattern: "",
        consistencystool: "",
        historyguremark: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        setOldPayload({ ...oldPayload, "historygu": Payload })
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
                    <Input leftIcon={<FaNoteSticky />} label="History of GU Disorders" value={Payload.historyofgenitourinarydisorders} onChange={handlePayload} id="historyofgenitourinarydisorders" />
                    <Input leftIcon={<FaNoteSticky />} label="History of Surgical Procedure of GU System" value={Payload.historyofsrgicalprocedureforgusyetm} onChange={handlePayload} id="historyofsrgicalprocedureforgusyetm" />

                    <Input leftIcon={<FaArrowsToDot />} type="number" label="Numbers Stools" value={Payload.numberstools} onChange={handlePayload} id="numberstools" />
                    <Input leftIcon={<FaArrowsToDot />} type="number" label="Fluid Output Emesis" value={Payload.fluidoutputemesis} onChange={handlePayload} id="fluidoutputemesis" />


                        <Select h="45px" borderWidth="2px" fontSize={Payload.guboweleliminationpattern !== "" ? "16px" : "13px"} borderColor="#6B7280" id="guboweleliminationpattern" value={Payload.guboweleliminationpattern} onChange={handlePayload} placeholder="Select Bowel Elimination Pattern" >
                            {
                                Settings?.guboweleleiminationpattern?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.consistencystool !== "" ? "16px" : "13px"} borderColor="#6B7280" id="consistencystool" value={Payload.consistencystool} onChange={handlePayload} placeholder="Select Consistency Stool" >
                            {
                                Settings?.consistencystool?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                      
                    </SimpleGrid>

                    <Input leftIcon={<FaNoteSticky />} label="Remarks" value={Payload.historyguremark} onChange={handlePayload} id="historyguremark" />


                    <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
