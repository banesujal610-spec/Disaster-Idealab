import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiCheck, FiHome, FiSearch } from 'react-icons/fi'

const STATUS_STEPS = [
  { key: 'reported', label: 'Reported', icon: '📋' },
  { key: 'assigned', label: 'Assigned', icon: '🛡️' },
  { key: 'in_progress', label: 'In Progress', icon: '🚨' },
  { key: 'resolved', label: 'Resolved', icon: '✅' },
]

export default function SubmissionSuccess({ incident }) {
  const navigate = useNavigate()
  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === incident.status)

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="max-w-lg w-full text-center space-y-8"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto glow-green"
        >
          <FiCheck className="text-green-400 text-4xl" />
        </motion.div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Report Submitted Successfully
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-dark-400"
          >
            Emergency teams have been notified
          </motion.p>
        </div>

        {/* Incident ID */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card"
        >
          <p className="text-dark-400 text-sm mb-1">Incident ID</p>
          <p className="text-2xl font-mono font-bold text-primary-400">{incident.id}</p>
          <p className="text-dark-500 text-xs mt-2">Save this ID to track your incident status</p>
        </motion.div>

        {/* Status Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card"
        >
          <p className="text-sm text-dark-400 mb-4">Status Tracker</p>
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, index) => (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                    index <= currentStepIndex
                      ? 'bg-primary-500/20 border-2 border-primary-500/50'
                      : 'bg-dark-800/50 border-2 border-dark-700'
                  }`}
                >
                  {index <= currentStepIndex ? step.icon : (index + 1)}
                </div>
                <span className={`text-[10px] mt-1.5 ${
                  index <= currentStepIndex ? 'text-primary-400' : 'text-dark-500'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={() => navigate('/citizen/track')}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <FiSearch />
            Track Incident
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 btn-ghost flex items-center justify-center gap-2"
          >
            <FiHome />
            Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
