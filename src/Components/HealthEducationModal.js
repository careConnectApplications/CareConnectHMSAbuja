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

export default function HealthEducationModal({ isOpen, onClose, setOldPayload, activateNotifications, oldPayload }) {

    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState("");




    const [Payload, setPayload] = useState({

        nutrition: "",
        restandexercise: "",
        malariainpregnancy: "",
        safersexinpregnancy: "",
        vctforpreventionofmotertochildtrnsmissionofhiv: "",
        birthandemergencyreadnessplanning: "",
        alcohotobaccoorotherdrugsysed: "",
        familyplanningbirthspacing: "",
        infantfeedingoptions: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        setOldPayload({ ...oldPayload, ["healtheducationtopicscovered"]: Payload })
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
                <ModalHeader> Health Education Examination </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>


                        <Input leftIcon={<FaArrowsToDot />} label="Nutrition" value={Payload.nutrition} onChange={handlePayload} id="nutrition" />
                        <Input leftIcon={<FaArrowsToDot />} label="Rest And Exercise" value={Payload.restandexercise} onChange={handlePayload} id="restandexercise" />
                        <Input leftIcon={<FaArrowsToDot />} label="Malaria In Pregnancy" value={Payload.malariainpregnancy} onChange={handlePayload} id="malariainpregnancy" />
                        <Input leftIcon={<FaArrowsToDot />} label="Safer Sex In Pregnancy" value={Payload.safersexinpregnancy} onChange={handlePayload} id="safersexinpregnancy" />
                        <Input leftIcon={<FaArrowsToDot />} label="VCT For Preventing HIV To Child from Mother" value={Payload.vctforpreventionofmotertochildtrnsmissionofhiv} onChange={handlePayload} id="vctforpreventionofmotertochildtrnsmissionofhiv" />
                        <Input leftIcon={<FaArrowsToDot />} label="Birth And Emergency Readiness Planning" value={Payload.birthandemergencyreadnessplanning} onChange={handlePayload} id="birthandemergencyreadnessplanning" />
                        <Input leftIcon={<FaArrowsToDot />} label="Alcohol Tobacco or Other Drugs Used" value={Payload.alcohotobaccoorotherdrugsysed} onChange={handlePayload} id="alcohotobaccoorotherdrugsysed" />
                        <Input leftIcon={<FaArrowsToDot />} label="Family Planning Birth Spacing" value={Payload.familyplanningbirthspacing} onChange={handlePayload} id="familyplanningbirthspacing" />
                        <Input leftIcon={<FaNoteSticky />} label="Infant Feeding Options" value={Payload.infantfeedingoptions} onChange={handlePayload} id="infantfeedingoptions" />




                    </SimpleGrid>



                    <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
