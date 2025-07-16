import { HStack, Text, Box, Flex, Stack, Switch, FormControl, FormLabel, Icon, Avatar } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import { FaUserShield } from 'react-icons/fa';

import { GetSingleUsersApi, UpdateUserPermissionApi  } from "../Utils/ApiCalls";


import ShowToast from "../Components/ToastNotification";

import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useParams } from 'react-router-dom';
import Preloader from '../Components/Preloader';

export default function EditPermission() {
    const { id } = useParams()
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

   
    
    const [permissions, setPermissions] = useState([
        {
            "id": 1,
            "name": "isOutPatientParent",
            "status": false
        },
        {
            "id": 2,
            "name": "isOutPatient",
            "status": false
        },
        {
            "id": 3,
            "name": "isInPatient",
            "status": false
        },
        {
            "id": 4,
            "name": "isLabStaff",
            "status": false
        },
        {
            "id": 5,
            "name": "isRadiologyStaff",
            "status": false
        },
        {
            "id": 6,
            "name": "isScheduleAppointmentStaff",
            "status": false
        },
        {
            "id": 7,
            "name": "isScheduleProcedureStaff",
            "status": false
        },
        {
            "id": 8,
            "name": "isPharmacyStaff",
            "status": false
        },
        {
            "id": 9,
            "name": "isBillingStaff",
            "status": false
        },
        {
            "id": 10,
            "name": "isAdminStaff",
            "status": false
        },
        {
            "id": 11,
            "name": "isClinicalReport",
            "status": false
        },
        {
            "id": 12,
            "name": "isUserManagerStaff",
            "status": false
        },
        {
            "id": 13,
            "name": "isPaymentStaff",
            "status": false
        }
    ]);

     const getSingleUser = async () => {
        setLoading(true);
        try {
          const result = await GetSingleUsersApi(id);
    
          console.log("result getSingleUser", result);
    
          if (result.status === true) {
            setLoading(false);
            setUser(result.data.user);
            setPermissions(result.data.permissions);
          }
        } catch (e) {
          console.log(e.message);
        }
      };

    const handlePermissionChange = (id) => {
        setPermissions(
            permissions.map((permission) =>
                permission.id === id
                    ? { ...permission, status: !permission.status }
                    : permission
            )
        );
    };


      const handleUpdate = async () => {
        setIsLoading(true);
        try {
          const result = await UpdateUserPermissionApi({permissions},id);
    
          console.log("result handleUpdate", result);
    
          if (result.status === true) {
            setIsLoading(false);
            activateNotifications("Permissions updated successfully", "success");
        }
    } catch (e) {
        console.log(e.message);
        setIsLoading(false);
        activateNotifications(e.message, "success");
        }
      };

    // const handleUpdate = () => { 
    //     // Handle update logic here
    //     console.log("Updated permissions:", permissions);
    //     activateNotifications("Permissions updated successfully", "success");
    // };



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
       
        getSingleUser()
        
    }, [id]);

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
                        {permissions.map((permission) => (
                            <Flex
                                key={permission.id}
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
                                    <FormLabel htmlFor={permission.name} mb="0">
                                        {permission.name.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })}
                                    </FormLabel>
                                </HStack>
                                <Switch
                                    colorScheme="orange"
                                    size="md"
                                    color="orange.500"
                                    variant="outline"                                  
                                    id={permission.name}
                                    isChecked={permission.status}
                                    onChange={() => handlePermissionChange(permission.id)}
                                />
                            </Flex>
                        ))}
                    </Stack>
                    <Flex justify="flex-end" mt={8}>
                        <Button isLoading={isLoading} px="40px" w="230px" onClick={handleUpdate} >Update Permissions</Button>
                    </Flex>
                </Box>
            </Box>
        </MainLayout>
    );
}
