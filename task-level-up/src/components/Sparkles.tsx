import { useState, useEffect } from 'react'
import { Box, keyframes } from '@chakra-ui/react'
import styled from '@emotion/styled'

const generateSparkle = (color: string) => {
  const sparkle = {
    id: String(Math.random()),
    createdAt: Date.now(),
    color,
    size: Math.random() * 10 + 10,
    style: {
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      zIndex: 2,
    },
  }
  return sparkle
}

const DEFAULT_COLOR = '#FFC107'

const SparkleWrapper = styled(Box)`
  position: absolute;
  display: block;
  pointer-events: none;
`

const Sparkle = ({ size, color, style }: any) => {
  const sparkleAnimation = keyframes`
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    50% {
      transform: scale(1) rotate(180deg);
      opacity: 1;
    }
    100% {
      transform: scale(0) rotate(360deg);
      opacity: 0;
    }
  `

  return (
    <SparkleWrapper
      style={style}
      animation={`${sparkleAnimation} 1s linear`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
          fill={color}
        />
      </svg>
    </SparkleWrapper>
  )
}

const SparklesWrapper = styled(Box)`
  position: relative;
  display: inline-block;
`

interface SparklesProps {
  children: React.ReactNode
  color?: string
}

const Sparkles = ({
  color = DEFAULT_COLOR,
  children,
  ...props
}: SparklesProps) => {
  const [sparkles, setSparkles] = useState(() => {
    return Array.from({ length: 3 }).map(() => generateSparkle(color))
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const sparkle = generateSparkle(color)
      const nextSparkles = sparkles.filter(sp => {
        const delta = now - sp.createdAt
        return delta < 750
      })
      nextSparkles.push(sparkle)
      setSparkles(nextSparkles)
    }, 250)

    return () => clearInterval(interval)
  }, [color, sparkles])

  return (
    <SparklesWrapper {...props}>
      {sparkles.map(sparkle => (
        <Sparkle
          key={sparkle.id}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
      <Box position="relative" zIndex={1} display="inline-block">
        {children}
      </Box>
    </SparklesWrapper>
  )
}

export default Sparkles
