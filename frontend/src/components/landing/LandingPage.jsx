import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from '../../store/authSlice'
import AnimatedBackground from '../ui/AnimatedBackground'
import { FiAlertTriangle, FiShield, FiActivity, FiClock, FiMapPin } from 'react-icons/fi'

export default function LandingPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const incidents = useSelector(state => state.incidents.items)

  const activeIncidents = (incidents || []).filter(i => i.status !== 'resolved').length
  const avgResponseTime = '4.2 min'

  const handleCitizen = () => {
    navigate('/citizen/login')
  }

  const handleTeam = () => {
    navigate('/team/login')
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-dark-950">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between px-6 md:px-12 py-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
              <FiAlertTriangle className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-widest uppercase">ResQNet</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-dark-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Online
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-dark-800/50 backdrop-blur-md border border-white/10 text-white/80 text-sm font-medium shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              Unified Emergency Network
            </div>
          </motion.div>

          {/* Role Selection Cards */}
          <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
            {/* Citizen Card */}
            <motion.button
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCitizen}
              className="flex-1 glass-card text-left group cursor-pointer hover:border-red-500/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 group-hover:glow-red transition-all duration-300">
                <FiAlertTriangle className="text-red-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Citizen</h3>
              <p className="text-dark-400 text-sm mb-4">
                Login or create an account to report incidents with AI-powered image analysis and track statuses.
              </p>
              <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                Access Portal
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>

            {/* Team Card */}
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTeam}
              className="flex-1 glass-card text-left group cursor-pointer hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:glow-blue transition-all duration-300">
                <FiShield className="text-blue-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Emergency Team</h3>
              <p className="text-dark-400 text-sm mb-4">
                Command center with live map, AI insights, smart dispatch, and mission mode for coordinated response.
              </p>
              <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                Access Dashboard
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>

            {/* Admin Card */}
            <motion.button
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin/login')}
              className="flex-1 glass-card text-left group cursor-pointer hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:glow-purple transition-all duration-300">
                <FiShield className="text-purple-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Admin</h3>
              <p className="text-dark-400 text-sm mb-4">
                System administration, global oversight, and manual override capabilities.
              </p>
              <div className="flex items-center gap-2 text-purple-400 text-sm font-medium mt-auto">
                Admin Portal
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          </div>

          {/* Live Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-12"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <FiActivity className="text-red-400" />
              </div>
              <div>
                <p className="text-xs text-dark-500 uppercase tracking-wider">Active Incidents</p>
                <p className="text-2xl font-bold text-white">{activeIncidents}</p>
              </div>
            </div>

            <div className="w-px h-10 bg-dark-700" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <FiClock className="text-green-400" />
              </div>
              <div>
                <p className="text-xs text-dark-500 uppercase tracking-wider">Avg Response</p>
                <p className="text-2xl font-bold text-white">{avgResponseTime}</p>
              </div>
            </div>

            <div className="w-px h-10 bg-dark-700" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <FiMapPin className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-dark-500 uppercase tracking-wider">Coverage</p>
                <p className="text-2xl font-bold text-white">24/7</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center py-4 text-dark-600 text-xs"
        >
          ResQNet v1.0 — AI-Powered Disaster Response Coordination System
        </motion.footer>
      </div>
    </div>
  )
}
