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
    Select,
    Box, SimpleGrid, Flex
} from '@chakra-ui/react'
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import { UpdateExaminedPatientAPI, SettingsApi, RequestLabOrderApi } from "../Utils/ApiCalls";
import { MdMiscellaneousServices } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";



export default function LabRequestModal({ isOpen, onClose, type, activateNotifications, oldPayload }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState({});
    const [TestNames, setTestNames] = useState([]);
    const [Payload, setPayload] = useState({

        testNames: ""
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

        setTestNames([...TestNames, e.target.value])
    }


    const getSettings = async () => {
        try {
            const result = await SettingsApi();


            let checker = result?.servicecategory?.filter(item => item.category === "Appointment")

            setSettings(result);
        } catch (e) {

        }
    };



    const patientId = localStorage.getItem("patientId");
    const RequestLabOrder = async () => {
        setLoading(true)
        try {
            const result = await RequestLabOrderApi({
                testname: TestNames,
                appointmentunderscoreid: oldPayload._id

            }, patientId);

            if (result.status === 200) {
                setLoading(false)
                onClose()
                setPayload({
                    
                })
                setTestNames([])
                activateNotifications("Lab Order Requested Successfully", "success")
            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    };
    

    const removeTestName = (item) => {

       
        const updatedTestNames = TestNames.filter(id => id !== item);
        setTestNames(updatedTestNames);


    }





    useEffect(() => {
        getSettings()

    }, []);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "50%" }}>
                <ModalHeader> Lab Order For {oldPayload.appointmentid} </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <>
                        <SimpleGrid mt="32px" columns={{ base: 1, md: 1 }} spacing={10}>
                            <Select

                                onChange={handlePayload}
                                placeholder="Select Test Name"
                                border="2px solid"
                                id="testNames" value={Payload.testNames}
                                size="lg"
                                fontSize={Payload.testNames !== "" ? "16px" : "13px"}
                                borderColor="gray.500"
                            >
                                {
                                    Settings?.testnames?.map((item, i) => (

                                        <option key={i} value={item}>{item}</option>
                                    ))
                                }

                            </Select>
                        </SimpleGrid>

                        <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>

                            {
                                TestNames?.map((item, i) => (

                                    <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"25px"} fontSize="13px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                        <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                        <Box fontSize="20px" color="#fff" onClick={() => removeTestName(item)}><IoIosCloseCircle /></Box>
                                    </Flex>
                                ))
                            }

                        </SimpleGrid>



                        <Button mt="32px" onClick={RequestLabOrder} isLoading={Loading}>Request</Button>
                    </>

                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
