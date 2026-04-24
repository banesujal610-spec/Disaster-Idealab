import { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getStatusColor, getStatusLabel, formatTime, getSeverityColor } from '../../utils/helpers'
import { FiSearch, FiArrowLeft, FiMapPin, FiClock, FiUser, FiPhone } from 'react-icons/fi'

const STATUS_STEPS = [
  { key: 'reported', label: 'Reported', icon: '📋' },
  { key: 'assigned', label: 'Assigned', icon: '🛡️' },
  { key: 'in_progress', label: 'In Progress', icon: '🚨' },
  { key: 'resolved', label: 'Resolved', icon: '✅' },
]

export default function CitizenTracking() {
  const navigate = useNavigate()
  const incidents = useSelector(state => state.incidents.items)
  const [searchId, setSearchId] = useState('')
  const [foundIncident, setFoundIncident] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = () => {
    const incident = incidents.find(i => i.id === searchId.toUpperCase())
    if (incident) {
      setFoundIncident(incident)
      setNotFound(false)
    } else {
      setFoundIncident(null)
      setNotFound(true)
    }
  }

  const currentStepIndex = foundIncident
    ? STATUS_STEPS.findIndex(s => s.key === foundIncident.status)
    : -1

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors"
          >
            <FiArrowLeft />
            <span className="text-sm">Back</span>
          </button>
          <span className="text-sm font-medium text-white">Track Incident</span>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Track Your Incident</h1>
          <p className="text-dark-400 text-sm">Enter your Incident ID to view real-time status</p>
        </motion.div>

        {/* Search */}
        <div className="glass-card mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => { setSearchId(e.target.value.toUpperCase()); setNotFound(false) }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter Incident ID (e.g., INC-001)"
              className="input-dark flex-1 font-mono"
            />
            <button
              onClick={handleSearch}
              disabled={!searchId}
              className="btn-primary px-6 disabled:opacity-40"
            >
              <FiSearch />
            </button>
          </div>
          <p className="text-dark-500 text-xs mt-2">Try: INC-001, INC-002, INC-003</p>
        </div>

        {/* Not Found */}
        {notFound && (
          <div className="text-center py-8 text-dark-400">
            <p className="text-sm">No incident found with ID "{searchId}"</p>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {foundIncident && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Status Tracker */}
              <div className="glass-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Status Tracker</h3>
                  <span className={`status-badge ${getSeverityColor(foundIncident.severity)}`}>
                    {foundIncident.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  {STATUS_STEPS.map((step, index) => (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all ${
                        index <= currentStepIndex
                          ? index === currentStepIndex
                            ? 'bg-primary-500/20 border-2 border-primary-500/50 animate-pulse'
                            : 'bg-green-500/20 border-2 border-green-500/40'
                          : 'bg-dark-800/50 border-2 border-dark-700'
                      }`}>
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
              </div>

              {/* Details */}
              <div className="glass-card">
                <h3 className="text-sm font-semibold text-white mb-3">Incident Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FiSearch className="text-dark-500" size={14} />
                    <span className="text-dark-400">ID:</span>
                    <span className="text-white font-mono">{foundIncident.id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiMapPin className="text-dark-500" size={14} />
                    <span className="text-dark-400">Location:</span>
                    <span className="text-white">{foundIncident.location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiClock className="text-dark-500" size={14} />
                    <span className="text-dark-400">Reported:</span>
                    <span className="text-white">{formatTime(foundIncident.reportedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Assigned Team */}
              {foundIncident.assignedTeam && (
                <div className="glass-card">
                  <h3 className="text-sm font-semibold text-white mb-3">Assigned Team</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FiUser className="text-dark-500" size={14} />
                      <span className="text-dark-400">Unit:</span>
                      <span className="text-white">{foundIncident.assignedTeam}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiClock className="text-dark-500" size={14} />
                      <span className="text-dark-400">ETA:</span>
                      <span className="text-green-400 font-medium">~4 min</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
