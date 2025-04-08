import { HStack, Text, Spacer } from '@chakra-ui/react'
import React from 'react'

export default function PreviewCard({ title, value }) {
    return (
        <HStack display={value !=="" && value !== null  && value !== undefined ? "flex": "none"} >
            <Text textTransform="uppercase" fontWeight="600" fontSize="14px" >{title}:</Text>
            <Spacer/>
            <Text width={["100%","60%"]}  textTransform="capitalize" textAlign="right" fontWeight="400" fontSize="14px" >{value}</Text>
        </HStack> 

    )
}
