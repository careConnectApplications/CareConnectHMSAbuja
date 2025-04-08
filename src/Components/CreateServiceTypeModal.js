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
import { UpdateServiceTypeSettingAPI, SettingsApi, AddServiceTypeSettingsApi } from "../Utils/ApiCalls";

import { FaClinicMedical } from "react-icons/fa";
import { SlPlus } from "react-icons/sl";
import { IoIosCloseCircle } from "react-icons/io";


export default function CreateServiceTypeModal({ isOpen, onClose, type, activateNotifications, oldPayload }) {





    const [Settings, setSettings] = useState({});
    const [Loading, setLoading] = useState(false);
    const [Types, setTypes] = useState([]);
    const [UpdatedTypes, setUpdatedTypes] = useState([]);
    const [Payload, setPayload] = useState({
        serviceType: "",
        servicecategory: "",
        department: ""
    });

    const [UpdatedPayload, setUpdatedPayload] = useState({
        serviceType: "",
        servicecategory: "",
        department: ""
    });

    const handleUpdatedPayload = (e) => {
        setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value })
    }
    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const addTypes = () => {

        setPayload({ ...Payload, ["serviceType"]: "" })
        setTypes([...Types, Payload.serviceType])

    }
    const addUpdatedTypes = () => {

        setUpdatedPayload({ ...UpdatedPayload, ["serviceType"]: "" })
        setUpdatedTypes([...UpdatedTypes, UpdatedPayload.serviceType])

    }

    const removeTestName = (item) => {

        const updatedTypes = Types.filter(id => id !== item);
        setTypes(updatedTypes);

    }
    const removeUpdatedTypes = (item) => {

        const updatedTypes = UpdatedTypes.filter(id => id !== item);
        setUpdatedTypes(updatedTypes);

    }




    const getSettings = async () => {
        try {
            const result = await SettingsApi();



            setSettings(result);
        } catch (e) {

        }
    };

    const AddServiceType = async () => {
        setLoading(true)
        try {
            const result = await AddServiceTypeSettingsApi({
                servicetype: Types,
                servicecategory: Payload.servicecategory,
                department: Payload.department
            });

            if (result.status === 200) {
                setLoading(false)
                setPayload({
                    serviceType: "",
                    servicecategory: "",
                    department: ""
                })

                activateNotifications("Service Types Added Successfully", "success")
                onClose()

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    };
    const UpdateServiceType = async () => {
        setLoading(true)
        try {
            const result = await UpdateServiceTypeSettingAPI({
                servicetype: UpdatedTypes,
                servicecategory: UpdatedPayload.servicecategory,
                department: UpdatedPayload.department
            },oldPayload._id);


            if (result.status === 200) {
                setLoading(false)
                activateNotifications("Clinic Updated Successfully", "success")
                onClose()

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    };





    useEffect(() => {

        setUpdatedPayload({
           
            servicecategory: oldPayload?.category,
            department: oldPayload?.department
        })
        setUpdatedTypes(oldPayload?.type)
        getSettings();

    }, [isOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader>{type === "new" ? "Add New Service Type" : "Edit Service Type"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    {
                        type === "new" ? (
                            <>

                                <Stack spacing="15px">




                                    <Select
                                        id="servicecategory"
                                        value={Payload.servicecategory}
                                        onChange={handlePayload}
                                        placeholder="Select Service Category"
                                        border="2px solid"
                                        fontSize={Payload.servicecategory !== "" ? "16px" : "13px"}
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.category?.map((item, i) => (

                                                <option value={`${item}`} key={i}>{item}</option>
                                            ))
                                        }

                                    </Select>

                                    <Select
                                        id="department"
                                        value={Payload.department}
                                        onChange={handlePayload}
                                        placeholder="Select Department"
                                        border="2px solid"
                                        borderColor="gray.500"
                                        fontSize={Payload.department !== "" ? "16px" : "13px"}
                                    >
                                        {
                                            Settings?.clinics?.map((item, i) => (

                                                <option value={`${item.clinic}`} key={i}>{item.clinic}</option>
                                            ))
                                        }
                                    </Select>



                                    <Flex justifyContent={"space-between"} alignItems={"center"} mb="15px">
                                        <Input w='90%' val={Payload.serviceType !== "" ? true : false} leftIcon={<FaClinicMedical />} onChange={handlePayload} id="serviceType" value={Payload.serviceType} label="Service Type" />
                                        <Button w="150px" rightIcon={<SlPlus />} onClick={addTypes}>Add</Button>
                                    </Flex>


                                    <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>

                                        {
                                            Types?.map((item, i) => (

                                                <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"25px"} fontSize="13px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                                    <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                                    <Box fontSize="20px" color="#fff" onClick={() => removeTestName(item)}><IoIosCloseCircle /></Box>
                                                </Flex>
                                            ))
                                        }

                                    </SimpleGrid>
                                </Stack>
                                <Button mt="32px" isLoading={Loading} onClick={AddServiceType}>Add Service Type</Button>
                            </>
                        ) : (
                            <>
                                <Stack spacing="15px">

                                    <Select
                                        id="servicecategory"
                                        value={UpdatedPayload.servicecategory}
                                        onChange={handleUpdatedPayload}
                                        placeholder="Select Service Category"
                                        border="2px solid"
                                        fontSize={UpdatedPayload.servicecategory !== "" ? "16px" : "13px"}
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.category?.map((item, i) => (

                                                <option value={`${item}`} key={i}>{item}</option>
                                            ))
                                        }

                                    </Select>

                                    <Select
                                        id="department"
                                        value={UpdatedPayload.department}
                                        onChange={handleUpdatedPayload}
                                        placeholder="Select Department"
                                        border="2px solid"
                                        borderColor="gray.500"
                                        fontSize={UpdatedPayload.department !== "" ? "16px" : "13px"}
                                    >
                                        {
                                            Settings?.clinics?.map((item, i) => (

                                                <option value={`${item.clinic}`} key={i}>{item.clinic}</option>
                                            ))
                                        }
                                    </Select>



                                    <Flex justifyContent={"space-between"} alignItems={"center"} mb="15px">
                                        <Input w='90%' val={UpdatedPayload.serviceType !== "" ? true : false} leftIcon={<FaClinicMedical />} onChange={handleUpdatedPayload} id="serviceType" value={UpdatedPayload.serviceType} label="Service Type" />
                                        <Button w="150px" rightIcon={<SlPlus />} onClick={addUpdatedTypes}>Add</Button>
                                    </Flex>




                                    <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>

                                        {
                                            UpdatedTypes?.map((item, i) => (

                                                <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"25px"} fontSize="13px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                                    <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                                    <Box fontSize="20px" color="#fff" onClick={() => removeUpdatedTypes(item)}><IoIosCloseCircle /></Box>
                                                </Flex>
                                            ))
                                        }

                                    </SimpleGrid>
                                </Stack>
                                <Button mt="32px" isLoading={Loading} onClick={UpdateServiceType}>Update Service Type</Button>
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
