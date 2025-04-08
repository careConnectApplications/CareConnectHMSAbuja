import React from 'react' 
import {
    Text,
    Box,
} from '@chakra-ui/react'

export default function ShowToast({status, message}) {
  return (
     <Box   w={["80%","80%", "30%", "30%" ]} textTransform={"capitalize"} pos="fixed" rounded="8px" px="15px" py="20px" textAlign="center" color="#fff" top="5" right="5" background={status ==="success" ? "#34996B": status === "warning" ? "orange" : "red"} zIndex="1000">
        <Text>{message}</Text>
    </Box>
  )
}
