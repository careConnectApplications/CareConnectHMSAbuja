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
import { FaCalendarAlt } from "react-icons/fa";
import { IoColorFilter } from "react-icons/io5";
import { SettingsApi, AddEntriesAPI,UpdateEntriesAPI } from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";

export default function CreatePartographModal({ isOpen, onClose, setOldPayload, activateNotifications, type, oldPayload }) {

    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState("");




    const date = Date.now()
    const currentDate = new Date(date).toISOString().split('T')[0]
    const id = localStorage.getItem('patientId')
    const [Payload, setPayload] = useState({
        selectdate: currentDate,
        temperature: "",
        pulse: "",
        bloodpressuresystolic: "",
        bloodpressurediastolic: "",
        respiratoryrate: "",
        foetalheartrate: "",
        liquor: "",
        moulding: "",
        cervicaldilationb: "",
        descentofhead: "",
        contraction: "",
        doseofoxytocinadministered: "",
        urineprotein: "",
        urineacetone: "",
        urinevolume: "",
        effecement: ""
    })
    const [UpdatedPayload, setUpdatedPayload] = useState({
        selectdate: currentDate,
        temperature: "",
        pulse: "",
        bloodpressuresystolic: "",
        bloodpressurediastolic: "",
        respiratoryrate: "",
        foetalheartrate: "",
        liquor: "",
        moulding: "",
        cervicaldilationb: "",
        descentofhead: "",
        contraction: "",
        doseofoxytocinadministered: "",
        urineprotein: "",
        urineacetone: "",
        urinevolume: "",
        effecement: ""
    })




    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const handleUpdatedPayload = (e) => {
        setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value })

    }

    const handleSubmitNew = async () => {
        setLoading(true)
        try {
            const result = await AddEntriesAPI(Payload, id);


            if (result.status === 200) {
                setLoading(false)

                activateNotifications("Entries Added Successfully", "success")
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
            const result = await UpdateEntriesAPI(UpdatedPayload, oldPayload._id);


            if (result.status === 200) {
                setLoading(false)

                activateNotifications("Entries Updated Successfully", "success")
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

 

    useEffect(() => {

        if (Object.values(Payload).some(value => value !== null && value !== "" && value !== undefined)) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
        getSettings()

        setUpdatedPayload({
            selectdate: oldPayload?.selectdate,
            temperature: oldPayload?.temperature,
            pulse: oldPayload?.pulse,
            bloodpressuresystolic: oldPayload?.bloodpressuresystolic,
            bloodpressurediastolic: oldPayload?.bloodpressurediastolic,
            respiratoryrate: oldPayload?.respiratoryrate,
            foetalheartrate: oldPayload?.foetalheartrate,
            liquor: oldPayload?.liquor,
            moulding: oldPayload?.moulding,
            cervicaldilationb: oldPayload?.cervicaldilationb,
            descentofhead: oldPayload?.descentofhead,
            contraction: oldPayload?.contraction,
            doseofoxytocinadministered: oldPayload?.doseofoxytocinadministered,
            urineprotein: oldPayload?.urineprotein,
            urineacetone: oldPayload?.urineacetone,
            urinevolume: oldPayload?.urinevolume,
            effecement: oldPayload?.effecement
        })

    }, [isOpen, Payload]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader> {type === "new" ? "Add New Entries" : type === "edit" ? "Edit Entries" : "Entries Details"} </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    {
                        type === "new" ? (
                            <>


                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                                    <Input leftIcon={<FaCalendarAlt />} val={Payload.selectdate !== "" ? true : false} isDisabled={true} label="Date" type='date' value={Payload.selectdate} onChange={handlePayload} id="selectdate" />
                                    <Input leftIcon={<FaNoteSticky />} label="Temperature" type='number' value={Payload.temperature} onChange={handlePayload} id="temperature" />
                                    <Input leftIcon={<FaNoteSticky />} label="Pulse" type='number' value={Payload.pulse} onChange={handlePayload} id="pulse" />
                                    <Input leftIcon={<FaNoteSticky />} label="Blood Pressure Systolic" type='number' value={Payload.bloodpressuresystolic} onChange={handlePayload} id="bloodpressuresystolic" />
                                    <Input leftIcon={<FaNoteSticky />} label="Blood Pressure Diastolic" type='number' value={Payload.bloodpressurediastolic} onChange={handlePayload} id="bloodpressurediastolic" />
                                    <Input leftIcon={<FaNoteSticky />} label="Respiratory Rate" type='number' value={Payload.respiratoryrate} onChange={handlePayload} id="respiratoryrate" />
                                    <Input leftIcon={<FaNoteSticky />} label="Fetal Heart Rate" type='number' value={Payload.foetalheartrate} onChange={handlePayload} id="foetalheartrate" />

                                    <Select h="45px" borderWidth="2px" fontSize={Payload.liquor !== "" ? "16px" : "13px"} borderColor="#6B7280" id="liquor" value={Payload.liquor} onChange={handlePayload} placeholder="Select Liquor" >

                                        {
                                            Settings?.liquor?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Select h="45px" borderWidth="2px" fontSize={Payload.moulding !== "" ? "16px" : "13px"} borderColor="#6B7280" id="moulding" value={Payload.moulding} onChange={handlePayload} placeholder="Select Moulding" >

                                        {
                                            Settings?.moulding?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Select h="45px" borderWidth="2px" fontSize={Payload.cervicaldilationb !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cervicaldilationb" value={Payload.cervicaldilationb} onChange={handlePayload} placeholder="Select Cervical Dilation (cm)" >

                                        {
                                            Settings?.cervicaldilationb?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Select h="45px" borderWidth="2px" fontSize={Payload.descentofhead !== "" ? "16px" : "13px"} borderColor="#6B7280" id="descentofhead" value={Payload.descentofhead} onChange={handlePayload} placeholder="Select Descent Of Head (cm)" >

                                        {
                                            Settings?.descentofhead?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Select h="45px" borderWidth="2px" fontSize={Payload.contraction !== "" ? "16px" : "13px"} borderColor="#6B7280" id="contraction" value={Payload.contraction} onChange={handlePayload} placeholder="Select contraction" >

                                        {
                                            Settings?.contraction?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Input leftIcon={<FaNoteSticky />} label="Dose Of Oxytocin Administered" type='number' value={Payload.doseofoxytocinadministered} onChange={handlePayload} id="doseofoxytocinadministered" />
                                    <Input leftIcon={<FaNoteSticky />} label="Urine Protein" type='number' value={Payload.urineprotein} onChange={handlePayload} id="urineprotein" />
                                    <Input leftIcon={<FaNoteSticky />} label="Urine Acetone" type='number' value={Payload.urineacetone} onChange={handlePayload} id="urineacetone" />
                                    <Input leftIcon={<FaNoteSticky />} label="Urine Volume" type='number' value={Payload.urinevolume} onChange={handlePayload} id="urinevolume" />
                                    <Input leftIcon={<FaNoteSticky />} label="Effecement" type='number' value={Payload.effecement} onChange={handlePayload} id="effecement" />


                                </SimpleGrid>

                                <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={handleSubmitNew}>Save</Button>

                            </>
                        ) : type === "edit" ? (
                            <>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                                    <Input leftIcon={<FaCalendarAlt />} val={UpdatedPayload.selectdate !== "" ? true : false} isDisabled={true} label="Date" type='date' value={UpdatedPayload.selectdate} onChange={handleUpdatedPayload} id="selectdate" />
                                    <Input leftIcon={<FaNoteSticky />} label="Temperature" type='number' value={UpdatedPayload.temperature} onChange={handleUpdatedPayload} id="temperature" />
                                    <Input leftIcon={<FaNoteSticky />} label="Pulse" type='number' value={UpdatedPayload.pulse} onChange={handleUpdatedPayload} id="pulse" />
                                    <Input leftIcon={<FaNoteSticky />} label="Blood Pressure Systolic" type='number' value={UpdatedPayload.bloodpressuresystolic} onChange={handleUpdatedPayload} id="bloodpressuresystolic" />
                                    <Input leftIcon={<FaNoteSticky />} label="Blood Pressure Diastolic" type='number' value={UpdatedPayload.bloodpressurediastolic} onChange={handleUpdatedPayload} id="bloodpressurediastolic" />
                                    <Input leftIcon={<FaNoteSticky />} label="Respiratory Rate" type='number' value={UpdatedPayload.respiratoryrate} onChange={handleUpdatedPayload} id="respiratoryrate" />
                                    <Input leftIcon={<FaNoteSticky />} label="Fetal Heart Rate" type='number' value={UpdatedPayload.foetalheartrate} onChange={handleUpdatedPayload} id="foetalheartrate" />

                                    <Select h="45px" borderWidth="2px" fontSize={UpdatedPayload.liquor !== "" ? "16px" : "13px"} borderColor="#6B7280" id="liquor" value={UpdatedPayload.liquor} onChange={handleUpdatedPayload} placeholder="Select Liquor" >

                                        {
                                            Settings?.liquor?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Select h="45px" borderWidth="2px" fontSize={UpdatedPayload.moulding !== "" ? "16px" : "13px"} borderColor="#6B7280" id="moulding" value={UpdatedPayload.moulding} onChange={handleUpdatedPayload} placeholder="Select Moulding" >

                                        {
                                            Settings?.moulding?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Select h="45px" borderWidth="2px" fontSize={UpdatedPayload.cervicaldilationb !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cervicaldilationb" value={UpdatedPayload.cervicaldilationb} onChange={handleUpdatedPayload} placeholder="Select Cervical Dilation (cm)" >

                                        {
                                            Settings?.cervicaldilationb?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Select h="45px" borderWidth="2px" fontSize={UpdatedPayload.descentofhead !== "" ? "16px" : "13px"} borderColor="#6B7280" id="descentofhead" value={UpdatedPayload.descentofhead} onChange={handleUpdatedPayload} placeholder="Select Descent Of Head (cm)" >

                                        {
                                            Settings?.descentofhead?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Select h="45px" borderWidth="2px" fontSize={UpdatedPayload.contraction !== "" ? "16px" : "13px"} borderColor="#6B7280" id="contraction" value={UpdatedPayload.contraction} onChange={handleUpdatedPayload} placeholder="Select contraction" >

                                        {
                                            Settings?.contraction?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Input leftIcon={<FaNoteSticky />} label="Dose Of Oxytocin Administered" type='number' value={UpdatedPayload.doseofoxytocinadministered} onChange={handleUpdatedPayload} id="doseofoxytocinadministered" />
                                    <Input leftIcon={<FaNoteSticky />} label="Urine Protein" type='number' value={UpdatedPayload.urineprotein} onChange={handleUpdatedPayload} id="urineprotein" />
                                    <Input leftIcon={<FaNoteSticky />} label="Urine Acetone" type='number' value={UpdatedPayload.urineacetone} onChange={handleUpdatedPayload} id="urineacetone" />
                                    <Input leftIcon={<FaNoteSticky />} label="Urine Volume" type='number' value={UpdatedPayload.urinevolume} onChange={handleUpdatedPayload} id="urinevolume" />
                                    <Input leftIcon={<FaNoteSticky />} label="Effecement" type='number' value={UpdatedPayload.effecement} onChange={handleUpdatedPayload} id="effecement" />


                                </SimpleGrid>

                                <Button mt="32px" isLoading={Loading} disabled={Disabled} onClick={handleSubmitUpdate}>Update</Button>
                            </>
                        ) : (
                            <>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                                    <Input isDisabled={true} leftIcon={<FaCalendarAlt />} val={UpdatedPayload.selectdate !== "" ? true : false}  label="Date" type='date' value={UpdatedPayload.selectdate} onChange={handleUpdatedPayload} id="selectdate" />
                                    <Input isDisabled={true} leftIcon={<FaNoteSticky />} label="Temperature" type='number' value={UpdatedPayload.temperature} onChange={handleUpdatedPayload} id="temperature" />
                                    <Input isDisabled={true} leftIcon={<FaNoteSticky />} label="Pulse" type='number' value={UpdatedPayload.pulse} onChange={handleUpdatedPayload} id="pulse" />
                                    <Input isDisabled={true} leftIcon={<FaNoteSticky />} label="Blood Pressure Systolic" type='number' value={UpdatedPayload.bloodpressuresystolic} onChange={handleUpdatedPayload} id="bloodpressuresystolic" />
                                    <Input isDisabled={true} leftIcon={<FaNoteSticky />} label="Blood Pressure Diastolic" type='number' value={UpdatedPayload.bloodpressurediastolic} onChange={handleUpdatedPayload} id="bloodpressurediastolic" />
                                    <Input isDisabled={true} leftIcon={<FaNoteSticky />} label="Respiratory Rate" type='number' value={UpdatedPayload.respiratoryrate} onChange={handleUpdatedPayload} id="respiratoryrate" />
                                    <Input isDisabled={true} leftIcon={<FaNoteSticky />} label="Fetal Heart Rate" type='number' value={UpdatedPayload.foetalheartrate} onChange={handleUpdatedPayload} id="foetalheartrate" />

                                    <Select isDisabled={true} h="45px" borderWidth="2px" fontSize={UpdatedPayload.liquor !== "" ? "16px" : "13px"} borderColor="#6B7280" id="liquor" value={UpdatedPayload.liquor} onChange={handleUpdatedPayload} placeholder="Select Liquor" >

                                        {
                                            Settings?.liquor?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Select isDisabled={true} h="45px" borderWidth="2px" fontSize={UpdatedPayload.moulding !== "" ? "16px" : "13px"} borderColor="#6B7280" id="moulding" value={UpdatedPayload.moulding} onChange={handleUpdatedPayload} placeholder="Select Moulding" >

                                        {
                                            Settings?.moulding?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Select isDisabled={true} h="45px" borderWidth="2px" fontSize={UpdatedPayload.cervicaldilationb !== "" ? "16px" : "13px"} borderColor="#6B7280" id="cervicaldilationb" value={UpdatedPayload.cervicaldilationb} onChange={handleUpdatedPayload} placeholder="Select Cervical Dilation (cm)" >

                                        {
                                            Settings?.cervicaldilationb?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Select isDisabled={true} h="45px" borderWidth="2px" fontSize={UpdatedPayload.descentofhead !== "" ? "16px" : "13px"} borderColor="#6B7280" id="descentofhead" value={UpdatedPayload.descentofhead} onChange={handleUpdatedPayload} placeholder="Select Descent Of Head (cm)" >

                                        {
                                            Settings?.descentofhead?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Select isDisabled={true} h="45px" borderWidth="2px" fontSize={UpdatedPayload.contraction !== "" ? "16px" : "13px"} borderColor="#6B7280" id="contraction" value={UpdatedPayload.contraction} onChange={handleUpdatedPayload} placeholder="Select contraction" >

                                        {
                                            Settings?.contraction?.map((item, i) => (
                                                <option value={`${item}`} key={i}>{item}</option>

                                            ))
                                        }

                                    </Select>
                                    <Input isDisabled={true} leftIcon={<FaNoteSticky />} label="Dose Of Oxytocin Administered" type='number' value={UpdatedPayload.doseofoxytocinadministered} onChange={handleUpdatedPayload} id="doseofoxytocinadministered" />
                                    <Input isDisabled={true} leftIcon={<FaNoteSticky />} label="Urine Protein" type='number' value={UpdatedPayload.urineprotein} onChange={handleUpdatedPayload} id="urineprotein" />
                                    <Input isDisabled={true} leftIcon={<FaNoteSticky />} label="Urine Acetone" type='number' value={UpdatedPayload.urineacetone} onChange={handleUpdatedPayload} id="urineacetone" />
                                    <Input isDisabled={true} leftIcon={<FaNoteSticky />} label="Urine Volume" type='number' value={UpdatedPayload.urinevolume} onChange={handleUpdatedPayload} id="urinevolume" />
                                    <Input isDisabled={true} leftIcon={<FaNoteSticky />} label="Effecement" type='number' value={UpdatedPayload.effecement} onChange={handleUpdatedPayload} id="effecement" />


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
