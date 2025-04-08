import { HStack, Text } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import moment from "moment";
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
import PrintCard from "./PrintCard";
import ExamineDetailsCard from "./ExamineDetailsCard";

export default function ExamineDetails({ isOpen, onClose, type, activateNotifications, oldPayload }) {




    useEffect(() => {

       
    }, [isOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }}>
                <ModalHeader> Details of {`${oldPayload?.patient?.firstName} ${oldPayload?.patient?.lastName}`} Examined Report  </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <SimpleGrid mt="32px" columns={{ base: 2, md: 2 }} spacing={10}>
                        <PrintCard title="appointment category" value={oldPayload.appointmentcategory} />
                        <PrintCard title="appointment type" value={oldPayload.appointmenttype} />
                        <PrintCard title="appointment id" value={oldPayload.appointmentid} />
                        <PrintCard title="appointment date" value={moment(oldPayload.appointmentdate).format("lll")} />
                       
                    </SimpleGrid>
                    <SimpleGrid mt="32px" columns={{ base: 1, md: 2 }} spacing={10}>
                        <ExamineDetailsCard title="diagnosis" value={oldPayload.diagnosis} />
                        <ExamineDetailsCard title="findings" value={oldPayload.findings}  />
                        <ExamineDetailsCard title="notes" value={oldPayload.notes}  />
                        <ExamineDetailsCard title="attending doctor" value={`${oldPayload?.doctor?.firstName} ${oldPayload?.doctor?.lastName}`}  />
                       
                    </SimpleGrid>


                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
