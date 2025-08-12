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

export default function NeuroExaminationModal({ isOpen, onClose, setOldPayload, activateNotifications, oldPayload }) {

    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState("");




    const [Payload, setPayload] = useState({

        levelofconsciousness: "",
        person: "",
        place: "",
        time: "",
        orientationassessmentimpression: "",
        levelofarousal: "",
        speechclarity: "",
        patientmood: "",
        patientmemory: "",
        abilitytoconcentrate: "",
        abilitytodirectattention: "",
        cniexam: "",
        cniiexam: "",
        cniiiexam: "",
        cnivexam: "",
        cnvexam: "",
        cnviexam: "",
        cniviiexam: "",
        cniviiiexam: "",
        cnixexam: "",
        cnxexam: "",
        cnxiexam: "",
        cnxiiexam: "",
        pupildiametereyer: "",
        pupildiametereyel: "",
        pupillaryresponsepupilr: "",
        pupillaryresponsepupill: "",
        pupilshaperightpupil: "",
        pupilshapeleftpupil: "",
        pupilassessmentimpression: "",
        physiologicfindingopticlens: "",
        glasgowcomascale: "",
        neurologyassessmentimpression: "",
        nueroremarks: ""
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const save = () => {

        setOldPayload({ ...oldPayload, "neuro": Payload })
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
                <ModalHeader> Neurology Assessment </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">LOC</Text>

                    <Select mt="5" h="45px" borderWidth="2px" fontSize={Payload.levelofconsciousness !== "" ? "16px" : "13px"} borderColor="#6B7280" id="levelofconsciousness" value={Payload.levelofconsciousness} onChange={handlePayload} placeholder="Select Level of consciousness" >
                        {
                            Settings?.levelofconsciousness?.map((item, i) => (
                                <option value={`${item}`} key={i}>{item}</option>

                            ))
                        }

                    </Select>

                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">Orientation</Text>


                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                        <Select h="45px" borderWidth="2px" fontSize={Payload.person !== "" ? "16px" : "13px"} borderColor="#6B7280" id="person" value={Payload.person} onChange={handlePayload} placeholder="Select Person" >
                            {
                                Settings?.personalbar?.map((item, i) => (

                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>

                        <Select h="45px" borderWidth="2px" fontSize={Payload.place !== "" ? "16px" : "13px"} borderColor="#6B7280" id="place" value={Payload.place} onChange={handlePayload} placeholder="Select Place" >
                            {
                                Settings?.place?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>



                        <Select h="45px" borderWidth="2px" fontSize={Payload.time !== "" ? "16px" : "13px"} borderColor="#6B7280" id="time" value={Payload.time} onChange={handlePayload} placeholder="Select Time" >
                            {
                                Settings?.time?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.orientationassessmentimpression !== "" ? "16px" : "13px"} borderColor="#6B7280" id="orientationassessmentimpression" value={Payload.orientationassessmentimpression} onChange={handlePayload} placeholder="Select Orientation assessment impression" >
                            {
                                Settings?.orientationassessmentimpression?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>





                    </SimpleGrid>

                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">Arousal & Speech</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.levelofarousal !== "" ? "16px" : "13px"} borderColor="#6B7280" id="levelofarousal" value={Payload.levelofarousal} onChange={handlePayload} placeholder="Select Level of arousal" >
                            {
                                Settings?.arousal?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.speechclarity !== "" ? "16px" : "13px"} borderColor="#6B7280" id="speechclarity" value={Payload.speechclarity} onChange={handlePayload} placeholder="Select Speech clarity" >
                            {
                                Settings?.speechclarity?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>

                    </SimpleGrid>

                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">Mood Memory, Concentration & Attention</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>


                        <Select h="45px" borderWidth="2px" fontSize={Payload.patientmood !== "" ? "16px" : "13px"} borderColor="#6B7280" id="patientmood" value={Payload.patientmood} onChange={handlePayload} placeholder="Select Patient mood" >
                            {
                                Settings?.patientmood?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.patientmemory !== "" ? "16px" : "13px"} borderColor="#6B7280" id="patientmemory" value={Payload.patientmemory} onChange={handlePayload} placeholder="Select Patient memory" >
                            {
                                Settings?.patientmemory?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.abilitytoconcentrate !== "" ? "16px" : "13px"} borderColor="#6B7280" id="abilitytoconcentrate" value={Payload.abilitytoconcentrate} onChange={handlePayload} placeholder="Select Ability to concentrate" >
                            {
                                Settings?.abilitytoconcentration?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.abilitytodirectattention !== "" ? "16px" : "13px"} borderColor="#6B7280" id="abilitytodirectattention" value={Payload.abilitytodirectattention} onChange={handlePayload} placeholder="Select Ability to direct attention" >
                            {
                                Settings?.attention?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>

                    </SimpleGrid>
                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">Cranial nerve assessment</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>


                        <Select h="45px" borderWidth="2px" fontSize={Payload.cniexam !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cniexam" value={Payload.cniexam} onChange={handlePayload} placeholder="Select CNI Exam" >
                            {
                                Settings?.cni?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.cniiexam !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cniiexam" value={Payload.cniiexam} onChange={handlePayload} placeholder="Select CNII Exam" >
                            {
                                Settings?.cni?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.cniiiexam !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cniiiexam" value={Payload.cniiiexam} onChange={handlePayload} placeholder="Select CNIII Exam" >
                            {
                                Settings?.cni?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.cnivexam !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cnivexam" value={Payload.cnivexam} onChange={handlePayload} placeholder="Select CNIV Exam" >
                            {
                                Settings?.cni?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.cnvexam !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cnvexam" value={Payload.cnvexam} onChange={handlePayload} placeholder="Select CNV Exam" >
                            {
                                Settings?.cni?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.cnviexam !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cnviexam" value={Payload.cnviexam} onChange={handlePayload} placeholder="Select CNVI Exam" >
                            {
                                Settings?.cni?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.cniviiexam !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cniviiexam" value={Payload.cniviiexam} onChange={handlePayload} placeholder="Select CNVII Exam" >
                            {
                                Settings?.cni?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.cniviiiexam !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cniviiiexam" value={Payload.cniviiiexam} onChange={handlePayload} placeholder="Select CNVIII Exam" >
                            {
                                Settings?.cni?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.cnixexam !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cnixexam" value={Payload.cnixexam} onChange={handlePayload} placeholder="Select CNIX Exam" >
                            {
                                Settings?.cni?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.cnxexam !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cnxexam" value={Payload.cnxexam} onChange={handlePayload} placeholder="Select CNX Exam" >
                            {
                                Settings?.cni?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>

                        <Select h="45px" borderWidth="2px" fontSize={Payload.cnxiexam !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cnxiexam" value={Payload.cnxiexam} onChange={handlePayload} placeholder="Select CNXI Exam" >
                            {
                                Settings?.cni?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.cnxiiexam !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cnxiiexam" value={Payload.cnxiiexam} onChange={handlePayload} placeholder="Select CNXII Exam" >
                            {
                                Settings?.cni?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>


                    </SimpleGrid>
                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">Pupil Assessment</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                        <Input leftIcon={<IoEye />} label="Pupil Diameter Eye-R (mm)" value={Payload.pupildiametereyer} onChange={handlePayload} id="pupildiametereyer" />
                        <Input leftIcon={<IoEye />} label="Pupil Diameter Eye-L (mm)" value={Payload.pupildiametereyel} onChange={handlePayload} id="pupildiametereyel" />

                        <Select h="45px" borderWidth="2px" fontSize={Payload.pupillaryresponsepupilr !== "" ? "16px" : "13px"} borderColor="#6B7280" id="pupillaryresponsepupilr" value={Payload.pupillaryresponsepupilr} onChange={handlePayload} placeholder="Select Pupillary response Pupil-R" >
                            {
                                Settings?.pupillaryresponse?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.pupillaryresponsepupill !== "" ? "16px" : "13px"} borderColor="#6B7280" id="pupillaryresponsepupill" value={Payload.pupillaryresponsepupill} onChange={handlePayload} placeholder="Select Pupillary response Pupil-L" >
                            {
                                Settings?.pupillaryresponse?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.pupilshaperightpupil !== "" ? "16px" : "13px"} borderColor="#6B7280" id="pupilshaperightpupil" value={Payload.pupilshaperightpupil} onChange={handlePayload} placeholder="Select Pupil shape - Right Pupil" >
                            {
                                Settings?.pupilshape?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.pupilshapeleftpupil !== "" ? "16px" : "13px"} borderColor="#6B7280" id="pupilshapeleftpupil" value={Payload.pupilshapeleftpupil} onChange={handlePayload} placeholder="Select Pupil shape - Left Pupil" >
                            {
                                Settings?.pupilshape?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>
                        <Select h="45px" borderWidth="2px" fontSize={Payload.neurologyassessmentimpression !== "" ? "16px" : "13px"} borderColor="#6B7280" id="neurologyassessmentimpression" value={Payload.neurologyassessmentimpression} onChange={handlePayload} placeholder="Select Pupil Assessment Impression" >
                            {
                                Settings?.pupilneurologyassessmentimpression?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>


                        <Input leftIcon={<BsFillOpticalAudioFill />} label="Physiologic Finding Optic Lens" value={Payload.physiologicfindingopticlens} onChange={handlePayload} id="physiologicfindingopticlens" />
                    </SimpleGrid>

                    <Text fontSize="18px" mt="12px" fontWeight={"700"} color="blue.blue500">Glasgow Coma Scale & Neurology Assessment</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                        <Input leftIcon={<FaWeightScale />} label="Glasgow Coma Scale" value={Payload.glasgowcomascale} onChange={handlePayload} id="glasgowcomascale" />
                        <Select h="45px" borderWidth="2px" fontSize={Payload.pupilassessmentimpression !== "" ? "16px" : "13px"} borderColor="#6B7280" id="pupilassessmentimpression" value={Payload.pupilassessmentimpression} onChange={handlePayload} placeholder="Select Neurology assessment impression" >
                            {
                                Settings?.pupilneurologyassessmentimpression?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item}</option>

                                ))
                            }

                        </Select>

                    </SimpleGrid>
                    <Input leftIcon={<FaNoteSticky />} label="Remarks" value={Payload.nueroremarks} onChange={handlePayload} id="nueroremarks" />


                    <Button mt="32px" isLoading={Loading} onClick={save}>Save</Button>





                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
