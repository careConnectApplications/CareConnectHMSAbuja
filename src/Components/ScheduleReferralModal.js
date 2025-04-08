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
    Stack, SimpleGrid, Select, Flex
} from '@chakra-ui/react'
import { SlPlus } from "react-icons/sl";
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import ReferralDiagnosisCard from "./ReferralDiagnosisCard";
import { FaNoteSticky } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoColorFilter } from "react-icons/io5";
import { SettingsApi, AddReferralScheduleAPI } from "../Utils/ApiCalls";


export default function ScheduleReferralModal({ isOpen, onClose, setOldPayload, activateNotifications, type, oldPayload }) {

   
    const [Loading, setLoading] = useState(false);

    const [Settings, setSettings] = useState("");


    const id = localStorage.getItem('patientId')

    const [Payload, setPayload] = useState({


        reason: "",
        appointmentdate: "",
        appointmentcategory: "",
        appointmenttype: ""

    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const handleSubmitNew = async () => {
        setLoading(true)
        try {
            const result = await AddReferralScheduleAPI(Payload, oldPayload._id);

            if (result.status === 200) {
                setLoading(false)
                setPayload({

                    status: ""
                })
                activateNotifications("Patient Scheduled Successfully", "success")
                onClose()

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
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



    }, [isOpen, Payload]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader> Schedule Referred Patient  </ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    <>

                        <SimpleGrid mt="18px" mb="5" columns={{ base: 1, md: 1, lg: 1 }} spacing={5}>

                        <Input leftIcon={<FaCalendarAlt />}  label="Appointment Date" type='datetime-local' value={Payload.appointmentdate} onChange={handlePayload} id="appointmentdate" />


                            <Select

                                onChange={handlePayload}
                                placeholder="Select Appointment Category"
                                id="appointmentcategory" value={Payload.appointmentcategory}
                                fontSize={Payload.appointmentcategory !== "" ? "16px" : "13px"}
                                size="lg"
                                border="2px solid"
                                borderColor="gray.500"
                            >
                                {
                                    Settings?.servicecategory?.map((item, i) => (

                                        <option key={i} value={item.category}>{item.category}</option>
                                    ))
                                }

                            </Select>

                            {
                                Payload.appointmentcategory !== "" && (
                                    <Select

                                        onChange={handlePayload}
                                        placeholder="Select Service Type"
                                        border="2px solid"
                                        id="appointmenttype" value={Payload.appointmenttype}
                                        size="lg"
                                        fontSize={Payload.appointmenttype !== "" ? "16px" : "13px"}
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.servicecategory?.filter(item => item.category === Payload.appointmentcategory)[0]?.type?.map((item, i) => (
                                                <option key={i} value={item}>{item}</option>
                                            )



                                            )
                                        }

                                    </Select>
                                )
                            }

                            <Input leftIcon={<FaNoteSticky />} label="Reason " type='text' value={Payload.reason} onChange={handlePayload} id="reason" />



                        </SimpleGrid>



                        <Button mt="32px" isLoading={Loading} onClick={handleSubmitNew}>Schedule</Button>

                    </>






                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
