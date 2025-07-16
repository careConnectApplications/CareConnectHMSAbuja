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

export default function HistoryCvsModal({ isOpen, onClose, setOldPayload, activateNotifications, oldPayload }) {

    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState("");




    const [Payload, setPayload] = useState({

        cvsassessmentimpression: "",
        historyofcvsdisorder: "",
        historyofcvssurgicalprocedures: "",
        historycvsremark: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        setOldPayload({ ...oldPayload, "historycvs": Payload })
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
    }, [isOpen,Payload]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader> Cardiovascular History </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                        

                        <Select h="45px" borderWidth="2px" fontSize={Payload.cvsassessmentimpression !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cvsassessmentimpression" value={Payload.cvsassessmentimpression} onChange={handlePayload} placeholder="Select CVS Assessment Impression" >
                            {
                                Settings?.gIassessmentimpression?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>

                      
                        <Input leftIcon={<FaArrowsToDot />} label="History of CVS Disorder" value={Payload.historyofcvsdisorder} onChange={handlePayload} id="historyofcvsdisorder" />
                        <Input leftIcon={<FaArrowsToDot />} label="History of CVS Surgical Procedures" value={Payload.historyofcvssurgicalprocedures} onChange={handlePayload} id="historyofcvssurgicalprocedures" />
                     



                    </SimpleGrid>

                    <Input leftIcon={<FaNoteSticky />} label="Remarks" value={Payload.historycvsremark} onChange={handlePayload} id="historycvsremark" />


                    <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
