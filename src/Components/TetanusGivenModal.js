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
import { MdDateRange } from "react-icons/md";



export default function TetanusGivenModal({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);


    const [RadioGroups, setRadioGroups] = useState({
        tetanusfirstdose: "",
        tetanusseconddose: "",
        tetanusthirddose: "",
        tetatusfourthdose: "",
        tetanusfifthdose: "",

    });

    const handleRadioChange = (value, radioGroup) => {
        setRadioGroups((prevRadioGroup) => ({
            ...prevRadioGroup, [radioGroup]: value
        }))

    }


    const [Payload, setPayload] = useState({


        tetanusfirstdosedate: "",
        tetatusseonddosedate: "",
        tetanusthirddosedate: "",
        tetanusfourthdosedate: "",
        tetanusfifthdosedate: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        const mergedPayload = { ...Payload, ...RadioGroups }
        setOldPayload({ ...oldPayload, ["tetanustoxod"]: mergedPayload })
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
            <ModalContent maxW={{ base: "90%", md: "70%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader>Tetanus Toxoid</ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 2 }} spacing={5} mb="5">



                        <RadioGroup onChange={(value) => handleRadioChange(value, 'tetanusfirstdose')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>Tetanus first Dose</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <Stack mt="2">
                            <Input leftIcon={<MdDateRange />} label="Tetanus First Dose Date" type="date" value={Payload.tetanusfirstdosedate} onChange={handlePayload} id="tetanusfirstdosedate" />
                        </Stack>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'tetanusseconddose')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>Tetanus second Dose</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <Stack mt="2">
                            <Input leftIcon={<MdDateRange />} label="Tetanus Second Dose Date" type="date" value={Payload.tetatusseonddosedate} onChange={handlePayload} id="tetatusseonddosedate" />
                        </Stack>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'tetanusthirddose')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>Tetanus third Dose</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <Stack mt="2">
                            <Input leftIcon={<MdDateRange />} label="Tetanus Third Dose Date" type="date" value={Payload.tetanusthirddosedate} onChange={handlePayload} id="tetanusthirddosedate" />
                        </Stack>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'tetatusfourthdose')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>Tetanus forth Dose</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <Stack mt="2">
                            <Input leftIcon={<MdDateRange />} label="Tetanus Forth Dose Date" type="date" value={Payload.tetanusfourthdosedate} onChange={handlePayload} id="tetanusfourthdosedate" />
                        </Stack>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'tetanusfifthdose')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>Tetanus fifth Dose</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <Stack mt="2">
                            <Input leftIcon={<MdDateRange />} label="Tetanus Fifth Dose Date" type="date" value={Payload.tetanusfifthdosedate} onChange={handlePayload} id="tetanusfifthdosedate" />
                        </Stack>


                    </SimpleGrid>






                    <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
