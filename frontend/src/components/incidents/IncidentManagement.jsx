import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { setFilters } from '../../store/incidentsSlice'
import { enterMissionMode, assignTeam } from '../../store/incidentsSlice'
import { assignTeamToIncident } from '../../store/teamsSlice'
import IncidentCard from './IncidentCard'
import SmartDispatch from './SmartDispatch'
import { INCIDENT_TYPES } from '../../services/mockData'
import { generateMockETA } from '../../utils/helpers'
import { FiAlertCircle, FiFilter, FiX } from 'react-icons/fi'

export default function IncidentManagement() {
  const dispatch = useDispatch()
  const incidents = useSelector(state => state.incidents.items)
  const filters = useSelector(state => state.incidents.filters)
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const filteredIncidents = incidents.filter(i => {
    // Automatically hide completed/resolved incidents to keep the UI clean
    if (filters.status === 'all' && i.status === 'resolved') return false
    
    if (filters.severity !== 'all' && i.severity !== filters.severity) return false
    if (filters.type !== 'all' && i.type !== filters.type) return false
    if (filters.status !== 'all' && i.status !== filters.status) return false
    return true
  })

  const handleAcceptTask = (incident) => {
    dispatch(enterMissionMode(incident))
  }

  const handleAssignTeam = (incidentId, teamId) => {
    const eta = generateMockETA()
    dispatch(assignTeam({ incidentId, teamId }))
    dispatch(assignTeamToIncident({ teamId, incidentId, eta }))
    setSelectedIncident(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiAlertCircle className="text-red-400" />
            Live Incidents
          </h1>
          <p className="text-dark-400 text-sm mt-1">{filteredIncidents.length} incidents found</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          <FiFilter />
          Filters
        </button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <FiX className="text-dark-400" size={16} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-dark-400 mb-2">Severity</label>
                <select
                  value={filters.severity}
                  onChange={(e) => dispatch(setFilters({ severity: e.target.value }))}
                  className="input-dark w-full text-sm"
                >
                  <option value="all">All</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => dispatch(setFilters({ type: e.target.value }))}
                  className="input-dark w-full text-sm"
                >
                  <option value="all">All</option>
                  {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
                  className="input-dark w-full text-sm"
                >
                  <option value="all">All</option>
                  <option value="reported">Reported</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredIncidents.map((incident, i) => (
          <motion.div
            key={incident.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <IncidentCard
              incident={incident}
              onAccept={handleAcceptTask}
              onAssign={(inc) => setSelectedIncident(inc)}
            />
          </motion.div>
        ))}
      </div>

      {/* Smart Dispatch Modal */}
      <AnimatePresence>
        {selectedIncident && (
          <SmartDispatch
            incident={selectedIncident}
            onAssign={handleAssignTeam}
            onClose={() => setSelectedIncident(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
