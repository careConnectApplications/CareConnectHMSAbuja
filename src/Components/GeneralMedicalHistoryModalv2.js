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



export default function GeneralMedicalHistoryModalv2({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);


    const [RadioGroups, setRadioGroups] = useState({
        diabetesmellitus: "",
        renaldisease: "",
        cardiacdisease: "",
        sicklecelldisease: "",
        hivpositive: "",
        asthma: "",
        epilepsy: "",
        htn: "",
        scd: "",
        dm: "",


    });

    const handleRadioChange = (value, radioGroup) => {
        setRadioGroups((prevRadioGroup) => ({
            ...prevRadioGroup, [radioGroup]: value
        }))

    }


    const [Payload, setPayload] = useState({

        anyotherseveremedicaldeseaseorconditionspecify: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        const mergedPayload = { ...Payload, ...RadioGroups }
        setOldPayload({ ...oldPayload, "generalmedicalhistory": mergedPayload })
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
                <ModalHeader>General Medical History</ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 2 }} spacing={5} mb="5">

                        <RadioGroup onChange={(value) => handleRadioChange(value, 'diabetesmellitus')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>diabetes mellitus</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'renaldisease')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>renal disease</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'cardiacdisease')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>cardiac disease</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'sicklecelldisease')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>sickle cell disease</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'hivpositive')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>hiv positive</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'asthma')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>asthma</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'epilepsy')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>epilepsy</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'htn')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>htn</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'scd')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>scd</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'dm')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>dm</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>

                    </SimpleGrid>

                    <Input leftIcon={<FaNoteSticky />} label="Any Other Severe Medical Disease Or Condition Specify" value={Payload.anyotherseveremedicaldeseaseorconditionspecify} onChange={handlePayload} id="anyotherseveremedicaldeseaseorconditionspecify" />





                    <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
