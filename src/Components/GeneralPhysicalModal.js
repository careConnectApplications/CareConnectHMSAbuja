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
import { FaNoteSticky } from "react-icons/fa6";
import { BiUnite } from "react-icons/bi";



export default function GeneralPhysicalModal({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);


    const [RadioGroups, setRadioGroups] = useState({
        headteetheyesnosethroat: "",
        thyroid: "",
        chest: "",
        breasts: "",
        cardiovascular: "",
        abdomen: "",
        varicoseveins: "",
        neurologicalexam: "",
        externalgenitalia: "",
        cervixvigina: "",
        uterus: "",
        adnexa: "",


    });

    const handleRadioChange = (value, radioGroup) => {
        setRadioGroups((prevRadioGroup) => ({
            ...prevRadioGroup, [radioGroup]: value
        }))

    }


    const [Payload, setPayload] = useState({

        weight: "",
        bloodpressure: "",
        pulse: "",
        anythingabnormal: "",
        additionalcomment: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        const mergedPayload = { ...Payload, ...RadioGroups }
        setOldPayload({ ...oldPayload, "physicalexamination": mergedPayload })
        activateNotifications("Saved Successfully", "success")
        onClose()
    }









    const [Disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (Object.values(Payload).some(value => value !== null && value !== "" && value !== undefined) || Object.values(RadioGroups).some(value => value !== null && value !== "" && value !== undefined)) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }

    }, [isOpen, RadioGroups, Payload]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "80%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader>General Physical Examination</ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 2 }} spacing={5} mb="5">

                        <Input leftIcon={<BiUnite />} label="Weight" type="number" value={Payload.weight} onChange={handlePayload} id="weight" />
                        <Input leftIcon={<BiUnite />} label="Blood Pressure" type="number" value={Payload.bloodpressure} onChange={handlePayload} id="bloodpressure" />
                        <Input leftIcon={<BiUnite />} label="Pulse" type="number" value={Payload.pulse} onChange={handlePayload} id="pulse" />


                        <RadioGroup onChange={(value) => handleRadioChange(value, 'headteetheyesnosethroat')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>head teeth eyes nose throat</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'thyroid')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>thyroid</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'chest')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>chest</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'breasts')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>breasts</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'cardiovascular')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>cardiovascular</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'abdomen')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>abdomen</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'varicoseveins')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>varicose veins</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'neurologicalexam')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>neurological exam </Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'externalgenitalia')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>external genitalia </Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'cervixvigina')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>cervix vigina  </Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'uterus')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>uterus</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'adnexa')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>adnexa</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>

                    <Input leftIcon={<FaNoteSticky />} label="Anything Abnormal" value={Payload.anythingabnormal} onChange={handlePayload} id="anythingabnormal" />
                    </SimpleGrid>

                    <Input leftIcon={<FaNoteSticky />} label="Additional Comment" value={Payload.additionalcomment} onChange={handlePayload} id="additionalcomment" />





                    <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
