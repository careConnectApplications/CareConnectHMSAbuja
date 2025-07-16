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

export default function GiExaminationModal({ isOpen, onClose, setOldPayload, activateNotifications, oldPayload }) {

    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState("");




    const [Payload, setPayload] = useState({

        urinecolor: "",
        urineodor: "",
        urineturbidity: "",
        urinecollectiondevice: "",
        voidingpattern: "",
        appearanceurine: "",
        otherurine: "",
        genitourinaryassessmentimpression: "",
        numbervoids: "",
        incontinentvoidsurinary: "",
        diapercount: "",
        perinealpadscount: "",
        colorurine: "",
        voidingpatterngu: "",
        bloodlossvolume: "",
        genitouringassessmentimpressions: "",
        guremark: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        setOldPayload({ ...oldPayload, "gu": Payload })
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
                <ModalHeader> Genitourinary Assessment </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                        <Input leftIcon={<IoColorFilter />} label="Urine Color" value={Payload.urinecolor} onChange={handlePayload} id="urinecolor" />
                        <Input leftIcon={<FaArrowsToDot />} label="Urine Odor" value={Payload.urineodor} onChange={handlePayload} id="urineodor" />


                        <Select h="45px" borderWidth="2px" fontSize={Payload.urineturbidity !== "" ? "16px" : "13px"} borderColor="#6B7280" id="urineturbidity" value={Payload.urineturbidity} onChange={handlePayload} placeholder="Select Urine Turbidity" >
                            {
                                Settings?.urineturbidity?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>

                        <Select h="45px" borderWidth="2px" fontSize={Payload.urinecollectiondevice !== "" ? "16px" : "13px"} borderColor="#6B7280" id="urinecollectiondevice" value={Payload.urinecollectiondevice} onChange={handlePayload} placeholder="Select Urine collection device" >
                            {
                                Settings?.urinecollectiondevice?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>



                        <Select h="45px" borderWidth="2px" fontSize={Payload.voidingpattern !== "" ? "16px" : "13px"} borderColor="#6B7280" id="voidingpattern" value={Payload.voidingpattern} onChange={handlePayload} placeholder="Select Voiding pattern" >
                            {
                                Settings?.voidingpattern?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Input leftIcon={<FaArrowsToDot />} label="Appearance Urine" value={Payload.appearanceurine} onChange={handlePayload} id="appearanceurine" />

                        <Select h="45px" borderWidth="2px" fontSize={Payload.otherurine !== "" ? "16px" : "13px"} borderColor="#6B7280" id="otherurine" value={Payload.otherurine} onChange={handlePayload} placeholder="Select Other element Urine" >
                            {
                                Settings?.otherelementurine?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.genitourinaryassessmentimpression !== "" ? "16px" : "13px"} borderColor="#6B7280" id="genitourinaryassessmentimpression" value={Payload.genitourinaryassessmentimpression} onChange={handlePayload} placeholder="Select Genitourinary assessment impression" >
                            {
                                Settings?.genitourinaryassessmentimpression?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>




                    </SimpleGrid>

                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">Output Count</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillDatabase />} label="Number Voids" value={Payload.numbervoids} onChange={handlePayload} id="numbervoids" />
                        <Input leftIcon={<AiFillDatabase />} label="Incontinent Voids Urinary" value={Payload.incontinentvoidsurinary} onChange={handlePayload} id="incontinentvoidsurinary" />
                        <Input leftIcon={<AiFillDatabase />} label="Diaper Count" value={Payload.diapercount} onChange={handlePayload} id="diapercount" />
                        <Input leftIcon={<AiFillDatabase />} label="Perineal Pads Count" value={Payload.perinealpadscount} onChange={handlePayload} id="perinealpadscount" />
                    </SimpleGrid>

                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">Output Assessment</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillDatabase />} label="Color Urine" value={Payload.colorurine} onChange={handlePayload} id="colorurine" />
                        <Select h="45px" borderWidth="2px" fontSize={Payload.voidingpatterngu !== "" ? "16px" : "13px"} borderColor="#6B7280" id="voidingpatterngu" value={Payload.voidingpatterngu} onChange={handlePayload} placeholder="Select Voiding pattern GU" >
                            {
                                Settings?.voidingpatterngu?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Input leftIcon={<AiFillDatabase />} label="Blood Loss Volume (mL)" value={Payload.bloodlossvolume} onChange={handlePayload} id="bloodlossvolume" />
                    </SimpleGrid>
                        <Input leftIcon={<FaNoteSticky />} label="Remarks" value={Payload.guremark} onChange={handlePayload} id="guremark" />


                    <Button mt="32px" isLoading={Loading} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
