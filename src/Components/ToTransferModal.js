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
    Stack, Select, Flex, SimpleGrid, Box
} from '@chakra-ui/react'
import Input from "./Input";
import Button from "./Button";
import { UpdateAdmissionStatusAPI, SettingsApi, GetAllWardApi } from "../Utils/ApiCalls";

import { FaClinicMedical } from "react-icons/fa";
import { FaBed } from "react-icons/fa6";
import { IoMdPricetags } from "react-icons/io";
import { SlPlus } from "react-icons/sl";
import { IoIosCloseCircle } from "react-icons/io";


export default function ToTransferModal({ isOpen, onClose, type, activateNotifications, oldPayload }) {

    const [Ward, setWard] = useState([]);
    const [Loading, setLoading] = useState(false);

    const [Payload, setPayload] = useState({
        
    transfterto:"",
    status:"totransfer"
    });

   

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const getAllWard = async () => {
        try {
          const result = await GetAllWardApi();
          setWard(result.queryresult.wardmanagementdetails);
    
        } catch (e) {
          activateNotifications(e.message, "error");
        }
      };



    

   

    
    const handleStatusUpdate = async () => {
        
        try {
            const result = await UpdateAdmissionStatusAPI( { status: "totransfer", transfterto: Payload.transfterto } ,oldPayload.id);
       
            if (result.status === 200) {
              
                
                activateNotifications("Patient Transferred Successfully", "success")
                onClose()

            }

        } catch (e) {
           
            activateNotifications(e.message, "error")
        }
    }
    




    useEffect(() => {

       
        getAllWard()
       

    }, [isOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Transfer Patient</ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                                <Stack spacing="15px">




                                    <Select
                                        id="transfterto"
                                        value={Payload.transfterto}
                                        onChange={handlePayload}
                                        placeholder="Select Ward To Transfer "
                                        border="2px solid"
                                        fontSize={Payload.transfterto !== "" ? "16px" : "13px"}
                                        borderColor="gray.500"
                                    >
                                        {
                                            Ward?.map((item, i) => (

                                                <option key={i} value={item._id}>{item.wardname}</option>
                                            ))
                                        }

                                    </Select>

                                 
                                </Stack>
                                <Button mt="32px" isLoading={Loading} onClick={handleStatusUpdate}>Transfer Patient</Button>
                


                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
