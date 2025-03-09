import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  VStack,
  HStack,
  Heading,
  Input,
  useToast,
} from '@chakra-ui/react'
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  deleteDoc, 
  setDoc, 
  query, 
  where 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../context/AuthContext'

interface UserProfile {
  id: string
  email: string
  level: number
  experience: number
  lastTaskReset: string
  dailyTasks: any[]
}

interface NewTask {
  title: string
  description: string
  target?: number
  experiencePoints: number
}

const AdminDashboard = () => {
  const { logout } = useAuth()
  const toast = useToast()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    target: undefined,
    experiencePoints: 0,
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const usersRef = collection(db, 'users')
      const usersSnap = await getDocs(usersRef)
      
      const usersPromises = usersSnap.docs.map(async (userDoc) => {
        const userData = userDoc.data()
        
        // Get user profile
        const profileRef = doc(db, 'profiles', userDoc.id)
        const profileSnap = await getDoc(profileRef)
        const profileData = profileSnap.exists() ? profileSnap.data() : {
          level: 1,
          experience: 0,
          lastTaskReset: new Date().toISOString(),
          dailyTasks: []
        }
        
        return {
          id: userDoc.id,
          email: userData.email,
          level: profileData.level,
          experience: profileData.experience,
          lastTaskReset: profileData.lastTaskReset,
          dailyTasks: profileData.dailyTasks
        } as UserProfile
      })

      const usersData = await Promise.all(usersPromises)
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: 'Error fetching users',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete user document
      await deleteDoc(doc(db, 'users', userId))
      
      // Delete user profile
      await deleteDoc(doc(db, 'profiles', userId))
      
      // Delete user tasks
      const tasksRef = collection(db, 'tasks')
      const q = query(tasksRef, where('userId', '==', userId))
      const taskSnap = await getDocs(q)
      const userTasks = taskSnap.docs
      await Promise.all(userTasks.map(task => deleteDoc(doc(db, 'tasks', task.id))))
      
      toast({
        title: 'User deleted',
        status: 'success',
        duration: 3000,
      })
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: 'Error deleting user',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleAssignTask = async () => {
    if (!selectedUser) return

    try {
      const taskRef = doc(collection(db, 'tasks'))
      const task = {
        ...newTask,
        id: taskRef.id,
        userId: selectedUser.id,
        progress: 0,
        completed: false,
        createdAt: new Date().toISOString(),
      }
      await setDoc(taskRef, task)
      
      toast({
        title: 'Task assigned',
        description: `Task assigned to ${selectedUser.email}`,
        status: 'success',
        duration: 3000,
      })
      setNewTask({
        title: '',
        description: '',
        target: undefined,
        experiencePoints: 0,
      })
    } catch (error) {
      console.error('Error assigning task:', error)
      toast({
        title: 'Error assigning task',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      toast({
        title: 'Error logging out',
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Box minH="100vh" w="100vw" py={8}>
      <Box maxW="6xl">
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Heading size="lg">Admin Dashboard</Heading>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          </HStack>

          <Box p={6} borderRadius="2xl" boxShadow="xl" backdropFilter="blur(10px)" border="1px solid">
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Heading size="md">Users</Heading>
              </HStack>

              {loading ? (
                <Box textAlign="center" py={8}>
                </Box>
              ) : (
                <Box>
                  {users.map(user => (
                    <Box key={user.id}>
                      <Box>{user.email}</Box>
                      <Box>{user.level}</Box>
                      <Box>{user.experience} XP</Box>
                      <Box>{new Date(user.lastTaskReset).toLocaleDateString()}</Box>
                      <Box>
                        <HStack spacing={2}>
                          <Button variant="ghost" onClick={() => {
                            setSelectedUser(user)
                          }}>Assign task</Button>
                          <Button variant="ghost" colorScheme="red" onClick={() => handleDeleteUser(user.id)}>Delete user</Button>
                        </HStack>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </VStack>
          </Box>
        </VStack>
      </Box>

      {/* Assign Task Modal */}
      <Box>
        <Box>
          <Box>Assign Task to {selectedUser?.email}</Box>
          <Box>
            <VStack spacing={4}>
              <Box>
                <Box>Task Title</Box>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </Box>
              <Box>
                <Box>Description</Box>
                <Input
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                />
              </Box>
              <Box>
                <Box>Target (Optional)</Box>
                <Input
                  value={newTask.target}
                  onChange={(e) => setNewTask({ ...newTask, target: Number(e.target.value) })}
                  placeholder="Enter target count"
                />
              </Box>
              <Box>
                <Box>Experience Points</Box>
                <Input
                  value={newTask.experiencePoints}
                  onChange={(e) => setNewTask({ ...newTask, experiencePoints: Number(e.target.value) })}
                  placeholder="Enter XP reward"
                />
              </Box>
            </VStack>
          </Box>

          <Box>
            <Button variant="ghost" mr={3}>Cancel</Button>
            <Button colorScheme="brand" onClick={handleAssignTask}>Assign Task</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AdminDashboard
