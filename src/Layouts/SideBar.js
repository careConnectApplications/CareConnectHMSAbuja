import { Box, HStack, Image, Stack, Text, Flex } from '@chakra-ui/react'
import React, { useState } from 'react'
import logo from "../Assets/carelogo.png"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavList } from './NavList';
import NavItem from "./NavLink";
import { HiOutlineMenu } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
export default function SideBar({ borderRight = "1px solid #EDEFF2", h = "100%", showNav = true, active = false, setWide, Wide }) {
    const location = useLocation();



    const List = NavList(location);
    const navigate = useNavigate();


    const [show, setShow] = useState(false);


    const nav = useNavigate()


    const [isOpen, setIsOpen] = useState('');



    return (
        <Box pb="32px" h={h} overflowY={"auto"} bgColor={"white"} borderRight={borderRight} cursor="pointer" >
            {
                Wide === true &&  (

                    <Flex justifyContent={"space-between"} alignItems={"center"} px="18.5px" py="13.6px">



                        <Image src={logo} width={"55%"} onClick={() => navigate("/")} />


                        <Box display={["none", "none","none","none","block"]} color="blue.blue500" onClick={() => setWide(!Wide)}>
                            <FaArrowRightArrowLeft />
                        </Box>

                    </Flex>
                )
            }
            {
                Wide === false && (
                    <Box display={["none", "none","none","none","block"]} pl="35px" mt="32px" color="blue.blue500" onClick={() => setWide(!Wide)}>
                        <FaArrowRightArrowLeft />
                    </Box>
                )
            }




            <Stack spacing={"15px"} mt="32px" px="18.5px" visibility={showNav ? "visible" : "hidden"}>

                {
                    List?.filter(item => item.display === true)
                        .map((item, i) => (
                            <NavItem
                                key={i}
                                submenu={item.children}
                                Wide={Wide}
                                icon={item?.icon}
                                onClick={() => {
                                    if (item.children) {
                                        if (item.name === isOpen) {
                                            setIsOpen(null);



                                        } else {
                                            setIsOpen(item.name);

                                        }
                                    } else {
                                        nav(item.link);
                                    }
                                }}
                                isOpen={isOpen}
                                active={
                                    item.active
                                }
                                activeScreen={item.active}

                                setIsOpen={setIsOpen}

                            >
                                {Wide === true  && item.name}
                            </NavItem>
                        ))
                }



            </Stack>

        </Box>
    )
}
