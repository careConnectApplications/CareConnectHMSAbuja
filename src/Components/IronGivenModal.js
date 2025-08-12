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



export default function IronGivenModal({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);


    const [RadioGroups, setRadioGroups] = useState({
        prescription: "",
        tablets: "",
       

    });

    const handleRadioChange = (value, radioGroup) => {
        setRadioGroups((prevRadioGroup) => ({
            ...prevRadioGroup, [radioGroup]: value
        }))

    }


    const [Payload, setPayload] = useState({


        ironfolategivendate: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        const mergedPayload = { ...Payload, ...RadioGroups }
        setOldPayload({ ...oldPayload, "ironfolategiven": mergedPayload })
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
                <ModalHeader>Iron Given</ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 2 }} spacing={5} mb="5">



                        <RadioGroup onChange={(value) => handleRadioChange(value, 'prescription')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>prescription</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                       
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'tablets')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>tablets</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                       
                     
                        


                    </SimpleGrid>

                    <Input leftIcon={<MdDateRange />} label="Iron/Folate Given Date" type="date" value={Payload.ironfolategivendate} onChange={handlePayload} id="ironfolategivendate" />

                    <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
