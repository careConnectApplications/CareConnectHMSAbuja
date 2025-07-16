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
    Stack, SimpleGrid, Select, Flex
} from '@chakra-ui/react'
import PastObstetricCard from "./PastObstetricCard";
import Button from "./Button";
import { FaNoteSticky } from "react-icons/fa6";
import { IoColorFilter } from "react-icons/io5";
import { SettingsApi } from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";
import { SlPlus } from "react-icons/sl";


export default function PastObstetricHistoryModal({ isOpen, onClose, setOldPayload, activateNotifications, oldPayload }) {

    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState("");




    const [Payload, setPayload] = useState({

        obstetrichistory: [
            {
                year: "",
                sexofchild: "",
                gestage: "",
                birthweight: "",
                lengthoflabour: "",
                problemsduringpregancy: "",
                problemsduringdelivery: "",
                problemsafterdelivery: "",
                modeofdelivery: "",
                placeofbirth: "",
                typeofbirth: "",
                comment: "",

            }
        ],
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        setOldPayload({ ...oldPayload, "pastobstetrichistory": Payload.obstetrichistory })
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
                <ModalHeader> Past Obstetric History </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <Flex justifyContent={"flex-end"} mb="15px">
                        <Button w="150px" rightIcon={<SlPlus />} onClick={() => setPayload(

                            {
                                ...Payload,
                                obstetrichistory: [...Payload.obstetrichistory, {
                                    year: "",
                                    sexofchild: "",
                                    gestage: "",
                                    birthweight: "",
                                    lengthoflabour: "",
                                    problemsduringpregancy: "",
                                    problemsduringdelivery: "",
                                    problemsafterdelivery: "",
                                    modeofdelivery: "",
                                    placeofbirth: "",
                                    typeofbirth: "",
                                    comment: ""
                                },]
                            }
                        )}>Add</Button>
                    </Flex>

                    {
                        Payload.obstetrichistory?.map((item, i) => (

                            <PastObstetricCard data={item} oldItem={Payload.obstetrichistory} Payload={Payload} setPayload={setPayload} key={i} i={i} />
                        ))
                    }


                    <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
