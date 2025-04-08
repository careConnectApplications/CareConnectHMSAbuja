import { HStack, Text, Box } from '@chakra-ui/react'
import React from 'react'

export default function InformationCard({title,value, textAlign="left"}) {
    return (
        <Box>
            <Text textAlign={textAlign} textTransform="capitalize" fontSize="11px" fontWeight="400" color="#8A8D8E">{title}</Text>
            <Text textAlign={textAlign} textTransform="capitalize" fontSize="13px" fontWeight="500" color="#1E1E1E">{value}</Text>
        </Box>
    
 
            )
}
