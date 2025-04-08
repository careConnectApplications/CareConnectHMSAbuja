import { HStack, Text } from '@chakra-ui/react'
import React from 'react'

export default function Footer() {
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
    <Text color="#8A8D8E" fontSize="16px" fontWeight="500">
    2025, Care Connect, All Right Reserved
    </Text>

  </HStack>
  )
}
