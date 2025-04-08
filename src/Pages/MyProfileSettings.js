import { HStack, Text, Box, Flex, Stack, Select } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Button from "../Components/Button";
import Input from "../Components/Input";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { SettingsApi, UpdateUserApi } from "../Utils/ApiCalls";
import ShowToast from "../Components/ToastNotification";
import { useNavigate } from 'react-router-dom';

export default function MyProfileSettings() {
    const token = localStorage.getItem("token");
    const onlineUser = JSON.parse(localStorage.getItem("onlineUser"));

    const [Settings, setSettings] = useState("");
    const [Editable, setEditable] = useState(false);
    const [Toast, setToast] = useState(null);

    const [Payload, setPayload] = useState({
        lastName: "",
        firstName: "",
        email: "",
        clinic: ""
    });

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value });
    };

    const getSettings = async () => {
        try {
            const result = await SettingsApi();
            console.log("getSettings", result);
            setSettings(result);
        } catch (e) {
            console.error("Error fetching settings", e);
        }
    };
    
    
    const handleUpdate = async () => {
        try {
            const result = await UpdateUserApi(Payload, onlineUser._id);
            if (result.status) {
                console.log("User updated successfully", result);
                localStorage.setItem("onlineUser", JSON.stringify(result.data.queryresult));
                setToast({ status: "success", message: result.msg || "Profile updated successfully!" });
    
                // Set timeout to clear the toast after 2 seconds
                setTimeout(() => {
                    setToast(null);
                }, 2000);
            } else {
                setToast({ status: "error", message: result.msg || "Failed to update profile." });
    
                
                setTimeout(() => {
                    setToast(null);
                }, 2000);
            }
        } catch (e) {
            console.error("Error updating user", e);
            setToast({ status: "error", message: "An error occurred while updating your profile." });
    
            
            setTimeout(() => {
                setToast(null);
            }, 2000);
        }
    };
    

    useEffect(() => {
        getSettings();
        setPayload({
            lastName: onlineUser.lastName,
            firstName: onlineUser.firstName,
            email: onlineUser.email,
            clinic: onlineUser.clinic
        });
    }, []);

    return (
        <Box mt="12px" bg="#fff" border="2px solid #EFEFEF" py='30px' px={["8px", "8px", "18px", "18px"]} rounded='10px'>
            {Toast && <ShowToast status={Toast.status} message={Toast.message} />}
            <Text fontSize={"17px"} fontWeight={"600"} lineHeight={"20.57px"} color={"#1F2937"}>Personal Information</Text>
            <Text fontSize={"13px"} fontWeight={"400"} lineHeight={"27px"} color={"#626974"}>Manage and update your profile information</Text>

            <Flex justifyContent="flex-start" alignItems="center" mt="20px">
                <Button w="10%" leftIcon={<MdModeEdit />} onClick={() => setEditable(!Editable)}> {Editable === false ? "Edit Profile" : "Cancel Edit Mode"}</Button>
            </Flex>

            <Stack mt={"20px"} spacing={"15px"} w="100%">
                <hr className="remove" />
                <HStack justifyContent="space-between" w="100%">
                    <Box w="30%">
                        <Text fontSize={"14px"} fontWeight={"500"} lineHeight={"22px"} color={"#1F2937"}>First Name</Text>
                    </Box>
                    <Box w="70%">
                        <Input leftIcon={<FaUser />} isDisabled={Editable === false ? true : false} val={Payload.firstName !== "" ? true : false} label="First Name" type="text" value={Payload.firstName} onChange={handlePayload} id="firstName" />

                    </Box>
                </HStack>
                <hr className="remove" />
                <HStack justifyContent="space-between" w="100%">
                    <Box w="30%">
                        <Text fontSize={"14px"} fontWeight={"500"} lineHeight={"22px"} color={"#1F2937"}>Last Name</Text>
                    </Box>
                    <Box w="70%">
                        <Input leftIcon={<FaUser />} isDisabled={Editable === false ? true : false} val={Payload.lastName !== "" ? true : false} label="Last Name" type="text" value={Payload.lastName} onChange={handlePayload} id="lastName" />
                    </Box>
                </HStack>
                <hr className="remove" />
                <HStack justifyContent="space-between" w="100%">
                    <Box w="30%">
                        <Text fontSize={"14px"} fontWeight={"500"} lineHeight={"22px"} color={"#1F2937"}>Email</Text>
                    </Box>
                    <Box w="70%">
                        <Input leftIcon={<MdEmail />} isDisabled={Editable === false ? true : false} val={Payload.email !== "" ? true : false} label="Email  Address" type="email" value={Payload.email} onChange={handlePayload} id="email" />

                    </Box>
                </HStack>
                <hr className="remove" />
                <HStack justifyContent="space-between" w="100%">
                    <Box w="30%">
                        <Text fontSize={"14px"} fontWeight={"500"} lineHeight={"22px"} color={"#1F2937"}>Clinic</Text>
                    </Box>
                    <Box w="70%">
                        <Select h="45px" borderWidth="2px" isDisabled={Editable === false ? true : false} fontSize={Payload.clinic !== "" ? "16px" : "13px"} borderColor="#6B7280" id="clinic" value={Payload.clinic} onChange={handlePayload} placeholder="Select Clinic" >
                            {
                                Settings?.clinics?.map((item, i) => (
                                    <option value={`${item.clinic}`} key={i}>{item.clinic}</option>
                                ))
                            }

                        </Select>

                    </Box>
                </HStack>

            </Stack>

            <Flex justifyContent="flex-end" alignItems="center" mt="20px">
                <Button w="10%" onClick={handleUpdate}>Update</Button>
            </Flex>
        </Box>
    );
}
