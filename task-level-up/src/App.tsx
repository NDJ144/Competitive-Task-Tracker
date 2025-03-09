import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/AdminDashboard'
import LeaderboardPage from './pages/LeaderboardPage'
import './styles/animations.css'

// Custom theme
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white',
      },
    },
  },
  colors: {
    brand: {
      50: '#f0e4ff',
      100: '#cbb2ff',
      200: '#a480ff',
      300: '#7b4dff',
      400: '#541bff',
      500: '#3b01e6',
      600: '#2d00b4',
      700: '#200082',
      800: '#130052',
      900: '#070022',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
})

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <Box>Loading...</Box>
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth()
  
  if (loading) {
    return <Box>Loading...</Box>
  }
  
  return user && isAdmin ? <>{children}</> : <Navigate to="/" />
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Box 
            minH="100vh" 
            w="100vw" 
            margin="0" 
            padding="0"
            overflow="hidden"
            bgGradient="linear(to-br, gray.900, brand.900)"
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <RequireAuth>
                    <LeaderboardPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
