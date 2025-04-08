import { HStack, Text } from '@chakra-ui/react'
import React from 'react'

export default function Footer() {

  let currentDate = new Date().getFullYear()

  return (
    <HStack
    flex={1}
    justifyContent="center"
    gap="40px"
    alignItems="center"
    mt="4rem"
    flexWrap="wrap"
    cursor={"pointer"}
  >
    <Text color="#fff" fontSize="sm" fontWeight="medium">
      © {currentDate} Care Connect Inc.
    </Text>

    <HStack color="#fff" flex="" flexDir="row">
      <Text fontSize="sm">Privacy policy</Text>
      <Text >|</Text>
      <Text fontSize="sm">Terms & Conditions</Text>
    </HStack>
  </HStack>
  )
}
