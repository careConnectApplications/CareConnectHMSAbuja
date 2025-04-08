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
import { SettingsApi, AddReferralResponseAPI, UpdateDeliveryNoteAPI, GetAllClinicApi, GetAllUsersApi } from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";

export default function ProcessReferralModal({ isOpen, onClose, setOldPayload, activateNotifications, type, oldPayload }) {

    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [Clinics, setClinics] = useState([]);
    const [Doctors, setDoctors] = useState([]);
    const [Settings, setSettings] = useState("");


    const id = localStorage.getItem('patientId')

    const [Payload, setPayload] = useState({

        status: ""

    })
  
    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const handleSubmitNew = async () => {
        setLoading(true)
        try {
            const result = await AddReferralResponseAPI({status : Payload.status  === "true" ? true: false}, oldPayload._id);

            if (result.status === 200) {
                setLoading(false)
                setPayload({

                    status: ""
                })
                activateNotifications("Response Submitted Successfully", "success")
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
            console.log(e.message, "error");
        }
    };
    const getAllUser = async () => {
        try {
            const result = await GetAllUsersApi();

            setDoctors(result.queryresult.userdetails);
        } catch (e) {
            console.log(e.message, "error");
        }
    };


    useEffect(() => {
        getAllUser()
        getAllClinic()
        getSettings()

       

    }, [isOpen, Payload]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader> Process Referral  </ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    <>

                        <SimpleGrid mt="18px" mb="5" columns={{ base: 1, md: 1, lg: 1 }} spacing={5}>

                            <Select  h="45px" borderWidth="2px" fontSize={Payload.status !== "" ? "16px" : "13px"} borderColor="#6B7280" id="status" value={Payload.status} onChange={handlePayload} placeholder="Select Response" >

                                        <option value={"true"}>Accept Referral</option>
                                        <option value={"false"}>Reject Referral</option>


                            </Select>


                        </SimpleGrid>



                        <Button mt="32px" isLoading={Loading} onClick={handleSubmitNew}>Submitted Response</Button>

                    </>






                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
