import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { getSeverityColor, getDepartmentColor, getDepartmentIcon, calculateDistance } from '../../utils/helpers'
import { FiX, FiMapPin, FiClock, FiTruck, FiPhone } from 'react-icons/fi'

export default function SmartDispatch({ incident, onAssign, onClose }) {
  const teams = useSelector(state => state.teams.items)
  const availableTeams = teams
    .filter(t => t.status === 'available')
    .map(t => ({
      ...t,
      distance: calculateDistance(
        incident.location.lat, incident.location.lng,
        t.location.lat, t.location.lng
      ),
    }))
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-dark p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Smart Dispatch</h2>
          <button onClick={onClose} className="text-dark-400 hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        {/* Incident Summary */}
        <div className="bg-dark-800/50 rounded-xl p-4 mb-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <span className={`status-badge ${getSeverityColor(incident.severity)}`}>
              {incident.severity}
            </span>
            <span className="text-sm text-white font-medium">{incident.type}</span>
          </div>
          <p className="text-xs text-dark-400 mb-2">{incident.description}</p>
          <div className="flex items-center gap-3 text-xs text-dark-500">
            <span className="flex items-center gap-1">
              <FiMapPin size={10} />
              {incident.location.address}
            </span>
          </div>
        </div>

        {/* Available Teams */}
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <FiTruck className="text-primary-400" />
          Nearest Available Teams
        </h3>

        <div className="space-y-3">
          {availableTeams.map(team => (
            <div
              key={team.id}
              className="bg-dark-800/30 rounded-xl p-4 border border-white/5 hover:border-primary-500/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getDepartmentIcon(team.department)}</span>
                  <div>
                    <p className="text-sm text-white font-medium">{team.name}</p>
                    <p className="text-[10px] text-dark-500">{team.rank} • {team.station}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDepartmentColor(team.department)}`}>
                  {team.department}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3 text-xs text-dark-400">
                  <span className="flex items-center gap-1">
                    <FiMapPin size={10} />
                    {team.distance} km
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock size={10} />
                    ~{Math.ceil(parseFloat(team.distance) * 2)} min ETA
                  </span>
                </div>
                <button
                  onClick={() => onAssign(incident.id, team.id)}
                  className="btn-primary text-xs py-1.5 px-4"
                >
                  Dispatch
                </button>
              </div>
            </div>
          ))}

          {availableTeams.length === 0 && (
            <div className="text-center py-8 text-dark-500">
              <FiTruck className="mx-auto mb-2" size={24} />
              <p className="text-sm">No teams currently available</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
