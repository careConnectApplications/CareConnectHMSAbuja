import { Box, Text, Spacer } from '@chakra-ui/react'
import React from 'react'

export default function PreviewCardV2({ title, value }) {
    return (
        <Box display={value !=="" && value !== null  && value !== undefined ? "flex": "none"} >
            <Text textTransform="capitalize" textAlign="left" fontWeight="400" fontSize="14px" >{value}</Text>
           
            <Spacer/>
        </Box> 

    )
}
