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


export default function MedicalObstetricHistoryModal({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);


    const [RadioGroups, setRadioGroups] = useState({
        previousstillbirthornewbornloss: "",
        historyofthreeormoreconsecutivespontaneousabortions: "",
        birthweightoflastbabylessthan450: "",
        birthweightoflastbabygreaterthan450: "",
        lastpregnancyhospitaladmissionforpeteclampsia: "",
        previoussurgeryonreproductivetract: ""


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
        setOldPayload({ ...oldPayload, ["medicalobsterichistory"]: mergedPayload })
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
                <ModalHeader>Medical Obstetric History</ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                     
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'previousstillbirthornewbornloss')} >
                                <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>Previous Still Birth or Newborn Loss</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                                </Stack>
                            </RadioGroup>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'historyofthreeormoreconsecutivespontaneousabortions')} >
                                <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>history of three or more consecutive spontaneous abortions</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                                </Stack>
                            </RadioGroup>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'birthweightoflastbabylessthan450')} >
                                <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>birth weight of last baby less than 450</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                                </Stack>
                            </RadioGroup>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'birthweightoflastbabygreaterthan450')} >
                                <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>birth weight of last baby greater than 450</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                                </Stack>
                            </RadioGroup>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'lastpregnancyhospitaladmissionforpeteclampsia')} >
                                <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>last pregnancy hospital admission for peteclampsia</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                                </Stack>
                            </RadioGroup>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'previoussurgeryonreproductivetract')} >
                                <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>previous surgery on reproductive tract</Text>
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
