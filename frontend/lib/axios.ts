import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Attach token from cookie to every request automatically
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1]

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      document.cookie = 'auth_token=; Max-Age=0; path=/'
      document.cookie = 'user=; Max-Age=0; path=/'
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api