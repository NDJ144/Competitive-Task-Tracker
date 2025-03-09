import { useState } from 'react';
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
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      // Check if admin user
      if (email.endsWith('@zionusa.org')) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" py={20}>
      <Container maxW="lg">
        <VStack spacing={8}>
          <Heading
            size="xl"
            bgGradient="linear(to-r, brand.200, brand.400)"
            bgClip="text"
          >
            Welcome Back
          </Heading>

          <Box
            w="100%"
            p={8}
            borderRadius="2xl"
            bg="rgba(255, 255, 255, 0.05)"
            boxShadow="xl"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  w="100%"
                  isLoading={loading}
                >
                  Login
                </Button>

                <Text color="whiteAlpha.700">
                  Don't have an account?{' '}
                  <Link
                    as={RouterLink}
                    to="/signup"
                    color="brand.300"
                    _hover={{ color: 'brand.200' }}
                  >
                    Sign up
                  </Link>
                </Text>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;
