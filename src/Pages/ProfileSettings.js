import { HStack, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, Image } from '@chakra-ui/react'
import React from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import MyProfileSettings from './MyProfileSettings'
import PasswordReset from "./PasswordReset"


export default function ProfileSettings() {
    return (
        <MainLayout>
            <Seo title="Profile Settings" description="Care Connect Profile Settings" />

            <HStack>
                <Text color="#1F2937" fontWeight="600" fontSize="19px">
                    Profile Settings
                </Text>

            </HStack>
            <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
                Organize, manage and view all profile settings to suit what is needed at anytime at your convenience.
            </Text>


            <Tabs mt="12px">
                <TabList color="#101828" pb="10px">
                    <Tab  _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Your Profile </Tab>
                    <Tab  _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Password Reset</Tab>
                  

                </TabList>
                <TabIndicator mt='-1.5px' height='2px' bg='blue.blue500' borderRadius='1px' />
                <TabPanels>
                    <TabPanel p="0">
                       <MyProfileSettings/>
                    </TabPanel>
                    <TabPanel p="0">
                       <PasswordReset/>
                    </TabPanel>
                   

                </TabPanels>
            </Tabs>

        </MainLayout>
    )
}
