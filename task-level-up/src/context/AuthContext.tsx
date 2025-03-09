import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  User
} from 'firebase/auth'
import { auth, db } from '../config/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  signup: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        // Check if user is admin
        const isZionEmail = user.email?.endsWith('@zionusa.org') || false
        setIsAdmin(isZionEmail)

        // Get or create user document
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: user.email,
            isAdmin: isZionEmail,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          })
        } else {
          // Update last login
          await setDoc(userRef, {
            lastLogin: new Date().toISOString()
          }, { merge: true })
        }
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signup = async (email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await sendEmailVerification(user)
  }

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = () => {
    return signOut(auth)
  }

  const value = {
    user,
    isAdmin,
    loading,
    signup,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthContext
