import {
  Box,
  Collapse,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function NavItem(props) {
  const {
    icon,
    children,
    submenu,
    isOpen,
    Wide,
    setIsOpen,
    active,
    activeScreen,
    ...rest
  } = props;
  const [hover, setHover] = useState(active);
  const [OpenNav, setOpenNav] = useState(false);


  const nav = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (submenu && active) {
        setIsOpen(children);
      }else if(OpenNav){
        setIsOpen(children);

      }
    }, 500);
  }, [submenu, isOpen]);

  return (
    <Box
      px="2"
      pl="4"
      py="2"
      cursor="pointer"
      fontFamily="body"
      color={
        isOpen === children || hover || activeScreen || OpenNav
          ? "#fff"
          : "#333"
      }
      bg={
        isOpen === children || hover || activeScreen || OpenNav
          ? "blue.blue500"
          : "transparent"
      }
      _hover={{
        bg: "blue.blue500",
        color: "#fff",
      }}
      role=""
      fontWeight={"400"}
      textTransform={"capitalize"}
      fontSize={"11px"}
      rounded="8px"
      pos={"relative"}
      onMouseEnter={() => {
        setHover(true);
      
      }}
      onMouseLeave={() => {
        if (!active) {
          setHover(false);
        
        }
      }}
      {...rest}
    >
      <Flex align="center">
        {icon && (
          <Box
            fontSize={"18px"}
            color={
              isOpen === children || hover || activeScreen || OpenNav
                ? "#fff"
                : "#333"
            }
            mr="5px"
          >
            {icon}
          </Box>
        )}

        {children}  

        {(submenu && Wide )  && (
          <Icon
            transition={"0.3s ease"}
            as={FaChevronRight}
            size={20}
            ml="auto"
            transform={isOpen === children && "rotate(90deg)"}
          />
        )}
      </Flex>
      {submenu && (
        <Collapse reverse={true} in={isOpen === children    }>
          <Stack spacing={"4px"} py="2">
            {submenu
              .filter((item) => item.display === true)
              ?.map((item, index) => (
                <NavItem
                  py="3px"
                  key={index}
                  textTransform="capitalize"
                  onClick={() => {
                    setIsOpen(children);
                    setOpenNav(true)
                    nav(item.link);
                  }}
                  pl="28px"
                  _hover={{ color: "blue.blue500", bg: "#fff" }}  
                  color={item.active ? "blue.blue500" : "#fff"}
                  bg={item.active ? "white" : "transparent"}
                  hasCurve={false}
                >
                  <Text> {item.name}</Text>
                </NavItem>
              ))}
          </Stack>
        </Collapse>
      )}
    </Box>
  );
}
