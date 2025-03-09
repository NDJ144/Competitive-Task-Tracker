import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Heading,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react'
import { FiAward } from 'react-icons/fi'
import { GiPodium } from 'react-icons/gi'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

interface LeaderboardUser {
  id: string
  email: string
  username?: string
  level: number
  experience: number
}

const Leaderboard = ({ users }: { users: LeaderboardUser[] }) => {
  // Sort users by level first, then by experience
  const sortedUsers = [...users].sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level
    return b.experience - a.experience
  })

  const topThree = sortedUsers.slice(0, 3)
  const rest = sortedUsers.slice(3)

  const getDisplayName = (user: LeaderboardUser) => {
    if (user.username) return user.username
    if (!user.email) return 'Anonymous'
    return user.email.split('@')[0]
  }

  const getMedalColor = (position: number) => {
    switch (position) {
      case 0: return 'yellow.400' // Gold
      case 1: return 'gray.400' // Silver
      case 2: return 'orange.400' // Bronze
      default: return 'gray.400'
    }
  }

  const getPodiumHeight = (position: number) => {
    switch (position) {
      case 0: return '120px' // First place
      case 1: return '90px' // Second place
      case 2: return '60px' // Third place
      default: return '60px'
    }
  }

  return (
    <Box
      bg="rgba(255, 255, 255, 0.05)"
      p={6}
      borderRadius="2xl"
      boxShadow="xl"
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor="whiteAlpha.200"
    >
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="md" color="white">Leaderboard</Heading>
          <Icon as={GiPodium} color="brand.200" boxSize={6} />
        </HStack>

        {/* Podium */}
        <Box position="relative" h="250px" mb={8}>
          {/* Second Place - Left */}
          {topThree[1] && (
            <MotionBox
              position="absolute"
              left="25%"
              bottom="20px"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <VStack spacing={1}>
                <Icon as={FiAward} color={getMedalColor(1)} boxSize={8} mb={-1} />
                <Text color="white" fontWeight="bold" mb={-1}>
                  {getDisplayName(topThree[1])}
                </Text>
                <VStack spacing={0}>
                  <Text color="whiteAlpha.700" fontSize="sm">
                    Level {topThree[1].level}
                  </Text>
                  <Text color="whiteAlpha.600" fontSize="xs">
                    {topThree[1].experience.toLocaleString()} XP
                  </Text>
                </VStack>
                <Box
                  bg="rgba(255, 255, 255, 0.1)"
                  w="100px"
                  h={getPodiumHeight(1)}
                  borderTopRadius="md"
                />
              </VStack>
            </MotionBox>
          )}

          {/* First Place - Center */}
          {topThree[0] && (
            <MotionBox
              position="absolute"
              left="45%"
              transform="translateX(-50%)"
              bottom="20px"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0 }}
              zIndex={2}
            >
              <VStack spacing={1}>
                <Icon as={FiAward} color={getMedalColor(0)} boxSize={10} mb={-1} />
                <Text color="white" fontWeight="bold" fontSize="lg" mb={-1}>
                  {getDisplayName(topThree[0])}
                </Text>
                <VStack spacing={0}>
                  <Text color="whiteAlpha.700">
                    Level {topThree[0].level}
                  </Text>
                  <Text color="whiteAlpha.600" fontSize="sm">
                    {topThree[0].experience.toLocaleString()} XP
                  </Text>
                </VStack>
                <Box
                  bg="rgba(255, 255, 255, 0.1)"
                  w="120px"
                  h={getPodiumHeight(0)}
                  borderTopRadius="md"
                />
              </VStack>
            </MotionBox>
          )}

          {/* Third Place - Right */}
          {topThree[2] && (
            <MotionBox
              position="absolute"
              right="25%"
              bottom="20px"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <VStack spacing={1}>
                <Icon as={FiAward} color={getMedalColor(2)} boxSize={6} mb={-1} />
                <Text color="white" fontWeight="bold" mb={-1}>
                  {getDisplayName(topThree[2])}
                </Text>
                <VStack spacing={0}>
                  <Text color="whiteAlpha.700" fontSize="sm">
                    Level {topThree[2].level}
                  </Text>
                  <Text color="whiteAlpha.600" fontSize="xs">
                    {topThree[2].experience.toLocaleString()} XP
                  </Text>
                </VStack>
                <Box
                  bg="rgba(255, 255, 255, 0.1)"
                  w="100px"
                  h={getPodiumHeight(2)}
                  borderTopRadius="md"
                />
              </VStack>
            </MotionBox>
          )}
        </Box>

        {/* Remaining Users List */}
        {rest.length > 0 && (
          <Table variant="simple" color="white">
            <Thead>
              <Tr>
                <Th color="whiteAlpha.600" w="10">Rank</Th>
                <Th color="whiteAlpha.600">User</Th>
                <Th color="whiteAlpha.600" isNumeric>Level</Th>
                <Th color="whiteAlpha.600" isNumeric>XP</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rest.map((user, index) => (
                <Tr key={user.id}>
                  <Td color="whiteAlpha.600">{index + 4}</Td>
                  <Td>{getDisplayName(user)}</Td>
                  <Td isNumeric>{user.level}</Td>
                  <Td isNumeric>{user.experience}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
    </Box>
  )
}

export default Leaderboard
