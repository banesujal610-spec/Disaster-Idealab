import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { enterMissionMode, assignTeam } from '../../store/incidentsSlice'
import { assignTeamToIncident } from '../../store/teamsSlice'
import { getSeverityColor, getStatusColor, getStatusLabel, formatTime, getDepartmentIcon } from '../../utils/helpers'
import { generateMockETA } from '../../utils/helpers'
import { FiMapPin, FiClock, FiChevronRight, FiCheck, FiUserPlus } from 'react-icons/fi'

export default function IncidentCard({ incident, compact = false }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleAccept = (e) => {
    e.stopPropagation()
    dispatch(enterMissionMode(incident))
  }

  const handleAutoAssign = (e) => {
    e.stopPropagation()
    const eta = generateMockETA()
    dispatch(assignTeam({ incidentId: incident.id, teamId: 'AUTO-DISPATCH' }))
    dispatch(assignTeamToIncident({ teamId: 'FIRE-UNIT-01', incidentId: incident.id, eta }))
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`glass-card cursor-pointer group ${compact ? 'p-4' : 'p-5'}`}
      onClick={() => navigate('/command/incidents')}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`status-badge ${getSeverityColor(incident.severity)}`}>
            {incident.severity}
          </span>
          <span className={`status-badge ${getStatusColor(incident.status)}`}>
            {getStatusLabel(incident.status)}
          </span>
        </div>
        <span className="text-[10px] text-dark-500 font-mono">{incident.id}</span>
      </div>

      <div className="flex items-start gap-2 mb-2">
        <span className="text-lg">{getDepartmentIcon(incident.type === 'Crime' ? 'Police' : incident.type === 'Fire' ? 'Fire' : incident.type === 'Medical' ? 'Ambulance' : 'Police')}</span>
        <div>
          <h3 className="text-sm font-semibold text-white">{incident.type}</h3>
          {!compact && (
            <p className="text-xs text-dark-400 mt-0.5 line-clamp-2">{incident.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-dark-400 mb-3">
        <span className="flex items-center gap-1">
          <FiMapPin size={10} />
          {incident.distance}km
        </span>
        <span className="flex items-center gap-1">
          <FiClock size={10} />
          {formatTime(incident.reportedAt)}
        </span>
      </div>

      {/* Image preview */}
      {incident.imageUrl && !compact && (
        <div className="mb-3 rounded-lg overflow-hidden">
          <img src={incident.imageUrl} alt="" className="w-full h-24 object-cover" />
        </div>
      )}

      {/* Actions */}
      {!compact && (
        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
          {incident.status === 'reported' && (
            <>
              <button
                onClick={handleAccept}
                className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1"
              >
                <FiCheck size={12} />
                Accept Task
              </button>
              <button
                onClick={handleAutoAssign}
                className="flex-1 btn-ghost text-xs py-2 flex items-center justify-center gap-1"
              >
                <FiUserPlus size={12} />
                Auto-Assign
              </button>
            </>
          )}
          {incident.status === 'assigned' && (
            <button
              onClick={handleAccept}
              className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1"
            >
              <FiCheck size={12} />
              Start Mission
            </button>
          )}
          <button className="btn-ghost text-xs py-2 px-3 flex items-center gap-1">
            Details
            <FiChevronRight size={12} />
          </button>
        </div>
      )}
    </motion.div>
  )
}
