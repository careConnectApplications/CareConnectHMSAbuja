import { HStack, Text } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Stack, SimpleGrid
} from '@chakra-ui/react'
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import { UpdateExaminedPatientAPI, SettingsApi, ExaminePatientApi } from "../Utils/ApiCalls";
import { MdMiscellaneousServices } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";


export default function ExamineModal({ isOpen, onClose, type, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);
    const [Payload, setPayload] = useState({

        findings: "",
        diagnosis: "",
        notes: ""
    })
    const [UpdatedPayload, setUpdatedPayload] = useState({
        servicecategory: "",
        amount: "",
        servicetype: ""
    });

    const handleUpdatedPayload = (e) => {
        setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value })
    }
    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })
    }



    const ExaminePatient = async () => {
        setLoading(true)
        try {
            const result = await ExaminePatientApi(Payload, id);



            if (result.status === 200) {
                setLoading(false)
                setPayload({

                    findings: "",
                    diagnosis: "",
                    notes: ""
                })

                activateNotifications("Examination Done Successfully", "success")
                onClose()

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    };

    const UpdateExamination = async () => {
        setLoading(true)
        try {
            const result = await UpdateExaminedPatientAPI(UpdatedPayload, oldPayload._id);

           
            if (result.status === 200) {
                setLoading(false)
                onClose()
                activateNotifications("Examination Updated Successfully", "success")

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    };





    useEffect(() => {

        setUpdatedPayload({
            findings: oldPayload.findings,
            diagnosis: oldPayload.diagnosis,
            notes: oldPayload.notes

           
        })
    }, [isOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }}>
                <ModalHeader> {type === "new" ? "Examine Patient" : "Edit Examined Patient"} </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    {
                        type === "new" ? (
                            <>
                                <SimpleGrid mt="32px" columns={{ base: 1, md: 2 }} spacing={10}>
                                    <TextArea label="Findings" value={Payload.findings} onChange={handlePayload} id="findings" />
                                    <TextArea label="Diagnosis" value={Payload.diagnosis} onChange={handlePayload} id="diagnosis" />
                                    <TextArea label="Notes" value={Payload.notes} onChange={handlePayload} id="notes" />
                                </SimpleGrid>

                                <Button mt="32px" onClick={ExaminePatient} isLoading={Loading} disabled={Payload.findings !=="" 
                                && Payload.diagnosis !=="" && Payload.notes !=="" ?  false: true }>Submit</Button>
                            </>

                        ) : (
                            <>
                                <SimpleGrid mt="32px" columns={{ base: 1, md: 2 }} spacing={10}>
                                    <TextArea label="Findings" value={UpdatedPayload.findings} onChange={handleUpdatedPayload} id="findings" />
                                    <TextArea label="Diagnosis" value={UpdatedPayload.diagnosis} onChange={handleUpdatedPayload} id="diagnosis" />
                                    <TextArea label="Notes" value={UpdatedPayload.notes} onChange={handleUpdatedPayload} id="notes" />
                                </SimpleGrid>

                                <Button mt="32px" onClick={UpdateExamination} isLoading={Loading}>Update Examination</Button>
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
