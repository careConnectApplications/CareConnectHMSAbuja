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
import { UpdateWardAPI, SettingsApi, AddWardSettingsApi } from "../Utils/ApiCalls";

import { FaClinicMedical } from "react-icons/fa";
import { FaBed } from "react-icons/fa6";
import { IoMdPricetags } from "react-icons/io";
import { SlPlus } from "react-icons/sl";
import { IoIosCloseCircle } from "react-icons/io";


export default function CreateWardModal({ isOpen, onClose, type, activateNotifications, oldPayload }) {



    const [Settings, setSettings] = useState({});
    const [Loading, setLoading] = useState(false);

    const [Payload, setPayload] = useState({
        bedspecialization: "",
        wardname: "",
        totalbed: "",
        price: "",
        
    });

    const [UpdatedPayload, setUpdatedPayload] = useState({
        bedspecialization: "",
        wardname: "",
        totalbed: "",
        price: "",
       
    });

    const handleUpdatedPayload = (e) => {
        setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value })
    }
    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }



    const getSettings = async () => {
        try {
            const result = await SettingsApi();



            setSettings(result);
        } catch (e) {

        }
    };

    const AddWard = async () => {
        setLoading(true)
        try {
            const result = await AddWardSettingsApi(Payload);

            if (result.status === 200) {
                setLoading(false)
                setPayload({
                    bedspecialization: "",
                    wardname: "",
                    totalbed: "",
                    price: "",
                    
                })

                activateNotifications("Ward Added Successfully", "success")
                onClose()

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    };
    const UpdateWard = async () => {
        setLoading(true)
        try {
            const result = await UpdateWardAPI(UpdatedPayload, oldPayload._id);

          

            if (result.status === 200) {
                setLoading(false)
                activateNotifications("Ward Updated Successfully", "success")
                onClose()

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    };





    useEffect(() => {

        setUpdatedPayload({

            bedspecialization: oldPayload?.bedspecialization,
            wardname: oldPayload?.wardname,
            totalbed: oldPayload?.totalbed,
            price: oldPayload?.price,
            
        })
       
        getSettings();

    }, [isOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{type === "new" ? "Add New Ward" : "Edit Ward"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    {
                        type === "new" ? (
                            <>

                                <Stack spacing="15px">




                                    <Select
                                        id="bedspecialization"
                                        value={Payload.bedspecialization}
                                        onChange={handlePayload}
                                        placeholder="Select Bed Specialization"
                                        border="2px solid"
                                        fontSize={Payload.bedspecialization !== "" ? "16px" : "13px"}
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.clinics?.map((item, i) => (

                                                <option value={`${item.clinic}`} key={i}>{item.clinic}</option>
                                            ))
                                        }

                                    </Select>

                                    <Input val={Payload.wardname !== "" ? true : false} leftIcon={<FaClinicMedical />} onChange={handlePayload} id="wardname" value={Payload.wardname} label="Ward Name" />
                                    <Input val={Payload.totalbed !== "" ? true : false} leftIcon={<FaBed />} onChange={handlePayload} type="number" id="totalbed" value={Payload.totalbed} label="Total bed" />
                                    <Input val={Payload.price !== "" ? true : false} leftIcon={<IoMdPricetags />} onChange={handlePayload} type="number" id="price" value={Payload.price} label="Price" />




                                </Stack>
                                <Button mt="32px" isLoading={Loading} onClick={AddWard}>Add Ward</Button>
                            </>
                        ) : (
                            <>
                                <Stack spacing="15px">

                                <Select
                                        id="bedspecialization"
                                        value={UpdatedPayload.bedspecialization}
                                        onChange={handleUpdatedPayload}
                                        placeholder="Select Bed Specialization"
                                        border="2px solid"
                                        fontSize={UpdatedPayload.bedspecialization !== "" ? "16px" : "13px"}
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.clinics?.map((item, i) => (

                                                <option value={`${item.clinic}`} key={i}>{item.clinic}</option>
                                            ))
                                        }

                                    </Select>

                                    <Input val={UpdatedPayload.wardname !== "" ? true : false} leftIcon={<FaClinicMedical />} onChange={handleUpdatedPayload} id="wardname" value={UpdatedPayload.wardname} label="Ward Name" />
                                    <Input val={UpdatedPayload.totalbed !== "" ? true : false} leftIcon={<FaBed />} onChange={handleUpdatedPayload} type="number" id="totalbed" value={UpdatedPayload.totalbed} label="Total bed" />
                                    <Input val={UpdatedPayload.price !== "" ? true : false} leftIcon={<IoMdPricetags />} onChange={handleUpdatedPayload} type="number" id="price" value={UpdatedPayload.price} label="Price" />
                                    

                                </Stack>
                                <Button mt="32px" isLoading={Loading} onClick={UpdateWard}>Update Ward</Button>
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
