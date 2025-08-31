import { HStack, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, Image } from '@chakra-ui/react'
import React from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import MyProfileSettings from './MyProfileSettings'
import PasswordReset from "./PasswordReset"
import { useColors } from "../Utils/colors";


export default function ProfileSettings() {
    const {
        bgColor,
        textColor,
        borderColor,
        titleTextColor,
        subTitleTextColor,
        primaryColor,
    } = useColors();
    return (
        <MainLayout>
            <Seo title="Profile Settings" description="Care Connect Profile Settings" />

            <HStack>
                <Text color={titleTextColor} fontWeight="600" fontSize="19px">
                    Profile Settings
                </Text>

            </HStack>
            <Text color={subTitleTextColor} mt="9px" fontWeight="400" fontSize="15px">
                Organize, manage and view all profile settings to suit what is needed at anytime at your convenience.
            </Text>


            <Tabs mt="12px">
                <TabList color={textColor} pb="10px">
                    <Tab  _focus={{outline: "none"}} _selected={{ color: primaryColor, fontWeight: "700" }}>Your Profile </Tab>
                    <Tab  _focus={{outline: "none"}} _selected={{ color: primaryColor, fontWeight: "700" }}>Password Reset</Tab>
                  

                </TabList>
                <TabIndicator mt='-1.5px' height='2px' bg={primaryColor} borderRadius='1px' />
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
