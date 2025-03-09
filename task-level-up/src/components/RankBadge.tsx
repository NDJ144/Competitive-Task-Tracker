import { Box, Text, Icon, HStack, keyframes } from '@chakra-ui/react'
import { FaCrown, FaMedal, FaGem, FaShieldAlt, FaDragon } from 'react-icons/fa'
import { GiLaurelCrown, GiSteelClaws } from 'react-icons/gi'

const glowAnimation = keyframes`
  0% { filter: drop-shadow(0 0 2px var(--chakra-colors-brand-200)); }
  50% { filter: drop-shadow(0 0 10px var(--chakra-colors-brand-200)); }
  100% { filter: drop-shadow(0 0 2px var(--chakra-colors-brand-200)); }
`

interface RankBadgeProps {
  level: number
}

interface RankInfo {
  name: string
  color: string
  icon: any
  borderColor: string
  description: string
}

const getRankInfo = (level: number): RankInfo => {
  const ranks: RankInfo[] = [
    {
      name: 'Iron',
      color: '#71797E',
      icon: GiSteelClaws,
      borderColor: '#43464B',
      description: 'Starting your journey'
    },
    {
      name: 'Bronze',
      color: '#CD7F32',
      icon: FaMedal,
      borderColor: '#8B4513',
      description: 'Rising through the ranks'
    },
    {
      name: 'Silver',
      color: '#C0C0C0',
      icon: FaMedal,
      borderColor: '#808080',
      description: 'Proven challenger'
    },
    {
      name: 'Gold',
      color: '#FFD700',
      icon: FaCrown,
      borderColor: '#DAA520',
      description: 'Mastering the basics'
    },
    {
      name: 'Platinum',
      color: '#E5E4E2',
      icon: FaGem,
      borderColor: '#A0B2C6',
      description: 'Elite performer'
    },
    {
      name: 'Diamond',
      color: '#B9F2FF',
      icon: FaGem,
      borderColor: '#89CFF0',
      description: 'Outstanding achiever'
    },
    {
      name: 'Master',
      color: '#FF4D4D',
      icon: FaShieldAlt,
      borderColor: '#8B0000',
      description: 'True master of tasks'
    },
    {
      name: 'Grandmaster',
      color: '#9D4EDD',
      icon: GiLaurelCrown,
      borderColor: '#6A0DAD',
      description: 'Legendary status'
    },
    {
      name: 'Champion',
      color: '#FFD700',
      icon: FaDragon,
      borderColor: '#FF4500',
      description: 'Ultimate champion'
    }
  ]

  // For levels 1-5, return Iron rank
  if (level <= 5) {
    return ranks[0]
  }

  // For levels 6+, calculate rank based on level ranges
  const rankIndex = Math.min(Math.floor((level - 6) / 5) + 1, ranks.length - 1)
  return ranks[rankIndex]
}

const RankBadge: React.FC<RankBadgeProps> = ({ level }) => {
  const rankInfo = getRankInfo(level)
  const animation = `${glowAnimation} 2s infinite`

  return (
    <Box
      p={4}
      borderRadius="xl"
      bg="rgba(0, 0, 0, 0.3)"
      borderWidth="2px"
      borderColor={rankInfo.borderColor}
      backdropFilter="blur(10px)"
      transition="all 0.3s"
      _hover={{
        transform: 'scale(1.05)',
        boxShadow: `0 0 20px ${rankInfo.color}`,
      }}
    >
      <HStack spacing={3} align="center">
        <Icon
          as={rankInfo.icon}
          boxSize={8}
          color={rankInfo.color}
          animation={animation}
        />
        <Box>
          <Text
            fontSize="lg"
            fontWeight="bold"
            bgGradient={`linear(to-r, ${rankInfo.color}, ${rankInfo.borderColor})`}
            bgClip="text"
          >
            {rankInfo.name} {level <= 5 ? `(Level ${level})` : ''}
          </Text>
          <Text fontSize="sm" color="whiteAlpha.600">
            {rankInfo.description}
          </Text>
        </Box>
      </HStack>
    </Box>
  )
}

export default RankBadge
