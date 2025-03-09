import { 
  VStack, 
  HStack, 
  Text, 
  IconButton, 
  Icon,
  Tooltip,
  Box,
  Progress,
} from '@chakra-ui/react'
import { FiCheck, FiPlus, FiMinus } from 'react-icons/fi'

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  target?: number
  progress?: number
  experiencePoints: number
}

interface TaskListProps {
  tasks: Task[]
  onTaskComplete: (taskId: string) => void
  onTaskProgress?: (taskId: string, progress: number) => void
}

const TaskList = ({ tasks, onTaskComplete, onTaskProgress }: TaskListProps) => {
  const handleProgressChange = (taskId: string, delta: number) => {
    if (!onTaskProgress) return
    const task = tasks.find(t => t.id === taskId)
    if (!task || !task.target) return
    const newProgress = Math.max(0, Math.min(task.target, (task.progress || 0) + delta))
    onTaskProgress(taskId, newProgress)
  }

  return (
    <VStack spacing={4} align="stretch">
      {tasks.map(task => (
        <Box
          key={task.id}
          bg="whiteAlpha.50"
          p={4}
          borderRadius="lg"
          border="1px solid"
          borderColor={task.completed ? "brand.200" : "whiteAlpha.100"}
          transition="all 0.2s"
          _hover={{
            borderColor: "brand.200",
          }}
        >
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text color="white" fontWeight="medium">
                {task.title}
              </Text>
              {task.description && (
                <Text color="whiteAlpha.600" fontSize="sm">
                  {task.description}
                </Text>
              )}
              {task.target && task.target > 1 && (
                <Box w="full">
                  <HStack spacing={2} mb={2}>
                    <IconButton
                      aria-label="Decrease progress"
                      icon={<Icon as={FiMinus} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="whiteAlpha"
                      onClick={() => handleProgressChange(task.id, -1)}
                      isDisabled={task.completed || !task.progress}
                    />
                    <Text color="whiteAlpha.900">
                      {task.progress || 0}/{task.target}
                    </Text>
                    <IconButton
                      aria-label="Increase progress"
                      icon={<Icon as={FiPlus} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="whiteAlpha"
                      onClick={() => handleProgressChange(task.id, 1)}
                      isDisabled={task.completed || task.progress === task.target}
                    />
                  </HStack>
                  <Progress
                    value={(task.progress || 0) / task.target * 100}
                    size="xs"
                    colorScheme="brand"
                    bg="whiteAlpha.100"
                    borderRadius="full"
                  />
                </Box>
              )}
            </VStack>
            <Tooltip 
              label={task.completed ? 'Completed' : `Complete (+${task.experiencePoints} XP)`}
              placement="top"
            >
              <IconButton
                aria-label="Complete task"
                icon={<Icon as={FiCheck} />}
                colorScheme={task.completed ? "brand" : "whiteAlpha"}
                variant={task.completed ? "solid" : "ghost"}
                isDisabled={task.completed || (!task.target || task.target <= 1) || (task.target > 1 && task.progress !== task.target)}
                onClick={() => onTaskComplete(task.id)}
              />
            </Tooltip>
          </HStack>
        </Box>
      ))}
    </VStack>
  )
}

export default TaskList
