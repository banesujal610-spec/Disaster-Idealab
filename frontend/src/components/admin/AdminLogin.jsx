import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { FiShield, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import AnimatedBackground from '../ui/AnimatedBackground'
import { loginSuccess } from '../../store/authSlice'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ id: '', password: '' })
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = (e) => {
    e.preventDefault()
    
    // Hardcoded credentials for Admin
    if (credentials.id === '123' && credentials.password === '123') {
      const adminUser = {
        id: 'admin-001',
        name: 'System Administrator',
        role: 'admin',
      }
      
      // Mock token
      const token = 'mock-admin-token-12345'
      
      dispatch(loginSuccess({ user: adminUser, token }))
      
      toast.success('Admin access granted', {
        icon: '🔐',
        className: 'glass text-white border-purple-500/50',
      })
      navigate('/admin/dashboard')
    } else {
      toast.error('Invalid admin credentials', {
        icon: '❌',
        className: 'glass text-white border-red-500/50',
      })
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-dark-950">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <button
          onClick={() => navigate('/')}
          className="absolute -top-12 left-0 text-dark-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <FiArrowLeft /> Back to Portal
        </button>

        <div className="glass-card p-8 border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 glow-purple">
              <FiShield className="text-purple-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Admin Portal</h2>
            <p className="text-dark-400 text-sm">Restricted Area. Authorized Personnel Only.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Admin ID</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="text"
                  required
                  value={credentials.id}
                  onChange={e => setCredentials({ ...credentials, id: e.target.value })}
                  className="w-full bg-dark-800/50 border border-dark-600 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  placeholder="Enter Admin ID"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="password"
                  required
                  value={credentials.password}
                  onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full bg-dark-800/50 border border-dark-600 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  placeholder="Enter Password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-6"
            >
              Verify Identity
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
