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
    Stack, SimpleGrid, Select
} from '@chakra-ui/react'
import Input from "./Input";
import Button from "./Button";
import { FaNoteSticky } from "react-icons/fa6";
import { IoColorFilter } from "react-icons/io5";
import { SettingsApi } from "../Utils/ApiCalls";
import { IoEye } from "react-icons/io5";
import { BsFillOpticalAudioFill } from "react-icons/bs";
import { FaWeightScale } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";
import { AiFillApi } from "react-icons/ai";

export default function NeuroExaminationModal({ isOpen, onClose, setOldPayload, activateNotifications, oldPayload }) {

    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState("");




    const [Payload, setPayload] = useState({

        muscletone: "",
        musclestrength: "",
        involuntarymovements: "",
        activerangeflexionshoulderl: "",
        activerangeextensionshoulderl: "",
        activerangeexternalrotationshoulderl: "",
        activerangeinternalrotationshoulderl: "",
        activerangeabductionshoulderl: "",
        activerangeadductionshoulderl: "",
        activerangeflexionshoulderr: "",
        activerangeextensionshoulderr: "",
        activerangeexternalrotationshoulderr: "",
        activerangeinternalrotationshoulderr: "",
        activerangeabductionshoulderr: "",
        activerangeadductionshoulderr: "",
        activerangeflexionelbowl: "",
        activerangeextensionelbowl: "",
        activerangeflexionelbowr: "",
        activerangeextensionelbowr: "",
        activerangeflexionhipl: "",
        activerangeextensionhipl: "",
        activerangeexternalrotationhipl: "",
        activerangeinternalrotationhipl: "",
        activerangeabductionhipl: "",
        activerangeadductionhipl: "",
        activerangeflexionhipr: "",
        activerangeextensionhipr: "",
        activerangeexternalrotationhipr: "",
        activerangeinternalrotationhipr: "",
        activerangeabductionhipr: "",
        activerangeadductionhipr: "",
        activerangeflexionkneel: "",
        activerangeextensionkneel: "",
        activerangeflexionkneer: "",
        activerangeextensionkneer: "",
        passiverangeflexionshoulderl: "",
        passiverangeextensionshoulderl: "",
        passiverangeexternalrotationshoulderl: "",
        passiverangeinternalrotationshoulderl: "",
        passiverangeabductionshoulderl: "",
        passiverangeadductionshoulderl: "",
        passiverangeflexionshoulderr: "",
        passiverangeextensionshoulderr: "",
        passiverangeexternalrotationshoulderr: "",
        passiverangeinternalrotationshoulderr: "",
        passiverangeabductionshoulderr: "",
        passiverangeadductionshoulderr: "",
        passiverangeflexionelbowl: "",
        passiverangeextensionelbowl: "",
        passiverangeflexionelbowr: "",
        passiverangeextensionelbowr: "",
        passiverangeflexionhipl: "",
        passiverangeextensionhipl: "",
        passiverangeexternalrotationhipl: "",
        passiverangeinternalrotationhipl: "",
        passiverangeabductionhipl: "",
        passiverangeadductionhipl: "",
        passiverangeflexionhipr: "",
        passiverangeextensionhipr: "",
        passiverangeexternalrotationhipr: "",
        passiverangeinternalrotationhipr: "",
        passiverangeabductionhipr: "",
        passiverangeadductionhipr: "",
        passiverangeflexionkneel: "",
        passiverangeextensionkneel: "",
        passiverangeflexionkneer: "",
        passiverangeextensionkneer: "",
        dtrachilles: "",
        dtrbiceps: "",
        dtrbrachioradialis: "",
        dtrpatellar: "",
        dtrtriceps: "",
        babinskisreflex: "",
        oculocephalic: "",
        paralysistype: "",
        paresthesiatype: "",
        physiologicfinding: "",
        musculoskeletalassessmentimpression: "",
        mskremark: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        setOldPayload({ ...oldPayload, "msk": Payload })
        activateNotifications("Saved Successfully", "success")
        onClose()
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
    }, [isOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader> Musculoskeletal Assessment </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">Muscle Tone, Muscle Strength & Involuntary Movements</Text>
                    
                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Select h="45px" borderWidth="2px" fontSize={Payload.muscletone !== "" ? "16px" : "13px"} borderColor="#6B7280" id="muscletone" value={Payload.muscletone} onChange={handlePayload} placeholder="Select Muscle tone" >
                            {
                                Settings?.muscletone?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.musclestrength !== "" ? "16px" : "13px"} borderColor="#6B7280" id="musclestrength" value={Payload.musclestrength} onChange={handlePayload} placeholder="Select Muscle strength" >
                            {
                                Settings?.musclestrength?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.involuntarymovements !== "" ? "16px" : "13px"} borderColor="#6B7280" id="involuntarymovements" value={Payload.involuntarymovements} onChange={handlePayload} placeholder="Select Involuntary movements" >
                            {
                                Settings?.involuntarymovement?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                    </SimpleGrid>

                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">Active Range Of Movements:</Text>
                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Shoulder L</Text>


                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.activerangeflexionshoulderl} onChange={handlePayload} id="activerangeflexionshoulderl" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.activerangeextensionshoulderl} onChange={handlePayload} id="activerangeextensionshoulderl" />
                        <Input leftIcon={<AiFillApi />} label="External Rotation (deg)" value={Payload.activerangeexternalrotationshoulderl} onChange={handlePayload} id="activerangeexternalrotationshoulderl" />
                        <Input leftIcon={<AiFillApi />} label="Internal Rotation (deg)" value={Payload.activerangeinternalrotationshoulderl} onChange={handlePayload} id="activerangeinternalrotationshoulderl" />
                        <Input leftIcon={<AiFillApi />} label="Abduction (deg)" value={Payload.activerangeabductionshoulderl} onChange={handlePayload} id="activerangeabductionshoulderl" />
                        <Input leftIcon={<AiFillApi />} label="Adduction (deg)" value={Payload.activerangeadductionshoulderl} onChange={handlePayload} id="activerangeadductionshoulderl" />

                    </SimpleGrid>

                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Shoulder R</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.activerangeflexionshoulderr} onChange={handlePayload} id="activerangeflexionshoulderr" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.activerangeextensionshoulderr} onChange={handlePayload} id="activerangeextensionshoulderr" />
                        <Input leftIcon={<AiFillApi />} label="External Rotation (deg)" value={Payload.activerangeexternalrotationshoulderr} onChange={handlePayload} id="activerangeexternalrotationshoulderr" />
                        <Input leftIcon={<AiFillApi />} label="Internal Rotation (deg)" value={Payload.activerangeinternalrotationshoulderr} onChange={handlePayload} id="activerangeinternalrotationshoulderr" />
                        <Input leftIcon={<AiFillApi />} label="Abduction (deg)" value={Payload.activerangeabductionshoulderr} onChange={handlePayload} id="activerangeabductionshoulderr" />
                        <Input leftIcon={<AiFillApi />} label="Adduction (deg)" value={Payload.activerangeadductionshoulderr} onChange={handlePayload} id="activerangeadductionshoulderr" />

                    </SimpleGrid>
                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Elbow Left </Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.activerangeflexionelbowl} onChange={handlePayload} id="activerangeflexionelbowl" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.activerangeextensionelbowl} onChange={handlePayload} id="activerangeextensionelbowl" />

                    </SimpleGrid>
                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Elbow Right </Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.activerangeflexionelbowr} onChange={handlePayload} id="activerangeflexionelbowr" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.activerangeextensionelbowr} onChange={handlePayload} id="activerangeextensionelbowr" />

                    </SimpleGrid>
                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Hip Left</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.activerangeflexionhipl} onChange={handlePayload} id="activerangeflexionhipl" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.activerangeextensionhipl} onChange={handlePayload} id="activerangeextensionhipl" />
                        <Input leftIcon={<AiFillApi />} label="External Rotation (deg)" value={Payload.activerangeexternalrotationhipl} onChange={handlePayload} id="activerangeexternalrotationhipl" />
                        <Input leftIcon={<AiFillApi />} label="Internal Rotation (deg)" value={Payload.activerangeinternalrotationhipl} onChange={handlePayload} id="activerangeinternalrotationhipl" />
                        <Input leftIcon={<AiFillApi />} label="Abduction (deg)" value={Payload.activerangeabductionhipl} onChange={handlePayload} id="activerangeabductionhipl" />
                        <Input leftIcon={<AiFillApi />} label="Adduction (deg)" value={Payload.activerangeadductionhipl} onChange={handlePayload} id="activerangeadductionhipl" />

                    </SimpleGrid>
                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Hip Right</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.activerangeflexionhipr} onChange={handlePayload} id="activerangeflexionhipr" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.activerangeextensionhipr} onChange={handlePayload} id="activerangeextensionhipr" />
                        <Input leftIcon={<AiFillApi />} label="External Rotation (deg)" value={Payload.activerangeexternalrotationhipr} onChange={handlePayload} id="activerangeexternalrotationhipr" />
                        <Input leftIcon={<AiFillApi />} label="Internal Rotation (deg)" value={Payload.activerangeinternalrotationhipr} onChange={handlePayload} id="activerangeinternalrotationhipr" />
                        <Input leftIcon={<AiFillApi />} label="Abduction (deg)" value={Payload.activerangeabductionhipr} onChange={handlePayload} id="activerangeabductionhipr" />
                        <Input leftIcon={<AiFillApi />} label="Adduction (deg)" value={Payload.activerangeadductionhipr} onChange={handlePayload} id="activerangeadductionhipr" />

                    </SimpleGrid>

                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Knee Left</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.activerangeflexionkneel} onChange={handlePayload} id="activerangeflexionkneel" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.activerangeextensionkneel} onChange={handlePayload} id="activerangeextensionkneel" />

                    </SimpleGrid>
                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Knee Right</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.activerangeflexionkneer} onChange={handlePayload} id="activerangeflexionkneer" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.activerangeextensionkneer} onChange={handlePayload} id="activerangeextensionkneer" />

                    </SimpleGrid>

                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">Passive Range Of Movements:</Text>
                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Shoulder L</Text>


                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.passiverangeflexionshoulderl} onChange={handlePayload} id="passiverangeflexionshoulderl" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.passiverangeextensionshoulderl} onChange={handlePayload} id="passiverangeextensionshoulderl" />
                        <Input leftIcon={<AiFillApi />} label="External Rotation (deg)" value={Payload.passiverangeexternalrotationshoulderl} onChange={handlePayload} id="passiverangeexternalrotationshoulderl" />
                        <Input leftIcon={<AiFillApi />} label="Internal Rotation (deg)" value={Payload.passiverangeinternalrotationshoulderl} onChange={handlePayload} id="passiverangeinternalrotationshoulderl" />
                        <Input leftIcon={<AiFillApi />} label="Abduction (deg)" value={Payload.passiverangeabductionshoulderl} onChange={handlePayload} id="passiverangeabductionshoulderl" />
                        <Input leftIcon={<AiFillApi />} label="Adduction (deg)" value={Payload.passiverangeadductionshoulderl} onChange={handlePayload} id="passiverangeadductionshoulderl" />

                    </SimpleGrid>

                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Shoulder R</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.passiverangeflexionshoulderr} onChange={handlePayload} id="passiverangeflexionshoulderr" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.passiverangeextensionshoulderr} onChange={handlePayload} id="passiverangeextensionshoulderr" />
                        <Input leftIcon={<AiFillApi />} label="External Rotation (deg)" value={Payload.passiverangeexternalrotationshoulderr} onChange={handlePayload} id="passiverangeexternalrotationshoulderr" />
                        <Input leftIcon={<AiFillApi />} label="Internal Rotation (deg)" value={Payload.passiverangeinternalrotationshoulderr} onChange={handlePayload} id="passiverangeinternalrotationshoulderr" />
                        <Input leftIcon={<AiFillApi />} label="Abduction (deg)" value={Payload.passiverangeabductionshoulderr} onChange={handlePayload} id="passiverangeabductionshoulderr" />
                        <Input leftIcon={<AiFillApi />} label="Adduction (deg)" value={Payload.passiverangeadductionshoulderr} onChange={handlePayload} id="passiverangeadductionshoulderr" />

                    </SimpleGrid>
                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Elbow Left </Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.passiverangeflexionelbowl} onChange={handlePayload} id="passiverangeflexionelbowl" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.passiverangeextensionelbowl} onChange={handlePayload} id="passiverangeextensionelbowl" />

                    </SimpleGrid>
                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Elbow Right </Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.passiverangeflexionelbowr} onChange={handlePayload} id="passiverangeflexionelbowr" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.passiverangeextensionelbowr} onChange={handlePayload} id="passiverangeextensionelbowr" />

                    </SimpleGrid>
                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Hip Left</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.passiverangeflexionhipl} onChange={handlePayload} id="passiverangeflexionhipl" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.passiverangeextensionhipl} onChange={handlePayload} id="passiverangeextensionhipl" />
                        <Input leftIcon={<AiFillApi />} label="External Rotation (deg)" value={Payload.passiverangeexternalrotationhipl} onChange={handlePayload} id="passiverangeexternalrotationhipl" />
                        <Input leftIcon={<AiFillApi />} label="Internal Rotation (deg)" value={Payload.passiverangeinternalrotationhipl} onChange={handlePayload} id="passiverangeinternalrotationhipl" />
                        <Input leftIcon={<AiFillApi />} label="Abduction (deg)" value={Payload.passiverangeabductionhipl} onChange={handlePayload} id="passiverangeabductionhipl" />
                        <Input leftIcon={<AiFillApi />} label="Adduction (deg)" value={Payload.passiverangeadductionhipl} onChange={handlePayload} id="passiverangeadductionhipl" />

                    </SimpleGrid>
                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Hip Right</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.passiverangeflexionhipr} onChange={handlePayload} id="passiverangeflexionhipr" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.passiverangeextensionhipr} onChange={handlePayload} id="passiverangeextensionhipr" />
                        <Input leftIcon={<AiFillApi />} label="External Rotation (deg)" value={Payload.passiverangeexternalrotationhipr} onChange={handlePayload} id="passiverangeexternalrotationhipr" />
                        <Input leftIcon={<AiFillApi />} label="Internal Rotation (deg)" value={Payload.passiverangeinternalrotationhipr} onChange={handlePayload} id="passiverangeinternalrotationhipr" />
                        <Input leftIcon={<AiFillApi />} label="Abduction (deg)" value={Payload.passiverangeabductionhipr} onChange={handlePayload} id="passiverangeabductionhipr" />
                        <Input leftIcon={<AiFillApi />} label="Adduction (deg)" value={Payload.passiverangeadductionhipr} onChange={handlePayload} id="passiverangeadductionhipr" />

                    </SimpleGrid>

                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Knee Left</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.passiverangeflexionkneel} onChange={handlePayload} id="passiverangeflexionkneel" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.passiverangeextensionkneel} onChange={handlePayload} id="passiverangeextensionkneel" />

                    </SimpleGrid>
                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Knee Right</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Input leftIcon={<AiFillApi />} label="Flexion (deg)" value={Payload.passiverangeflexionkneer} onChange={handlePayload} id="passiverangeflexionkneer" />
                        <Input leftIcon={<AiFillApi />} label="Extension (deg)" value={Payload.passiverangeextensionkneer} onChange={handlePayload} id="passiverangeextensionkneer" />

                    </SimpleGrid>

                    <Text fontSize="16px" mt="12px" fontWeight={"700"} color="blue.blue500">Deep Tendon Reflex</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Select h="45px" borderWidth="2px" fontSize={Payload.dtrachilles !== "" ? "16px" : "13px"} borderColor="#6B7280" id="dtrachilles" value={Payload.dtrachilles} onChange={handlePayload} placeholder="Select DTR Achilles" >
                            {
                                Settings?.drt?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>

                        <Select h="45px" borderWidth="2px" fontSize={Payload.dtrbiceps !== "" ? "16px" : "13px"} borderColor="#6B7280" id="dtrbiceps" value={Payload.dtrbiceps} onChange={handlePayload} placeholder="Select DTR Biceps" >
                            {
                                Settings?.drt?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.dtrbrachioradialis !== "" ? "16px" : "13px"} borderColor="#6B7280" id="dtrbrachioradialis" value={Payload.dtrbrachioradialis} onChange={handlePayload} placeholder="Select DTR Brachioradialis" >
                            {
                                Settings?.drt?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.dtrpatellar !== "" ? "16px" : "13px"} borderColor="#6B7280" id="dtrpatellar" value={Payload.dtrpatellar} onChange={handlePayload} placeholder="Select DTR DTR Patellar" >
                            {
                                Settings?.drt?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.dtrtriceps !== "" ? "16px" : "13px"} borderColor="#6B7280" id="dtrtriceps" value={Payload.dtrtriceps} onChange={handlePayload} placeholder="Select DTR Triceps" >
                            {
                                Settings?.drt?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Input leftIcon={<AiFillApi />} label="Babinski's Reflex" value={Payload.babinskisreflex} onChange={handlePayload} id="babinskisreflex" />

                        <Select h="45px" borderWidth="2px" fontSize={Payload.oculocephalic !== "" ? "16px" : "13px"} borderColor="#6B7280" id="oculocephalic" value={Payload.oculocephalic} onChange={handlePayload} placeholder="Select Oculocephalic" >
                            {
                                Settings?.oculocephalic?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.paralysistype !== "" ? "16px" : "13px"} borderColor="#6B7280" id="paralysistype" value={Payload.paralysistype} onChange={handlePayload} placeholder="Select Paralysis type" >
                            {
                                Settings?.paralysistype?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.paresthesiatype !== "" ? "16px" : "13px"} borderColor="#6B7280" id="paresthesiatype" value={Payload.paresthesiatype} onChange={handlePayload} placeholder="Select Paresthesia type" >
                            {
                                Settings?.paresthesiatype?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.musculoskeletalassessmentimpression !== "" ? "16px" : "13px"} borderColor="#6B7280" id="musculoskeletalassessmentimpression" value={Payload.musculoskeletalassessmentimpression} onChange={handlePayload} placeholder="Select Musculoskeletal assessment impression" >
                            {
                                Settings?.musculoskeletalassessmentimpression?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>

                        <Input leftIcon={<FaNoteSticky />} label="Physiologic Finding Gait" value={Payload.physiologicfinding} onChange={handlePayload} id="physiologicfinding" />

                    

                    </SimpleGrid>
       
                    <Input leftIcon={<FaNoteSticky />} label="Remarks" value={Payload.mskremark} onChange={handlePayload} id="mskremark" />


                    <Button mt="32px" isLoading={Loading} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
