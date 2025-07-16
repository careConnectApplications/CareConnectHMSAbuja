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
import { UpdateExaminedPatientAPI, TakeVitalApi } from "../Utils/ApiCalls";
import { FaTemperatureHigh, FaHeartCircleCheck } from "react-icons/fa6";
import { FaTextHeight, FaHeartbeat } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { GiEnergyBreath } from "react-icons/gi";
import { GiWeight } from "react-icons/gi";
import { TbMichelinStarFilled } from "react-icons/tb";
import { FaNoteSticky } from "react-icons/fa6";
import { FaPercent } from "react-icons/fa";
import { SiHeadspace } from "react-icons/si";

export default function PostnatalHistoryModal({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);


    const [RadioGroups, setRadioGroups] = useState({
        stressors: "",
        pregnancymedication:"",
        cigarettealcoholuse:"",
        delivery:"",
        deliverytype:"",
        emergencydelivery:"",
        labourinduction:"",
        birthhistorymedication:"",
        assisteddelivery:"",
        typeofassisteddelivery:"",
        complicationsduringdelivery:"",
        apgarscoreafteroneminute:"",
        apgarscoreafterfiveminutes:"",
        useofoxygenafterbirth:"",
        feedingofthechild:"",
        difficultyinlatchingsucking:"",



       
        

    });

    const handleRadioChange = (value, radioGroup) => {
        setRadioGroups((prevRadioGroup) => ({
            ...prevRadioGroup, [radioGroup]: value
        }))

    }


    const [Payload, setPayload] = useState({

        stressorsnote:"",
        pregnancymedicationnote:"",
        cigarettealcoholusenote:"",
        deliverynote:"",
        deliverytypenote:"",
        emergencydeliverynote:"",
        labourinductionnote:"",
        birthhistorymedicationnote:"",
        assisteddeliverynote:"",
        typeofassisteddeliverynote:"",
        complicationsduringdeliverynote:"",
        birthweight:"",
        birthlengthheight:"",
        feedingofthechildnote:"",
        difficultyinlatchingsuckingnote:""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        const mergedPayload = { ...Payload, ...RadioGroups }
        setOldPayload({ ...oldPayload, "prepostnatalhistory": mergedPayload })
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
                <ModalHeader>Prenatal History Details </ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'stressors')} >
                                <Text fontSize="15px" fontWeight={"700"}>Stressors</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Stressors Note" value={Payload.stressorsnote} onChange={handlePayload} id="stressorsnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'pregnancymedication')} >
                                <Text fontSize="15px" fontWeight={"700"}>Pregnancy Medication</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Pregnancy Medication Note" value={Payload.pregnancymedicationnote} onChange={handlePayload} id="pregnancymedicationnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'cigarettealcoholuse')} >
                                <Text fontSize="15px" fontWeight={"700"}>Cigarette Alcohol Use</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Cigarette Alcohol Use Note" value={Payload.cigarettealcoholusenote} onChange={handlePayload} id="cigarettealcoholusenote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'delivery')} >
                                <Text fontSize="15px" fontWeight={"700"}>Delivery </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Pre Term'>Pre Term</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Term'>Term</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Delivery Note" value={Payload.deliverynote} onChange={handlePayload} id="deliverynote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'deliverytype')} >
                                <Text fontSize="15px" fontWeight={"700"}>Delivery Type</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Virginal Delivery'>Virginal Delivery</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Caesarean Section'>Caesarean Section</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Delivery Type Note" value={Payload.deliverytypenote} onChange={handlePayload} id="deliverytypenote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'emergencydelivery')} >
                                <Text fontSize="15px" fontWeight={"700"}>Emergency Delivery</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Emergency Delivery Note" value={Payload.emergencydeliverynote} onChange={handlePayload} id="emergencydeliverynote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'labourinduction')} >
                                <Text fontSize="15px" fontWeight={"700"}>Labour Induction</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Labour Induction Note" value={Payload.labourinductionnote} onChange={handlePayload} id="labourinductionnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'birthhistorymedication')} >
                                <Text fontSize="15px" fontWeight={"700"}>Birth History Medication</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Birth History Medication Note" value={Payload.birthhistorymedicationnote} onChange={handlePayload} id="birthhistorymedicationnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'assisteddelivery')} >
                                <Text fontSize="15px" fontWeight={"700"}>Assisted Delivery </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Assisted Delivery Note" value={Payload.assisteddeliverynote} onChange={handlePayload} id="assisteddeliverynote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'typeofassisteddelivery')} >
                                <Text fontSize="15px" fontWeight={"700"}>Type of Assisted Delivery</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Vacuum Assisted'>Vacuum Assisted</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Forceps'>Forceps</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Type of Assisted Delivery Note" value={Payload.typeofassisteddeliverynote} onChange={handlePayload} id="typeofassisteddeliverynote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'complicationsduringdelivery')} >
                                <Text fontSize="15px" fontWeight={"700"}>Complications During Delivery </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Complications During Delivery Note" value={Payload.complicationsduringdeliverynote} onChange={handlePayload} id="complicationsduringdeliverynote" />

                        </Stack>

                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'apgarscoreafteroneminute')} >
                                <Text fontSize="15px" fontWeight={"700"}>Apgar Score After One Minute </Text>
                                <Stack direction='row' flexWrap="wrap">
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='1'>1</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='2'>2</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='3'>3</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='4'>4</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='5'>5</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='6'>6</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='7'>7</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='8'>8</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='9'>9</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='10'>10</Radio>

                                </Stack>
                            </RadioGroup>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'apgarscoreafterfiveminutes')} >
                                <Text fontSize="15px" fontWeight={"700"}>Apgar Score After Five Minutes</Text>
                                <Stack direction='row' flexWrap="wrap">
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='1'>1</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='2'>2</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='3'>3</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='4'>4</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='5'>5</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='6'>6</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='7'>7</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='8'>8</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='9'>9</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='10'>10</Radio>

                                </Stack>
                            </RadioGroup>

                        </Stack>

                        <Input type="text" leftIcon={<FaNoteSticky />} label="Birth Weight" value={Payload.birthweight} onChange={handlePayload} id="birthweight" />
                        <Input type="text" leftIcon={<FaNoteSticky />} label="Birth Length / Height" value={Payload.birthlengthheight} onChange={handlePayload} id="birthlengthheight" />

                        <RadioGroup onChange={(value) => handleRadioChange(value, 'useofoxygenafterbirth')} >
                                <Text fontSize="15px" fontWeight={"700"}>Use Of Oxygen After Birth</Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>


                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'feedingofthechild')} >
                                <Text fontSize="15px" fontWeight={"700"}>Feeding Of The child </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Exclusive Breastfeeding'>Exclusive Breastfeeding</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Bottle Feeding'>Bottle Feeding</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Both'>Both</Radio>

                                </Stack>



                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Feeding Of The child Note" value={Payload.feedingofthechildnote} onChange={handlePayload} id="feedingofthechildnote" />

                        </Stack>
                        <Stack spacing={5}>
                            <RadioGroup onChange={(value) => handleRadioChange(value, 'difficultyinlatchingsucking')} >
                                <Text fontSize="15px" fontWeight={"700"}>Difficulty In Latching/Sucking </Text>
                                <Stack direction='row'>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Yes'>Yes</Radio>
                                    <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No'>No</Radio>

                                </Stack>
                            </RadioGroup>
                            <Input type="text" leftIcon={<FaNoteSticky />} label="Difficulty In Latching/Sucking Note" value={Payload.difficultyinlatchingsuckingnote} onChange={handlePayload} id="difficultyinlatchingsuckingnote" />

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
