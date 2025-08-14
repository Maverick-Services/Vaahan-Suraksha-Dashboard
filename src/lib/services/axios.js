// @/lib/services/axios
import axios from 'axios'

// Create instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: { 'Content-Type': 'application/json' },
})

// Attach tokens automatically
api.interceptors.request.use((cfg) => {
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null
    if (token) cfg.headers.Authorization = `Bearer ${token}`
    return cfg;
})
export default api;

// If a 401 comes back, try refreshing once
// let isRefreshing = false
// let queue = []

// api.interceptors.response.use(
//     (res) => res,
//     async (err) => {
//         const original = err.config
//         if (err.response?.status === 401 && !original._retry) {
//             if (isRefreshing) {
//                 // queue up other calls
//                 return new Promise((resolve, reject) =>
//                     queue.push({ resolve, reject })
//                 ).then((token) => {
//                     original.headers.Authorization = `Bearer ${token}`
//                     return api(original)
//                 })
//             }
//             original._retry = true
//             isRefreshing = true
//             try {
//                 const refreshToken = localStorage.getItem('refreshToken')
//                 const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken })
//                 localStorage.setItem('accessToken', data.accessToken)
//                 // notify the queue
//                 queue.forEach(p => p.resolve(data.accessToken))
//                 queue = []
//                 return api(original)
//             } catch (refreshErr) {
//                 queue.forEach(p => p.reject(refreshErr))
//                 queue = []
//                 // log out on failure
//                 localStorage.removeItem('accessToken')
//                 localStorage.removeItem('refreshToken')
//                 window.location.href = '/login'
//                 return Promise.reject(refreshErr)
//             } finally {
//                 isRefreshing = false
//             }
//         }
//         return Promise.reject(err)
//     }
// )

