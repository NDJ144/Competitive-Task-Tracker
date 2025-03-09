import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Container,
  Heading,
  InputGroup,
  InputLeftElement,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
} from '@chakra-ui/react'
import { FiMail, FiLock } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { Link as RouterLink } from 'react-router-dom'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const { signup } = useAuth()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signup(email, password)
      setIsEmailSent(true)
      toast({
        title: 'Verification email sent',
        description: 'Please check your email to confirm your account',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create account',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <Box 
        minH="100vh" 
        w="100vw" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <Container maxW="md">
          <Box
            bg="rgba(255, 255, 255, 0.05)"
            p={8}
            borderRadius="2xl"
            boxShadow="xl"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <VStack spacing={6}>
              <Alert
                status="success"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                borderRadius="lg"
                bg="whiteAlpha.200"
                color="white"
              >
                <AlertIcon boxSize="40px" mr={0} color="green.300" />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  Verification Email Sent!
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  We've sent a verification link to {email}. Please check your email and click the link to complete your registration.
                </AlertDescription>
              </Alert>
              <Text color="whiteAlpha.600" textAlign="center">
                Already verified?{' '}
                <Link as={RouterLink} to="/login" color="brand.200">
                  Sign in
                </Link>
              </Text>
            </VStack>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box 
      minH="100vh" 
      w="100vw" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
    >
      <Container maxW="md">
        <Box
          bg="rgba(255, 255, 255, 0.05)"
          p={8}
          borderRadius="2xl"
          boxShadow="xl"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={8}>
              <VStack spacing={3} align="center" w="full">
                <Heading 
                  size="xl" 
                  bgGradient="linear(to-r, brand.200, brand.400)" 
                  bgClip="text"
                >
                  Create Account
                </Heading>
                <Text color="whiteAlpha.600">
                  Begin your adventure today
                </Text>
              </VStack>
              
              <VStack spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.900">Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiMail} color="whiteAlpha.500" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      size="lg"
                      bg="whiteAlpha.50"
                      borderColor="whiteAlpha.200"
                      color="white"
                      _placeholder={{ color: 'whiteAlpha.400' }}
                      _hover={{ borderColor: 'whiteAlpha.400' }}
                      _focus={{ borderColor: 'brand.200', boxShadow: 'none' }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.900">Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiLock} color="whiteAlpha.500" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      size="lg"
                      bg="whiteAlpha.50"
                      borderColor="whiteAlpha.200"
                      color="white"
                      _placeholder={{ color: 'whiteAlpha.400' }}
                      _hover={{ borderColor: 'whiteAlpha.400' }}
                      _focus={{ borderColor: 'brand.200', boxShadow: 'none' }}
                    />
                  </InputGroup>
                </FormControl>
              </VStack>

              <VStack spacing={4} w="full">
                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  colorScheme="brand"
                  isLoading={isLoading}
                  loadingText="Creating account..."
                >
                  Sign Up
                </Button>
                
                <Text color="whiteAlpha.600">
                  Already have an account?{' '}
                  <Link as={RouterLink} to="/login" color="brand.200">
                    Sign in
                  </Link>
                </Text>
              </VStack>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  )
}

export default SignUp
