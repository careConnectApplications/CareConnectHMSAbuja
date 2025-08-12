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
    Stack, SimpleGrid, Select, CheckboxGroup, Checkbox
} from '@chakra-ui/react'
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import { FaNoteSticky } from "react-icons/fa6";
import { SettingsApi } from "../Utils/ApiCalls";


export default function ImmunizationHistoryModal({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);

    const [CheckedItems, setCheckedItems] = useState({

        hepb0: false,
        opv0: false,
        bcg: false,
        opv1: false,
        penta1: false,
        pcv1: false,
        rota1: false,
        opv2: false,
        pcv2: false,
        rota2: false,
        opv3: false,
        penta3: false,
        pcv3: false,
        rota3: false,
        ipv: false,
        vitamina1: false,
        vitamina2: false,
        measles: false,
        yellowfever: false,
        mena: false,
        measles2: false,
        hpv914: false,
        llin: false







    });

    const handleCheckBoxChange = (event) => {
        setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems, [event.target.value]: event.target.checked
        }))

    }



    const [Payload, setPayload] = useState({

        immunization: "",

    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    
    const save = () => {

        const mergedPayload = { ...Payload, ...CheckedItems }
        setOldPayload({ ...oldPayload, "immunizationhistory": mergedPayload })
        activateNotifications("Saved Successfully", "success")
        onClose()
    }



    const [Settings, setSettings] = useState("");

    const getSettings = async () => {
        try {
            const result = await SettingsApi();

            setSettings(result);
        } catch (e) {

        }
    };




    const [Disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (Object.values(Payload).some(value => value !== null && value !== "" && value !== undefined) || Object.values(CheckedItems).some(value => value !== null && value !== "" && value !== undefined)) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
        getSettings()
    }, [isOpen, Payload]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "70%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader>Immunization History Details </ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    <Select h="45px" borderWidth="2px" fontSize={Payload.immunization !== "" ? "16px" : "13px"} borderColor="#6B7280" id="immunization" value={Payload.immunization} onChange={handlePayload} placeholder="Select Immunization" >
                        {
                            Settings?.immunization?.map((item, i) => (
                                <option value={`${item}`} key={i}>{item}</option>

                            ))
                        }

                    </Select>

                    <Text mt="5" fontSize="18px" fontWeight={"700"} color="blue.blue500">Antigens</Text>


                    <SimpleGrid mt="12px" columns={{ base: 2, md: 4, lg: 6 }} spacing={5}>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.hepb0} value='hepb0'><Text textTransform="uppercase"> Hep. B 0</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.opv0} value='opv0'><Text textTransform="uppercase"> opv0</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.bcg} value='bcg'><Text textTransform="uppercase"> bcg</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.opv1} value='opv1'><Text textTransform="uppercase"> opv1</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.penta1} value='penta1'><Text textTransform="uppercase"> penta1</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.pcv1} value='pcv1'><Text textTransform="uppercase"> pcv1</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.rota1} value='rota1'><Text textTransform="uppercase"> rota1</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.opv2} value='opv2'><Text textTransform="uppercase"> opv2</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.pcv2} value='pcv2'><Text textTransform="uppercase"> pcv2</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.rota2} value='rota2'><Text textTransform="uppercase"> rota2</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.opv3} value='opv3'><Text textTransform="uppercase"> opv3</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.penta3} value='penta3'><Text textTransform="uppercase"> penta3</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.pcv3} value='pcv3'><Text textTransform="uppercase"> pcv3</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.rota3} value='rota3'><Text textTransform="uppercase"> rota3</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.ipv} value='ipv'><Text textTransform="uppercase"> ipv</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.vitamina1} value='vitamina1'><Text textTransform="uppercase"> vitamina1</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.vitamina2} value='vitamina2'><Text textTransform="uppercase"> vitamina2</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.measles} value='measles'><Text textTransform="uppercase"> measles</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.yellowfever} value='yellowfever'><Text textTransform="uppercase"> yellowfever</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.mena} value='mena'><Text textTransform="uppercase"> mena</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.measles2} value='measles2'><Text textTransform="uppercase"> measles2</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.hpv914} value='hpv914'><Text textTransform="uppercase"> hpv914</Text></Checkbox>
                        <Checkbox colorScheme='orange' onChange={handleCheckBoxChange} isChecked={CheckedItems.llin} value='llin'><Text textTransform="uppercase"> llin</Text></Checkbox>


                    </SimpleGrid>




                    <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
