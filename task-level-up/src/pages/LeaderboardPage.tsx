import { Box, Container, Heading, VStack, Button } from '@chakra-ui/react'
import { FiArrowLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Leaderboard from '../components/Leaderboard'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useEffect, useState } from 'react'
import { UserProfile } from '../types'
import { useToast } from '@chakra-ui/react'

const LeaderboardPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([])
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'profiles'))
        const usersData = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            email: data.email,
            username: data.username,
            level: data.level || 1,
            experience: data.experience || 0,
            lastTaskReset: data.lastTaskReset || new Date().toISOString(),
            dailyTasks: data.dailyTasks || []
          } as UserProfile
        })
        setUsers(usersData)
      } catch (error) {
        console.error('Error fetching users:', error)
        toast({
          title: 'Error fetching leaderboard',
          status: 'error',
          duration: 3000,
        })
      }
    }

    fetchUsers()
  }, [toast])

  return (
    <Box minH="100vh" w="100vw" py={8}>
      <Container maxW="6xl">
        <VStack spacing={8} align="stretch">
          <Box position="relative" h="40px">
            <Button
              position="absolute"
              left={0}
              leftIcon={<FiArrowLeft />}
              onClick={() => navigate('/')}
              variant="ghost"
              colorScheme="brand"
              bg="rgba(255, 255, 255, 0.05)"
              color="white"
              _hover={{ bg: 'whiteAlpha.200', color: 'brand.300' }}
              _active={{ bg: 'whiteAlpha.300' }}
            >
              Back to Dashboard
            </Button>
            <Heading 
              position="absolute"
              left="50%"
              transform="translateX(-50%)"
              textAlign="center" 
              color="white" 
              size="xl"
            >
              Leaderboard
            </Heading>
          </Box>
          <Leaderboard users={users} />
        </VStack>
      </Container>
    </Box>
  )
}

export default LeaderboardPage
