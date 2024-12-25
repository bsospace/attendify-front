import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from 'react'
import { apiClient } from '@/services/api'
import { API_ENDPOINTS } from '@/lib/constants'
import { envConfig } from '@/config/envConfig'

export interface User {
  id: string
  username: string
  first_name: string
  last_name: string
  email: string
  avatar: string
  roles: string[]
  premissions: string[]
}

interface AuthContextProps {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  refreshToken: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  getProfile: () => Promise<void>
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  oauthLogin: (provider: 'discord' | 'github' | 'google') => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await apiClient.post(
        `${envConfig.apiUrl}${API_ENDPOINTS.AUTH.LOGIN}`,
        {
          email,
          password
        }
      )

      const data = response.data as {
        user: User
        credentials: {
          accessToken: string
          refreshToken: string
        }
      }

      setUser({
        id: data.user.id,
        username: data.user.username,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        email: data.user.email,
        avatar: '',
        roles: data.user.roles,
        premissions: data.user.premissions
      })
      setIsAuthenticated(true)
      setAccessToken(data.credentials.accessToken)
      setRefreshToken(data.credentials.refreshToken)

      localStorage.setItem('accessToken', data.credentials.accessToken)
      localStorage.setItem('refreshToken', data.credentials.refreshToken)

      console.log('User logged in:', user)
    } finally {
      setIsLoading(false)
    }
  }

  const oauthLogin = async (provider: 'discord' | 'github' | 'google') => {
    const service = 'attendify'
    window.location.href = `${envConfig.apiOpenIdConnectUrl}/auth/${provider}?service=${service}&redirect=${envConfig.appUrlCallback}`
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      localStorage.clear()
      window.location.reload()
    } finally {
      setIsLoading(false)
    }
  }

  const getProfile = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get(
        `${envConfig.apiUrl}${API_ENDPOINTS.AUTH.ME}`
      )
      const data = response.data as User
      setUser({
        id: data.id,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        avatar: '',
        roles: data.roles,
        premissions: data.premissions
      })
      setIsAuthenticated(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  const hasRole = (role: string) => {
    return user?.roles.includes(role) ?? false
  }

  const hasPermission = (permission: string) => {
    return user?.premissions.includes(permission) ?? false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        accessToken,
        refreshToken,
        login,
        logout,
        getProfile,
        hasRole,
        hasPermission,
        oauthLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
