import { useEffect, useState } from 'react'
import { 
  Box, 
  VStack, 
  useToast, 
  Heading,
  Text,
  Button,
  HStack,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Container,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Divider
} from '@chakra-ui/react'
import { FiAward, FiLogOut, FiUser } from 'react-icons/fi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import TaskList from './TaskList'
import Character from './Character'
import ProgressBar from './ProgressBar'
import RankBadge from './RankBadge'
import { collection, query, where, getDocs, doc, updateDoc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import '@dotlottie/player-component'
import '../styles/animations.css'

interface UserProfile {
  id: string
  email: string
  username?: string
  level: number
  experience: number
  lastTaskReset: string
  createdAt: string
}

interface Task {
  id: string
  userId: string
  title: string
  description: string
  target: number
  progress: number
  completed: boolean
  experiencePoints: number
  createdAt: string
}

const DAILY_TASK_EXP = 25
const EXPERIENCE_PER_LEVEL = 100

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [username, setUsername] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      // Get or create user profile
      const profileRef = doc(db, 'profiles', user.uid)
      const profileSnap = await getDoc(profileRef)

      if (!profileSnap.exists()) {
        const newProfile: UserProfile = {
          id: user.uid,
          email: user.email!,
          level: 1,
          experience: 0,
          lastTaskReset: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
        await setDoc(profileRef, newProfile)
        setProfile(newProfile)
        // Open username modal for new users
        onOpen()
      } else {
        const profileData = profileSnap.data() as UserProfile
        setProfile(profileData)
        // If no username is set, open the modal
        if (!profileData.username) {
          onOpen()
        }
      }

      // Fetch tasks
      const tasksRef = collection(db, 'tasks')
      const q = query(tasksRef, where('userId', '==', user.uid))
      const taskSnap = await getDocs(q)
      const tasksData = taskSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Task)
      setTasks(tasksData)
    }

    fetchUserData()
  }, [user])

  const handleSetUsername = async () => {
    if (!user || !username.trim()) return

    try {
      const profileRef = doc(db, 'profiles', user.uid)
      await updateDoc(profileRef, {
        username: username.trim()
      })
      
      setProfile(prev => prev ? { ...prev, username: username.trim() } : null)
      
      toast({
        title: 'Username set!',
        status: 'success',
        duration: 3000,
      })
      
      onClose()
    } catch (error) {
      toast({
        title: 'Error setting username',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      toast({
        title: 'Error logging out',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleTaskComplete = async (taskId: string) => {
    if (!user || !profile) return

    // Update task in Firestore
    const taskRef = doc(db, 'tasks', taskId)
    await updateDoc(taskRef, {
      completed: true,
      updatedAt: serverTimestamp()
    })

    // Update task locally
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    ))

    // Update profile
    const newExperience = profile.experience + DAILY_TASK_EXP
    const newLevel = Math.floor(newExperience / EXPERIENCE_PER_LEVEL) + 1

    // Update profile in Firestore
    const profileRef = doc(db, 'profiles', user.uid)
    await updateDoc(profileRef, {
      experience: newExperience,
      level: newLevel,
      updatedAt: serverTimestamp()
    })

    // Update profile locally
    setProfile(prev => prev ? {
      ...prev,
      experience: newExperience,
      level: newLevel,
    } : null)

    toast({
      title: 'Level Up!',
      description: `Congratulations! You've reached level ${newLevel}!`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  const handleTaskProgress = async (taskId: string, progress: number) => {
    if (!user || !profile) return

    // Update task in Firestore
    const taskRef = doc(db, 'tasks', taskId)
    await updateDoc(taskRef, {
      progress,
      updatedAt: serverTimestamp()
    })

    // Update task locally
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, progress } : task
    ))
  }

  return (
    <Box minH="100vh" w="100vw" py={8}>
      <Container maxW="6xl">
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between" align="center">
            <Box>
              <Text fontSize="sm" color="whiteAlpha.600">Welcome back</Text>
              <Heading size="lg" color="white">{profile?.username || 'Adventurer'}</Heading>
            </Box>

            <HStack spacing={4}>
              <Button
                as={RouterLink}
                to="/leaderboard"
                colorScheme="brand"
                variant="ghost"
                leftIcon={<FiAward />}
                color="white"
                _hover={{ bg: 'whiteAlpha.200', color: 'brand.300' }}
              >
                Leaderboard
              </Button>
              
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<FiUser />}
                  variant="ghost"
                  colorScheme="brand"
                  bg="rgba(255, 255, 255, 0.05)"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200', color: 'brand.300' }}
                  _active={{ bg: 'whiteAlpha.300' }}
                >
                  {profile?.username || user?.email?.split('@')[0] || 'Menu'}
                </MenuButton>
                <MenuList 
                  bg="#1a1b26"
                  borderColor="whiteAlpha.200"
                  boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.36)"
                  border="1px solid"
                  p={2}
                  minW="200px"
                >
                  <MenuItem
                    onClick={onOpen}
                    bg="transparent"
                    _hover={{ bg: 'whiteAlpha.200', color: 'brand.300' }}
                    _focus={{ bg: 'whiteAlpha.200', color: 'brand.300' }}
                    _active={{ bg: 'whiteAlpha.300' }}
                    color="white"
                    borderRadius="md"
                    mb={1}
                    fontSize="sm"
                    icon={<Icon as={FiUser} boxSize={4} />}
                  >
                    Set Username
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    bg="transparent"
                    icon={<Icon as={FiLogOut} boxSize={4} />}
                    _hover={{ bg: 'whiteAlpha.200', color: 'brand.300' }}
                    _focus={{ bg: 'whiteAlpha.200', color: 'brand.300' }}
                    _active={{ bg: 'whiteAlpha.300' }}
                    color="white"
                    borderRadius="md"
                    fontSize="sm"
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </HStack>

          <Grid
            templateColumns={{ base: "1fr", md: "350px 1fr" }}
            gap={8}
          >
            <GridItem>
              <Box
                bg="rgba(255, 255, 255, 0.05)"
                p={6}
                borderRadius="2xl"
                boxShadow="xl"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                position="sticky"
                top="8"
              >
                <VStack spacing={6} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="md" color="white">Character Stats</Heading>
                  </HStack>
                  <Box flex="1" display="flex" alignItems="center" justifyContent="center">
                    <Character level={profile?.level || 1} />
                  </Box>
                  <RankBadge level={profile?.level || 1} />
                  <Divider my={4} borderColor="whiteAlpha.200" />
                  <HStack justify="space-between" p={4} bg="whiteAlpha.50" borderRadius="xl">
                    <VStack align="start" spacing={0}>
                      <Text color="whiteAlpha.600" fontSize="sm">Current Level</Text>
                      <Text color="white" fontSize="xl" fontWeight="bold">{profile?.level || 1}</Text>
                    </VStack>
                    <Icon as={FiAward} color="brand.300" boxSize={6} />
                  </HStack>
                  <Box mt={4}>
                    <Text color="whiteAlpha.600" mb={2}>Level Progress</Text>
                    <ProgressBar 
                      max={EXPERIENCE_PER_LEVEL}
                      experience={(profile?.experience || 0) % EXPERIENCE_PER_LEVEL} 
                    />
                  </Box>
                </VStack>
              </Box>
            </GridItem>

            <GridItem>
              <TaskList
                tasks={tasks}
                onTaskComplete={handleTaskComplete}
                onTaskProgress={handleTaskProgress}
              />
            </GridItem>
          </Grid>
        </VStack>
      </Container>

      {/* Username Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        closeOnOverlayClick={!!profile?.username} // Only allow closing if username is already set
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="gray.900" color="white">
          <ModalHeader>
            {profile?.username ? 'Change Username' : 'Set Your Username'}
          </ModalHeader>
          {profile?.username && <ModalCloseButton />}
          <ModalBody>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {profile?.username && (
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button 
              colorScheme="brand" 
              onClick={handleSetUsername}
              isDisabled={!username.trim()}
            >
              {profile?.username ? 'Update Username' : 'Set Username'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Dashboard
