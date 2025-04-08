import { Box, HStack, Radio, RadioGroup, Text } from '@chakra-ui/react'
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
import { SettingsApi, AddProcedureAPI, UpdateProcedureAPI, GetAllClinicApi, GetAllUsersApi } from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";
import { IoIosCloseCircle } from 'react-icons/io';

export default function CreateProcedureModal({ isOpen, onClose, setOldPayload, activateNotifications, type, oldPayload }) {

    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [Clinics, setClinics] = useState([]);
    const [Settings, setSettings] = useState("");


    const id = localStorage.getItem('patientId')
    const [Payload, setPayload] = useState({

        clinic: "",
        indicationdiagnosisprocedure: "",
        procedure: "",
        appointmentdate: "",
        cptcodes: "",
        dxcodes: ""

    })

    const [UpdatedPayload, setUpdatedPayload] = useState({
        note: ""
    })

    const [ProcedureArr, setProcedureArr] = useState([]);
    const [CptcodesArr, setCptcodesArr] = useState([]);
    const [DxcodesArr, setDxcodesArr] = useState([]);


    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

        if (e.target.id === "procedure") {
            setProcedureArr([...ProcedureArr, e.target.value])
        }

        if (e.target.id === "cptcodes") {
            setCptcodesArr([...CptcodesArr, e.target.value])
        }

        if (e.target.id === "dxcodes") {
            setDxcodesArr([...DxcodesArr, e.target.value])

        }

    }

    const removeProcedureArr = (item) => {


        const updatedProcedureArr = ProcedureArr.filter(id => id !== item);
        setProcedureArr(updatedProcedureArr);


    }
    const removeCptcodesArr = (item) => {


        const updatedCptcodesArr = CptcodesArr.filter(id => id !== item);
        setCptcodesArr(updatedCptcodesArr);


    }
    const removeDxcodesArr = (item) => {


        const updatedDxcodesArr = DxcodesArr.filter(id => id !== item);
        setDxcodesArr(updatedDxcodesArr);


    }



    const handleUpdatedPayload = (e) => {
        setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value })

    }

    const handleSubmitNew = async () => {
        setLoading(true)
        try {
            const result = await AddProcedureAPI({
                clinic: Payload.clinic,
                indicationdiagnosisprocedure: Payload.indicationdiagnosisprocedure,
                procedure: ProcedureArr,
                appointmentdate: Payload.appointmentdate,
                cptcodes: CptcodesArr,
                dxcodes: DxcodesArr,
                appointmentid: oldPayload.id

            }, id);

            if (result.status === 200) {
                setLoading(false)
                setPayload({
                    note: ""
                })
                setDxcodesArr([]);
                setCptcodesArr([]);
                setProcedureArr([]);

                activateNotifications("Procedure Scheduled Successfully", "success")
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
            const result = await UpdateProcedureAPI({
                clinic: UpdatedPayload.clinic,
                indicationdiagnosisprocedure: UpdatedPayload.indicationdiagnosisprocedure,
                procedure: UpdatedPayload.procedure,
                appointmentdate: UpdatedPayload.appointmentdate,
                cptcodes: CptcodesArr,
                dxcodes: DxcodesArr

            }, oldPayload._id);



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


    useEffect(() => {

        getAllClinic()
        getSettings()

        setUpdatedPayload({
            clinic: oldPayload?.clinic,
            indicationdiagnosisprocedure: oldPayload?.indicationdiagnosisprocedure,
            procedure: oldPayload?.procedure,
            appointmentdate: oldPayload?.appointmentdate,
            cptcodes: oldPayload?.cptcodes,
            dxcodes: oldPayload?.dxcodes

        })




    }, [isOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader> {type === "new" ? "Add New Procedure" : type === "edit" ? "Edit Procedure" : "Procedure Details"} </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    {
                        type === "new" ? (
                            <>

                                <SimpleGrid mt="18px" mb="5" columns={{ base: 1, md: 1, lg: 1 }} spacing={5}>

                                    <Select

                                        onChange={handlePayload}
                                        placeholder="Select Clinic"
                                        id="clinic" value={Payload.clinic}
                                        fontSize={Payload.clinic !== "" ? "16px" : "13px"}
                                        size="lg"
                                        border="2px solid"
                                        borderColor="gray.500"
                                    >
                                        {
                                            Clinics.filter(item => item.type === "clinic")?.map((item, i) => (

                                                <option key={i} value={item.clinic}>{item.clinic}</option>
                                            ))
                                        }

                                    </Select>
                                    <Input val={Payload.indicationdiagnosisprocedure !== "" ? true : false} leftIcon={<FaNoteSticky />} onChange={handlePayload} id="indicationdiagnosisprocedure" value={Payload.indicationdiagnosisprocedure} label="Indication Diagnosis Procedure" />


                                    <Select

                                        onChange={handlePayload}
                                        placeholder="Select Procedure"
                                        id="procedure" value={Payload.procedure}
                                        fontSize={Payload.procedure !== "" ? "16px" : "13px"}
                                        size="lg"
                                        border="2px solid"
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.servicecategory?.filter(item => item.category === "Procedure")[0]?.type?.map((item, i) => (
                                                <option key={i} value={item}>{item}</option>
                                            )



                                            )
                                        }

                                    </Select>
                                    <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>

                                        {
                                            ProcedureArr?.map((item, i) => (

                                                <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"25px"} fontSize="13px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                                    <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                                    <Box fontSize="20px" color="#fff" onClick={() => removeProcedureArr(item)}><IoIosCloseCircle /></Box>
                                                </Flex>
                                            ))
                                        }

                                    </SimpleGrid>

                                    <Input leftIcon={<FaCalendarAlt />} label="Appointment Date" type='datetime-local' value={Payload.appointmentdate} onChange={handlePayload} id="appointmentdate" />


                                    <Select

                                        onChange={handlePayload}
                                        placeholder="Select CPT Codes"
                                        id="cptcodes" value={Payload.cptcodes}
                                        fontSize={Payload.cptcodes !== "" ? "16px" : "13px"}
                                        size="lg"
                                        border="2px solid"
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.cptcodes?.map((item, i) => (
                                                <option key={i} value={item}>{item}</option>
                                            )


                                            )
                                        }

                                    </Select>

                                    <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                        {
                                            CptcodesArr?.map((item, i) => (

                                                <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"25px"} fontSize="13px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                                    <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                                    <Box fontSize="20px" color="#fff" onClick={() => removeCptcodesArr(item)}><IoIosCloseCircle /></Box>
                                                </Flex>
                                            ))
                                        }

                                    </SimpleGrid>
                                    <Select

                                        onChange={handlePayload}
                                        placeholder="Select DX Codes"
                                        id="dxcodes" value={Payload.dxcodes}
                                        fontSize={Payload.dxcodes !== "" ? "16px" : "13px"}
                                        size="lg"
                                        border="2px solid"
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.dxcodes?.map((item, i) => (
                                                <option key={i} value={item}>{item}</option>
                                            )



                                            )
                                        }

                                    </Select>
                                    <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                        {
                                            DxcodesArr?.map((item, i) => (

                                                <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"25px"} fontSize="13px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                                    <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                                    <Box fontSize="20px" color="#fff" onClick={() => removeDxcodesArr(item)}><IoIosCloseCircle /></Box>
                                                </Flex>
                                            ))
                                        }

                                    </SimpleGrid>

                                </SimpleGrid>



                                <Button mt="32px" isLoading={Loading} onClick={handleSubmitNew}>Proceed</Button>

                            </>
                        ) : type === "edit" ? (
                            <>

                                <SimpleGrid mt="18px" mb="5" columns={{ base: 1, md: 1, lg: 1 }} spacing={5}>

                                    <Select

                                        onChange={handleUpdatedPayload}
                                        placeholder="Select Clinic"
                                        id="clinic" value={UpdatedPayload.clinic}
                                        fontSize={UpdatedPayload.clinic !== "" ? "16px" : "13px"}
                                        size="lg"
                                        border="2px solid"
                                        borderColor="gray.500"
                                    >
                                        {
                                            Clinics.filter(item => item.type === "clinic")?.map((item, i) => (

                                                <option key={i} value={item.clinic}>{item.clinic}</option>
                                            ))
                                        }

                                    </Select>
                                    <Input val={UpdatedPayload.indicationdiagnosisprocedure !== "" ? true : false} leftIcon={<FaNoteSticky />} onChange={handleUpdatedPayload} id="indicationdiagnosisprocedure" value={UpdatedPayload.indicationdiagnosisprocedure} label="Indication Diagnosis Procedure" />


                                    <Select

                                        onChange={handleUpdatedPayload}
                                        placeholder="Select Procedure"
                                        id="procedure" value={UpdatedPayload.procedure}
                                        fontSize={UpdatedPayload.procedure !== "" ? "16px" : "13px"}
                                        size="lg"
                                        border="2px solid"
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.servicecategory?.filter(item => item.category === "Procedure")[0]?.type?.map((item, i) => (
                                                <option key={i} value={item}>{item}</option>
                                            )



                                            )
                                        }

                                    </Select>
                                    <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>

                                        {
                                            ProcedureArr?.map((item, i) => (

                                                <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"25px"} fontSize="13px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                                    <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                                    <Box fontSize="20px" color="#fff" onClick={() => removeProcedureArr(item)}><IoIosCloseCircle /></Box>
                                                </Flex>
                                            ))
                                        }

                                    </SimpleGrid>

                                    <Input leftIcon={<FaCalendarAlt />} label="Appointment Date" type='datetime-local' value={UpdatedPayload.appointmentdate} onChange={handleUpdatedPayload} id="appointmentdate" />


                                    <Select

                                        onChange={handlePayload}
                                        placeholder="Select CPT Codes"
                                        id="cptcodes" value={Payload.cptcodes}
                                        fontSize={Payload.cptcodes !== "" ? "16px" : "13px"}
                                        size="lg"
                                        border="2px solid"
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.cptcodes?.map((item, i) => (
                                                <option key={i} value={item}>{item}</option>
                                            )


                                            )
                                        }

                                    </Select>

                                    <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                        {
                                            CptcodesArr?.map((item, i) => (

                                                <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"25px"} fontSize="13px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                                    <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                                    <Box fontSize="20px" color="#fff" onClick={() => removeCptcodesArr(item)}><IoIosCloseCircle /></Box>
                                                </Flex>
                                            ))
                                        }

                                    </SimpleGrid>
                                    <Select

                                        onChange={handlePayload}
                                        placeholder="Select DX Codes"
                                        id="dxcodes" value={Payload.dxcodes}
                                        fontSize={Payload.dxcodes !== "" ? "16px" : "13px"}
                                        size="lg"
                                        border="2px solid"
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.dxcodes?.map((item, i) => (
                                                <option key={i} value={item}>{item}</option>
                                            )



                                            )
                                        }

                                    </Select>
                                    <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                        {
                                            DxcodesArr?.map((item, i) => (

                                                <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"25px"} fontSize="13px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                                    <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                                    <Box fontSize="20px" color="#fff" onClick={() => removeDxcodesArr(item)}><IoIosCloseCircle /></Box>
                                                </Flex>
                                            ))
                                        }

                                    </SimpleGrid>

                                </SimpleGrid>



                                <Button mt="32px" isLoading={Loading} onClick={handleSubmitUpdate}>Update</Button>

                            </>
                        ) : (
                            <>

                                <SimpleGrid mt="18px" mb="5" columns={{ base: 1, md: 1, lg: 1 }} spacing={5}>

                                    <Select isDisabled={true}

                                        onChange={handleUpdatedPayload}
                                        placeholder="Select Clinic"
                                        id="clinic" value={UpdatedPayload.clinic}
                                        fontSize={UpdatedPayload.clinic !== "" ? "16px" : "13px"}
                                        size="lg"
                                        border="2px solid"
                                        borderColor="gray.500"
                                    >
                                        {
                                            Clinics.filter(item => item.type === "clinic")?.map((item, i) => (

                                                <option key={i} value={item.clinic}>{item.clinic}</option>
                                            ))
                                        }

                                    </Select>
                                    <Input isDisabled={true} val={UpdatedPayload.indicationdiagnosisprocedure !== "" ? true : false} leftIcon={<FaNoteSticky />} onChange={handleUpdatedPayload} id="indicationdiagnosisprocedure" value={UpdatedPayload.indicationdiagnosisprocedure} label="Indication Diagnosis Procedure" />


                                    <Select isDisabled={true}

                                        onChange={handleUpdatedPayload}
                                        placeholder="Select Procedure"
                                        id="procedure" value={UpdatedPayload.procedure}
                                        fontSize={UpdatedPayload.procedure !== "" ? "16px" : "13px"}
                                        size="lg"
                                        border="2px solid"
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.servicecategory?.filter(item => item.category === "Procedure")[0]?.type?.map((item, i) => (
                                                <option key={i} value={item}>{item}</option>
                                            )



                                            )
                                        }

                                    </Select>
                                    <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>

                                        {
                                            ProcedureArr?.map((item, i) => (

                                                <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"25px"} fontSize="13px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                                    <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                                    <Box fontSize="20px" color="#fff" onClick={() => removeProcedureArr(item)}><IoIosCloseCircle /></Box>
                                                </Flex>
                                            ))
                                        }

                                    </SimpleGrid>

                                    <Input isDisabled={true} leftIcon={<FaCalendarAlt />} label="Appointment Date" type='datetime-local' value={UpdatedPayload.appointmentdate} onChange={handleUpdatedPayload} id="appointmentdate" />


                                    <Select isDisabled={true}

                                        onChange={handlePayload}
                                        placeholder="Select CPT Codes"
                                        id="cptcodes" value={Payload.cptcodes}
                                        fontSize={Payload.cptcodes !== "" ? "16px" : "13px"}
                                        size="lg"
                                        border="2px solid"
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.cptcodes?.map((item, i) => (
                                                <option key={i} value={item}>{item}</option>
                                            )


                                            )
                                        }

                                    </Select>

                                    <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                        {
                                            CptcodesArr?.map((item, i) => (

                                                <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"25px"} fontSize="13px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                                    <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                                    <Box fontSize="20px" color="#fff" onClick={() => removeCptcodesArr(item)}><IoIosCloseCircle /></Box>
                                                </Flex>
                                            ))
                                        }

                                    </SimpleGrid>
                                    <Select isDisabled={true}

                                        onChange={handlePayload}
                                        placeholder="Select DX Codes"
                                        id="dxcodes" value={Payload.dxcodes}
                                        fontSize={Payload.dxcodes !== "" ? "16px" : "13px"}
                                        size="lg"
                                        border="2px solid"
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.dxcodes?.map((item, i) => (
                                                <option key={i} value={item}>{item}</option>
                                            )



                                            )
                                        }

                                    </Select>
                                    <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                        {
                                            DxcodesArr?.map((item, i) => (

                                                <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"25px"} fontSize="13px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                                    <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                                    <Box fontSize="20px" color="#fff" onClick={() => removeDxcodesArr(item)}><IoIosCloseCircle /></Box>
                                                </Flex>
                                            ))
                                        }

                                    </SimpleGrid>

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
