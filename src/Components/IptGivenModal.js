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



export default function IptGivenModal({ isOpen, onClose, type, setOldPayload, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);


    const [RadioGroups, setRadioGroups] = useState({
        iptfirstdose: "",
        iptseconddose: "",
        iptthirddose: "",
        iptfourthdose: "",
        iptfifthdose: "",
        iptsixthdose: "",
        

    });

    const handleRadioChange = (value, radioGroup) => {
        setRadioGroups((prevRadioGroup) => ({
            ...prevRadioGroup, [radioGroup]: value
        }))

    }


    const [Payload, setPayload] = useState({


        iptfirstdosedate: "",
        iptseconddosedate: "",
        iptthirddosedate:"",
        iptfourthdosedate: "",
        iptfifthdosedate: "",
        iptsixthdosedate: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        const mergedPayload = { ...Payload, ...RadioGroups }
        setOldPayload({ ...oldPayload, ["ipt"]: mergedPayload })
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
                <ModalHeader>IPT Given</ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    <SimpleGrid mt="12px" columns={{ base: 1, md: 2, lg: 2 }} spacing={5} mb="5">



                        <RadioGroup onChange={(value) => handleRadioChange(value, 'iptfirstdose')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>IPT first Dose</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <Stack mt="2">
                            <Input leftIcon={<MdDateRange />} label="IPT First Dose Date" type="date" value={Payload.iptfirstdosedate} onChange={handlePayload} id="iptfirstdosedate" />
                        </Stack>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'iptseconddose')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>IPT second Dose</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <Stack mt="2">
                            <Input leftIcon={<MdDateRange />} label="IPT Second Dose Date" type="date" value={Payload.iptseconddosedate} onChange={handlePayload} id="iptseconddosedate" />
                        </Stack>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'iptthirddose')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>IPT third Dose</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <Stack mt="2">
                            <Input leftIcon={<MdDateRange />} label="IPT Third Dose Date" type="date" value={Payload.iptthirddosedate} onChange={handlePayload} id="iptthirddosedate" />
                        </Stack>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'iptfourthdose')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>IPT forth Dose</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <Stack mt="2">
                            <Input leftIcon={<MdDateRange />} label="IPT Forth Dose Date" type="date" value={Payload.iptfourthdosedate} onChange={handlePayload} id="iptfourthdosedate" />
                        </Stack>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'iptfifthdose')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>IPT fifth Dose</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <Stack mt="2">
                            <Input leftIcon={<MdDateRange />} label="IPT Fifth Dose Date" type="date" value={Payload.iptfifthdosedate} onChange={handlePayload} id="iptfifthdosedate" />
                        </Stack>
                        <RadioGroup onChange={(value) => handleRadioChange(value, 'iptsixthdose')} >
                            <Text fontSize="15px" textTransform={"capitalize"} fontWeight={"700"}>IPT sixth Dose</Text>
                            <Stack direction='row'>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"true"}>True</Radio>
                                <Radio size='md' borderColor="#6B7280" colorScheme='orange' value={"false"}>False</Radio>

                            </Stack>
                        </RadioGroup>
                        <Stack mt="2">
                            <Input leftIcon={<MdDateRange />} label="IPT Sixth Dose Date" type="date" value={Payload.iptsixthdosedate} onChange={handlePayload} id="iptsixthdosedate" />
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
