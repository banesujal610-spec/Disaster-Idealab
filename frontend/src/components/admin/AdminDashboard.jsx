import { useState } from 'react'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMapPin, FiClock, FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi'
import AdminMap from './AdminMap'

export default function AdminDashboard() {
  const incidents = useSelector(state => state.incidents.items) || []
  const [selectedIncident, setSelectedIncident] = useState(null)

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'medium': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      case 'low': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      default: return 'text-dark-400 bg-dark-400/10 border-dark-400/20'
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'reported': return 'text-red-400'
      case 'assigned': return 'text-yellow-400'
      case 'in_progress': return 'text-blue-400'
      case 'resolved': return 'text-green-400'
      default: return 'text-dark-400'
    }
  }

  // If an incident is selected, we show the map view
  if (selectedIncident) {
    return (
      <div className="h-full flex flex-col relative">
        <div className="absolute top-4 left-4 z-20">
          <button 
            onClick={() => setSelectedIncident(null)}
            className="flex items-center gap-2 px-4 py-2 bg-dark-900/80 backdrop-blur-md border border-dark-700 rounded-xl text-white hover:bg-dark-800 transition-colors shadow-lg"
          >
            <FiX /> Close Map View
          </button>
        </div>
        <div className="flex-1">
          <AdminMap incident={selectedIncident} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Global Incident Reports</h1>
        <p className="text-dark-400">View all citizen submissions and dispatch resources.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {incidents.map((incident, index) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedIncident(incident)}
              className="glass-card p-5 cursor-pointer hover:border-purple-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                  {incident.severity?.toUpperCase()} SEVERITY
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${getStatusColor(incident.status)}`}>
                  {incident.status === 'resolved' ? <FiCheckCircle /> : <FiAlertCircle />}
                  <span className="capitalize">{incident.status?.replace('_', ' ')}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{incident.type || incident.incident_type || 'Unknown Incident'}</h3>
              
              <p className="text-dark-300 text-sm mb-4 line-clamp-2">
                {incident.description || 'No description provided.'}
              </p>

              <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-dark-800">
                <div className="flex items-center gap-2 text-xs text-dark-400">
                  <FiMapPin className="text-purple-400" />
                  <span className="truncate">Lat: {incident.latitude?.toFixed(4)}, Lng: {incident.longitude?.toFixed(4)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-400">
                  <FiClock className="text-purple-400" />
                  <span>{incident.created_at ? format(new Date(incident.created_at), 'MMM d, h:mm a') : 'Just now'}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dark-800 text-center text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Click to View Map & Dispatch
              </div>
            </motion.div>
          ))}
          {incidents.length === 0 && (
            <div className="col-span-full py-12 text-center text-dark-400 border border-dashed border-dark-700 rounded-2xl glass-card">
              No active incidents reported.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
