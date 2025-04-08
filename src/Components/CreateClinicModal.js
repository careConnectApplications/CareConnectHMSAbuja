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
    Stack, Select
} from '@chakra-ui/react'
import Input from "./Input";
import Button from "./Button";
import { UpdateClinicSettingAPI, SettingsApi, AddClinicSettingsApi } from "../Utils/ApiCalls";
import { MdMiscellaneousServices } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";
import { FaClinicMedical } from "react-icons/fa";

export default function CreateClinicModal({ isOpen, onClose, type, activateNotifications, oldPayload }) {



    const [Settings, setSettings] = useState({});
    const [Loading, setLoading] = useState(false);
    const [Payload, setPayload] = useState({
        clinic: "",
        type: "",
    });
    const [UpdatedPayload, setUpdatedPayload] = useState({
        clinic: ""
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

    const AddPrice = async () => {
        setLoading(true)
        try {
            const result = await AddClinicSettingsApi(Payload);

            if (result.status === 200) {
                setLoading(false)
                setPayload({
                    clinic: "",
                    type: ""
                })

                activateNotifications("Clinic Added Successfully", "success")
                onClose()

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    };
    const UpdatePrice = async () => {
        setLoading(true)
        try {
            const result = await UpdateClinicSettingAPI(UpdatedPayload, oldPayload._id);


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



        getSettings();
        setUpdatedPayload({
            clinic: oldPayload.clinic

        })
    }, [isOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{type === "new" ? "Add new Clinic/Department/Pharmacy" : "Edit Clinic/Department/Pharmacy"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    {
                        type === "new" ? (
                            <>
                                <Stack spacing="15px">
                                    <Select
                                        id="type"
                                        value={Payload.type}
                                        onChange={handlePayload}
                                        placeholder="Select Type"
                                        fontSize={Payload.type !== "" ? "16px" : "13px"}
                                    >
                                        {
                                            Settings?.clinictype?.map((item, i) => (

                                                <option value={item}>{item}</option>
                                            ))
                                        }


                                    </Select>

                                    <Input val={Payload.clinic !== "" ? true : false} leftIcon={<FaClinicMedical />} onChange={handlePayload} id="clinic" value={Payload.clinic} label="Clinic/Department/Pharmacy" />

                                </Stack>

                                <Button mt="32px" isLoading={Loading} onClick={AddPrice}>Add </Button>
                            </>
                        ) : (
                            <>
                                <Stack spacing="15px">
                                    <Select
                                        id="type"
                                        value={UpdatedPayload.type}
                                        onChange={handleUpdatedPayload}
                                        placeholder="Select Type"
                                        fontSize={UpdatedPayload.type !== "" ? "16px" : "13px"}
                                    >
                                        {
                                            Settings?.clinictype?.map((item, i) => (

                                                <option value={item}>{item}</option>
                                            ))
                                        }


                                    </Select>

                                    <Input val={UpdatedPayload.clinic !== "" ? true : false} leftIcon={<FaClinicMedical />} onChange={handleUpdatedPayload} id="clinic" value={UpdatedPayload.clinic} label="Clinic/Department/Pharmacy" />
                                </Stack>
                                <Button mt="32px" isLoading={Loading} onClick={UpdatePrice}>Update </Button>
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
