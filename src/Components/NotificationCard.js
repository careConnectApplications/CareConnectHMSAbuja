import React from 'react'
import { Box, Flex, HStack, Avatar, Text, Menu, MenuButton, MenuList, MenuItem, useDisclosure } from '@chakra-ui/react'

export default function NotificationCard({title,message,unread, timestamp}) {
    return (
        <HStack borderBottom="1px solid #EDEFF2" pb="17px" pt="10px">
            <Box h="6px" w="6px" bg={unread ? "blue.blue500":"#ADB4BF" } rounded={"100%"}></Box>
            <Box>
                <Text fontSize={"13px"} textTransform="capitalize" fontWeight="600" color={"#6B7280"}>{title} </Text>
                <Text fontSize={"13px"} fontWeight={"400"} color={"#6B7280"} textWrap="wrap">{message}</Text>
                <Text fontSize={"12px"} fontWeight="400" color={"#ADB4BF"}>{timestamp}</Text>
            </Box>
        </HStack> 
  )
}
