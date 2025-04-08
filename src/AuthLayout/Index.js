import { Box, Flex, Image } from '@chakra-ui/react'
import React from 'react'
import Footer from './Footer'
import sideImage from '../Assets/authImage.svg'
import bg from "../Assets/background.jpg"



export default function AuthLayout({ children }) {
    return (
        <Flex minHeight="100vh" bgImage={bg}  justifyContent={"center"} bgSize={"cover"} bgRepeat={"no-repeat"} alignItems={"center"}>

          
          

            <Box bg={"rgb(123,68,162,0.6)"} rounded={"18px"} px="10px"  w={["95%", "90%", "50%", "50%"]} pb="32px" >
                {children}
                <Footer />
            </Box>
        </Flex>
    )
}
