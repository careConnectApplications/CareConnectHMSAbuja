import { Box, Flex, Stack } from '@chakra-ui/react'
import NavBar from './NavBar'
import SideBar from './SideBar'
import Footer from './Footer'
import React, { useState } from 'react'

export default function MainLayout({ children, bgColor = "#F4F7FC", color = "black",  showSearch=true, showNav=true, borderRight="1px solid #ddd",  active = false }) {

    const [Wide, setWide] = useState(true);
  return (

    <Box bgColor={bgColor} minH="100vh"  >
      

      <Flex pos={"relative"} direction={["column-reverse", "column-reverse", "column-reverse", "column-reverse", "row"]} justifyContent="space-between" alignItems={"flex-start"}>
        <Box zIndex="10" display={["none", "none", "none", "none", "block"]} w={Wide ? "16%": "7%"} pos={"fixed"} height={"100vh"} transition="0.5s" >
          <SideBar active={active} showNav={showNav}  borderRight={borderRight} setWide={setWide} Wide={Wide}/>
        </Box>

        <Box transition="0.5s" width={['100%', '100%', '100%', '100%', Wide ? "84%": "93%"]}  ml={["0%","0%","0%","0%", Wide ? "16%": "7%"]} overflowX={"auto"}>
        <NavBar showSearch={showSearch} />
      

          <Box  py="16.5px" px={["10px","10px","24px","24px"]} >
            {children}
          </Box>
        <Footer/>
       

        </Box>
      </Flex>
    </Box>
  )
}
