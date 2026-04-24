import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../store/authSlice'
import api from '../../services/api'
import AnimatedBackground from '../ui/AnimatedBackground'
import { FiUser, FiLock, FiArrowLeft, FiAlertCircle, FiAlertTriangle, FiPhone, FiMail, FiCheck } from 'react-icons/fi'

export default function CitizenSignup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSignup = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all fields')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await api.post('/auth/citizen/signup', formData)
      setSuccess(true)
      
      // Auto-login after 2 seconds
      setTimeout(() => {
        dispatch(loginSuccess(response.data))
        navigate('/citizen/report')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-dark-950 relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card text-center max-w-md w-full p-8"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6 glow-green">
              <FiCheck className="text-green-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-dark-400 mb-4">Your citizen account is ready.</p>
            <p className="text-sm text-dark-400">Redirecting to Report Portal...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <button
            onClick={() => navigate('/citizen/login')}
            className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-8"
          >
            <FiArrowLeft />
            <span className="text-sm">Back to Login</span>
          </button>

          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 glow-red">
                <FiAlertTriangle className="text-red-400 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <p className="text-dark-400 text-sm mt-1">Join the ResQNet citizen network</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-300 mb-2">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="John Doe"
                    className="input-dark w-full pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark-300 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="name@example.com"
                    className="input-dark w-full pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark-300 mb-2">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91-XXXXX-XXXXX"
                    className="input-dark w-full pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark-300 mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Min 6 characters"
                    className="input-dark w-full pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Re-enter password"
                    className="input-dark w-full pl-10"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                  <FiAlertCircle />
                  {error}
                </div>
              )}

              <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full btn-danger flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
