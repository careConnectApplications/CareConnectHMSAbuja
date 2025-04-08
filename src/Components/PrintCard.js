import { HStack, Text, Spacer } from '@chakra-ui/react'
import React from 'react'

export default function PrintCard({ title, value }) {
    return (
        <HStack spacing="1px">
            <Text textTransform="uppercase" fontWeight="800" fontSize="11px" >{title}</Text>
            <Spacer/>
            <Text textTransform="capitalize" textAlign="right" fontWeight="700" fontSize="11px" >{value}</Text>
        </HStack> 

    )
}
