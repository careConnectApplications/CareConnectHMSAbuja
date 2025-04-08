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
import { SettingsApi, AddDeliveryNoteAPI, UpdateDeliveryNoteAPI, GetAllClinicApi, GetAllUsersApi } from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";

export default function CreateDeliveryNoteModal({ isOpen, onClose, setOldPayload, activateNotifications, type, oldPayload }) {

    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [Clinics, setClinics] = useState([]);
    const [Doctors, setDoctors] = useState([]);
    const [Settings, setSettings] = useState("");


    const id = localStorage.getItem('patientId')
    const [Payload, setPayload] = useState({

       note:""

    })
    const [UpdatedPayload, setUpdatedPayload] = useState({
      note:""
    })




    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const handleUpdatedPayload = (e) => {
        setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value })

    }

    const handleSubmitNew = async () => {
        setLoading(true)
        try {
            const result = await AddDeliveryNoteAPI(Payload, id);
        
            if (result.status === 200) {
                setLoading(false)
                setPayload({ 
                     note:""
                })
                activateNotifications("Delivery Note Added Successfully", "success")
                onClose()

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    }

    const handleSubmitUpdate = async () => {
        setLoading(true)
        try {
            const result = await UpdateDeliveryNoteAPI(UpdatedPayload, oldPayload._id);


            if (result.status === 200) {
                setLoading(false)
                activateNotifications("Updated Successfully", "success")
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


    const getAllClinic = async () => {
        try {
            const result = await GetAllClinicApi();
            setClinics(result.queryresult.clinicdetails);
        } catch (e) {
        }
    };
    const getAllUser = async () => {
        try {
            const result = await GetAllUsersApi();

            setDoctors(result.queryresult.userdetails);
        } catch (e) {
        }
    };


    useEffect(() => {
        getAllUser()
        getAllClinic()
        getSettings()

        setUpdatedPayload({
            note: oldPayload?.note,
          
        })

    }, [isOpen, Payload]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader> {type === "new" ? "Add New Delivery Note" : type === "edit" ? "Edit Delivery Note" : "Delivery Note Details"} </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    {
                        type === "new" ? (
                            <>
                                
                                <SimpleGrid mt="18px" mb="5" columns={{ base: 1, md: 1, lg: 1 }} spacing={5}>
                                 
                                    <TextArea leftIcon={<FaNoteSticky />} label="Delivery Note " type='text' value={Payload.note} onChange={handlePayload} id="note" />


                                </SimpleGrid>
                               


                                <Button mt="32px" isLoading={Loading} onClick={handleSubmitNew}>Proceed</Button>

                            </>
                        ) : type === "edit" ? (
                            <>
                                
                                <SimpleGrid mt="18px" mb="5" columns={{ base: 1, md: 1, lg: 1 }} spacing={5}>
                                 
                                    <TextArea leftIcon={<FaNoteSticky />} label="Delivery Note " type='text' value={UpdatedPayload.note} onChange={handleUpdatedPayload} id="note" />


                                </SimpleGrid>
                               


                                <Button mt="32px" isLoading={Loading} onClick={handleSubmitUpdate}>Update</Button>

                            </>
                        ) : (
                            <>
                                
                                <SimpleGrid mt="18px" mb="5" columns={{ base: 1, md: 1, lg: 1 }} spacing={5}>
                                 
                                    <TextArea isDisabled={true} leftIcon={<FaNoteSticky />} label="Delivery Note " type='text' value={UpdatedPayload.note} onChange={handleUpdatedPayload} id="note" />


                                </SimpleGrid>
                               


                               

                            </>
                        )
                    }






                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
