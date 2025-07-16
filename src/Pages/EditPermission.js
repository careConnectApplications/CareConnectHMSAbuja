import { HStack, Text, Box, Flex, Stack, Switch, FormControl, FormLabel, Icon, Avatar } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import { FaUserShield } from 'react-icons/fa';

import ShowToast from "../Components/ToastNotification";

import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useParams } from 'react-router-dom';
import { baseUrl } from '../Utils/ApiConfig';
import axios from 'axios';
import Preloader from '../Components/Preloader';

export default function EditPermission() {
    const { id } = useParams()
    const [user, setUser] = useState({
        firstName: "Solomon",
        lastName: "Adeleke"
    });
    const [loading, setLoading] = useState(true);
    
    const [permissions, setPermissions] = useState({
        "can-view-dashboard": true, 
        "can-view-patients": true,
        "can-add-patient": false,
        "can-edit-patient": false,
        "can-delete-patient": false,
        "can-view-appointments": true,
        "can-add-appointment": false,
        "can-edit-appointment": false,
        "can-delete-appointment": false,
        "can-view-users": false,
        "can-add-user": false,
        "can-edit-user": false,
        "can-delete-user": false,
    });

    const handlePermissionChange = (permission) => {
        setPermissions(prev => ({ ...prev, [permission]: !prev[permission] }));
    };

    const handleUpdate = () => {
        // Handle update logic here
        console.log("Updated permissions:", permissions);
        activateNotifications("Permissions updated successfully", "success");
    };



    const [showToast, setShowToast] = useState({
        show: false,
        message: "",
        status: "",
    });

    const activateNotifications = (message, status) => {

        setShowToast({
            show: true,
            message: message,
            status: status,
        });

        setTimeout(() => {
            setShowToast({
                show: false,
            });

        }, 5000)
    }


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${baseUrl}/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUser(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user:", error);
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const filteredPermissions = Object.keys(permissions);

    const nav = useNavigate()

    const pathname = localStorage.getItem("pathLocation")
    return (
        <MainLayout>
            {showToast.show && (
                <ShowToast message={showToast.message} status={showToast.status} />
            )}
            <Seo title="Edit Permission" description="Care connect Edit Permission" />

            <Box>
                <Button leftIcon={<IoMdArrowRoundBack />} px="40px" w="100px" onClick={() => nav(`${pathname}`)}>Back</Button>

                <Box mt={8}>
                    <Text color="#1F2937" fontWeight="600" fontSize="19px">Edit Role Permissions</Text>
                     <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
                            View and manage all user roles and permissions,
                            assign role, and update details as needed.
                          </Text>
                    {loading ? (
                        <Preloader />
                    ) : (
                        <Box p={5} shadow="md" borderWidth="1px" mt={4}>
                            <HStack>
                                <Avatar name={`${user?.firstName} ${user?.lastName}`} src="" />
                                <Box>
                                    <Text fontWeight="bold">Name: {user?.firstName} {user?.lastName}</Text>
                                    <Text>Email: {user?.email}</Text>
                                    <Text>Role: {user?.role}</Text>
                                </Box>
                            </HStack>
                        </Box>
                    )}
                    <Stack spacing={6}    mt="12px">
                        {filteredPermissions.map((permission) => (
                            <Flex
                                key={permission}
                                as={FormControl}
                                align="center"
                                justify="space-between"
                                p={3}
                                borderWidth="1px"
                                borderRadius="md"
                                _hover={{
                                    borderColor: "blue.blue500",
                                    borderWidth: "2px"
                                }}
                            >
                                <HStack>
                                    <Icon as={FaUserShield} />
                                    <FormLabel htmlFor={permission} mb="0">
                                        {permission.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </FormLabel>
                                </HStack>
                                <Switch
                                    colorScheme="orange"
                                    size="md"
                                    color="orange.500"
                                    variant="outline"
                                  
                                    id={permission}
                                    isChecked={permissions[permission]}
                                    onChange={() => handlePermissionChange(permission)}
                                />
                            </Flex>
                        ))}
                    </Stack>
                    <Flex justify="flex-end" mt={8}>
                        <Button px="40px" w="230px" onClick={handleUpdate} >Update Permissions</Button>
                    </Flex>
                </Box>
            </Box>
        </MainLayout>
    );
}
