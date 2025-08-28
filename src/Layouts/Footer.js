import { HStack, Text } from '@chakra-ui/react'
import React from 'react'
import { useColors } from '../Utils/colors'

export default function Footer() {
  const { lightTextColor } = useColors();
  return (
    <HStack
    flex={1}
    bottom="0"
    width="100%"
    justifyContent="center"
    gap="40px"
    alignItems="center"
    my="15px"
    flexWrap="wrap"
    cursor={"pointer"}
  >
    <Text color={lightTextColor} fontSize="16px" fontWeight="500">
    2025, Care Connect, All Right Reserved
    </Text>

  </HStack>
  )
}
