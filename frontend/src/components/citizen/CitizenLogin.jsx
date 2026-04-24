import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../store/authSlice'
import api from '../../services/api'
import { supabase } from '../../services/supabase'
import AnimatedBackground from '../ui/AnimatedBackground'
import { FiUser, FiLock, FiArrowLeft, FiAlertCircle, FiAlertTriangle } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'

export default function CitizenLogin() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/auth/citizen/login', { email, password })
      dispatch(loginSuccess(response.data))
      navigate('/citizen/report')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/citizen/login',
        },
      })
      if (error) throw error
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-8"
          >
            <FiArrowLeft />
            <span className="text-sm">Back to Home</span>
          </button>

          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 glow-red">
                <FiAlertTriangle className="text-red-400 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">Citizen Portal</h2>
              <p className="text-dark-400 text-sm mt-1">Sign in to report or track incidents</p>
            </div>

            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-medium transition-all duration-300 disabled:opacity-50 mb-6"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FcGoogle className="text-xl" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-dark-500 uppercase tracking-wider">or sign in with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-300 mb-2">Email Address</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
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
                onClick={handleLogin}
                disabled={loading || !email || !password}
                className="w-full btn-danger flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <p className="text-dark-400 text-sm">
                Don't have an account?{' '}
                <button 
                  onClick={() => navigate('/citizen/signup')}
                  className="text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                  Create one now
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
