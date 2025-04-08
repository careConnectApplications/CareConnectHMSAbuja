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


export default function CurrentHistoryModal({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);


    const [RadioGroups, setRadioGroups] = useState({
        diagnosedsuspectedmultipleprenancy: "",
        agelessthan16: "",
        agemorethan40: "",
        rhesusnegative: "",
        vaginalbleeding: "",
        pelvicmass: "",
        diastolicbpgreaterthan90: ""
    });

    const handleRadioChange = (value, radioGroup) => {
        setRadioGroups((prevRadioGroup) => ({
            ...prevRadioGroup, [radioGroup]: value
        }))

    }


    const [Payload, setPayload] = useState({


    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        const mergedPayload = { ...Payload, ...RadioGroups }
        setOldPayload({ ...oldPayload, ["currenthistory"]: mergedPayload })
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
                <ModalHeader>Current History</ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <RadioGroup onChange={(value) => handleRadioChange(value, 'diagnosedsuspectedmultipleprenancy')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>diagnosed suspected multiple prenancy</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'agelessthan16')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>age less than 16</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'agemorethan40')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>age more than 40</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'rhesusnegative')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>rhesus negative</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'vaginalbleeding')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>vaginal bleeding</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'pelvicmass')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>pelvic mass</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'diastolicbpgreaterthan90')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>diastolic bp greater than 90</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>





                    </SimpleGrid>




                    <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
