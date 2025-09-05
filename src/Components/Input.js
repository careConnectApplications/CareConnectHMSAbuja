import {
    Box,
    FormControl,
    FormHelperText,
    FormLabel,
    Input as InputBox,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    useColorModeValue,
  } from '@chakra-ui/react';
  import React, { useState } from 'react';
import { act } from 'react-dom/test-utils';
import { AiOutlineMail } from 'react-icons/ai';
  import { FaEye, FaEyeSlash } from 'react-icons/fa';
  import { useColors } from "../Utils/colors";
  
  
  export default function Input({
    id = '',
    val = false,
    label = ``,
    bColor,
    hoverBColor,
    isRequired = false,
    type= "email",
    readOnly = false,
    helper = null,
    onChange = null,
    isDisabled = false,
    size = 'lg',
    placeholder = `Enter ${label.toLowerCase()}`,
    pl = 0,
    py,
    rightIcon = null,
    w = "100%",
    borderColor,
    labelBg= null,
    leftIcon,
    color,
    iconColor,
    mb="0",
    ...rest
  }) {
    const [active, setActive] = useState(rest.value);
    // const [value, setValue] = useState(val);
  
    const [inputType, setInputType] = useState(type);
      const {
        bgColor,
        textColor, 
        inputBorderColor,
        primaryColor,
      } = useColors();
   
    return (
      <FormControl
        id={id}
        isReadOnly={readOnly}
        isDisabled={isDisabled}
        isRequired={isRequired}
        pos="relative"
      >
        <FormLabel
          pos="absolute"
          transform={`translateY(${active || val ? '-19px' : '8px'}) translateX(30px)`}
          bottom={'3'}
          zIndex="1"
          fontSize={active ? 'xs' : '12px'}
          fontWeight="400"
          color={textColor}
          bg={ active ? !labelBg && bgColor :!labelBg && bgColor}
          px="4px"
          textTransform="capitalize"
        >

          {label.charAt(0).toLowerCase() + label.slice(1)}
        </FormLabel>
  
        <InputGroup>
          <InputGroup>
          <InputLeftElement
          pointerEvents='none'
          children={<Box pos={"relative"} color={active ? primaryColor: iconColor} top="4.5px" fontSize={"20px"}>{leftIcon}</Box>}
        />
            <InputBox
              // borderColor={Colors.red}
              onChange={onChange}
              {...rest}
              placeholder={active || !label ? placeholder : ''}
              type={inputType}
              focusBorderColor={primaryColor}
              _focus={{ borderColor: primaryColor }}
              size={size}
              py={py}
              color={textColor}
              _autofill={{bgColor: "transparent !important"}} 
              _placeholder={{color: textColor}}
              fontWeight={'400'}
              fontSize="16px"
              fontFamily={"body"}
              _hover={{borderColor: primaryColor}}
              borderColor = {bColor ? bColor : inputBorderColor}
              rounded="8px" 
              borderWidth="1px"
              bg="transparent"
              w={w}
              onFocus={() => setActive(true)}
              onBlur={() => {
                if (!rest.value) {
                  setActive(false);
                }
              }}
              height="45px"
            />
            {rightIcon && <InputRightElement children={rightIcon} />}
          </InputGroup>
          {type === 'password' && (
            <InputRightElement

              children={ <Box pos={"relative"} color={active ? primaryColor: iconColor} top="3.3px"> {inputType  === "password" ? <FaEyeSlash/>:  <FaEye/>} </Box> }
              cursor={'pointer'}
              onClick={() => {
                if (inputType === 'password') {
                  setInputType('text');
                } else {
                  setInputType('password');
                }
              }}
            />
          )}
        </InputGroup>
        {helper && (
          <FormHelperText pos={'absolute'} p={1} m="0" fontSize={'10px'}>
            {helper}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
