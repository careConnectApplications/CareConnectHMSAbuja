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

export default function LaboratoryANCModal({ isOpen, onClose, setOldPayload, activateNotifications, oldPayload }) {

    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState("");




    const [Payload, setPayload] = useState({

        haemoglobinhaematocrit: "",
        urinalysisprotientsugar: "",
        vdrlorrprotientsugar: "",
        boodgroupandrhesusstatus: "",
        hivtest: "",
        urinnemicroscopic: "",
        haemoglobin: "",
        others: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        setOldPayload({ ...oldPayload, "laboratory": Payload })
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
                <ModalHeader> Laboratory Examination </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>


                        <Input leftIcon={<FaArrowsToDot />} label="haemoglobin/haematocrit (PCV)" value={Payload.haemoglobinhaematocrit} onChange={handlePayload} id="haemoglobinhaematocrit" />
                        <Input leftIcon={<FaArrowsToDot />} label="urinalysis (protein,sugar)" value={Payload.urinalysisprotientsugar} onChange={handlePayload} id="urinalysisprotientsugar" />
                        <Input leftIcon={<FaArrowsToDot />} label="VDRL Or RPR for Syphilis" value={Payload.vdrlorrprotientsugar} onChange={handlePayload} id="vdrlorrprotientsugar" />
                        <Input leftIcon={<FaArrowsToDot />} label="Blood Group and Rhesus Status" value={Payload.boodgroupandrhesusstatus} onChange={handlePayload} id="boodgroupandrhesusstatus" />
                        <Input leftIcon={<FaArrowsToDot />} label="HIV test" value={Payload.hivtest} onChange={handlePayload} id="hivtest" />
                        <Input leftIcon={<FaArrowsToDot />} label="Urine Microscopic" value={Payload.urinnemicroscopic} onChange={handlePayload} id="urinnemicroscopic" />
                        <Input leftIcon={<FaArrowsToDot />} label="Haemoglobin Genotype" value={Payload.haemoglobin} onChange={handlePayload} id="haemoglobin" />
                        <Input leftIcon={<FaNoteSticky />} label="others, Specify" value={Payload.others} onChange={handlePayload} id="others" />




                    </SimpleGrid>



                    <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
