import { HStack, Text, Box } from '@chakra-ui/react'
import React from 'react'

export default function ExamineDetailsCard({ title, value }) {
    return (
        <Box >
            <Text textTransform="uppercase" fontWeight="600" fontSize="14px" >{title}</Text>
          
            <Text mt="10px" textTransform="capitalize" textAlign="left" fontWeight="400" fontSize="14px" >{value}</Text>
        </Box> 

    )
}
