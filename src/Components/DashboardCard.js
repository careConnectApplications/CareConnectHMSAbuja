import { HStack, Text, Box } from '@chakra-ui/react'
import React from 'react'

export default function DashboardCard({ title, value }) {
    return (
        <Box spacing="1px" _hover={{bg: "blue.blue500", boxShadow: "2px 2px 10px 1px #370246" }} transition="0.4s" bg={"blue.blue400"} py="15px" px="25px" rounded="10px" boxShadow="2px 2px 8px 1px #370246" cursor="pointer">
            <Text textTransform="capitalize" color="#fff" fontWeight="600" fontSize="12px" >{title}</Text>
           
            <Text textTransform="capitalize" color="#ddd" textAlign="left" fontWeight="700" fontSize="15px" >{value}</Text>
        </Box> 

    )
}
