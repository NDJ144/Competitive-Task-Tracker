import { Box, Progress, Text } from '@chakra-ui/react'

interface ProgressBarProps {
  experience: number
  max: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ experience, max }) => {
  const progress = (experience / max) * 100

  return (
    <Box w="100%">
      <Progress
        value={progress}
        size="sm"
        colorScheme="brand"
        bg="whiteAlpha.100"
        borderRadius="full"
        hasStripe
        isAnimated
      />
      <Text mt={2} fontSize="sm" color="whiteAlpha.600" textAlign="right">
        {experience}/{max} XP
      </Text>
    </Box>
  )
}

export default ProgressBar
