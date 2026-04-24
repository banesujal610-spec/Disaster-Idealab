import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckSquare, FiMapPin, FiClock, FiUser, FiX, FiInfo, FiTarget } from 'react-icons/fi'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { getSeverityColor, getStatusColor, getStatusLabel, formatTime } from '../../utils/helpers'
import { socket } from '../../services/api'
import { toast } from 'react-hot-toast'

// Icon for the incident location on the team's map
const targetIcon = L.divIcon({
  html: `<div style="background:#ef4444;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 20px #ef4444">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: 'animate-pulse',
})

export default function AssignedTasks() {
  const incidents = useSelector(state => state.incidents.items)
  
  // Tasks specifically assigned via Admin Portal
  const [liveTasks, setLiveTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)

  useEffect(() => {
    // Listen for new task assignments from the admin
    const handleTaskAssigned = (taskData) => {
      setLiveTasks(prev => {
        // Prevent duplicates
        if (prev.find(t => t.incidentId === taskData.incidentId && t.responderId === taskData.responderId)) {
          return prev;
        }
        
        toast.success(`New Task Assigned: ${taskData.incidentType}`, {
          icon: '🚨',
          className: 'glass text-white border-blue-500/50',
        });
        
        return [taskData, ...prev];
      })
    }

    socket.on('task-assigned', handleTaskAssigned)

    return () => {
      socket.off('task-assigned', handleTaskAssigned)
    }
  }, [])

  // Merge database assigned incidents + live socket assigned tasks for display
  const dbAssigned = incidents.filter(i => i.status === 'assigned' || i.status === 'in_progress').map(i => ({
    isDb: true,
    id: i.id,
    type: i.type || i.incident_type,
    description: i.description,
    location: i.location || { lat: i.latitude, lng: i.longitude },
    status: i.status,
    severity: i.severity,
    reportedAt: i.created_at || new Date().toISOString()
  }))

  const allTasks = [...liveTasks.map(t => ({
    isLive: true,
    id: `${t.incidentId}-${t.responderId}`,
    type: t.incidentType,
    description: t.description,
    location: t.location,
    status: 'assigned',
    severity: 'high',
    assignedTo: t.responderName,
    reportedAt: new Date().toISOString()
  })), ...dbAssigned]

  if (selectedTask) {
    const lat = selectedTask.location.lat || selectedTask.location.latitude
    const lng = selectedTask.location.lng || selectedTask.location.longitude

    return (
      <div className="h-full flex flex-col relative space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FiTarget className="text-red-400" />
              Mission Details
            </h1>
          </div>
          <button 
            onClick={() => setSelectedTask(null)}
            className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white hover:bg-dark-700 transition-colors"
          >
            <FiX /> Back to Tasks
          </button>
        </div>

        <div className="glass-card p-4 border-blue-500/30">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-blue-400">
              <FiInfo size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">{selectedTask.type}</h3>
              <p className="text-dark-300 mt-1">{selectedTask.description || 'No additional details provided by citizen.'}</p>
              {selectedTask.assignedTo && (
                <div className="mt-2 text-sm text-dark-400">
                  <span className="font-medium text-blue-400">Assigned Unit:</span> {selectedTask.assignedTo}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-2xl overflow-hidden border border-dark-700 relative z-0" style={{ minHeight: '400px' }}>
          {lat && lng ? (
             <MapContainer
               center={[lat, lng]}
               zoom={15}
               style={{ height: '100%', width: '100%' }}
               zoomControl={false}
             >
               <TileLayer
                 url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                 attribution='&copy; CARTO'
               />
               <Circle
                 center={[lat, lng]}
                 radius={300}
                 pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 1 }}
               />
               <Marker position={[lat, lng]} icon={targetIcon}>
                 <Popup>
                   <div className="p-1 font-bold text-sm">Target Location</div>
                 </Popup>
               </Marker>
             </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-dark-400">Location coordinates unavailable</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FiCheckSquare className="text-primary-400" />
          Assigned Tasks
        </h1>
        <p className="text-dark-400 text-sm mt-1">{allTasks.length} active assignments</p>
      </div>

      {allTasks.length === 0 ? (
        <div className="glass-card text-center py-12 border border-dashed border-dark-700">
          <FiCheckSquare className="mx-auto text-dark-600 mb-3" size={32} />
          <p className="text-dark-400">No active assignments received from Command.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {allTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedTask(task)}
                className="glass-card p-5 cursor-pointer hover:border-blue-500/40 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    {task.type === 'Fire' ? '🔥' : task.type === 'Medical' ? '🏥' : task.type === 'Crime' ? '🚔' : '📍'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-white truncate">{task.type}</h3>
                      {task.isLive && <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase animate-pulse border border-red-500/20">NEW</span>}
                    </div>
                    <p className="text-xs text-dark-400 truncate mb-2">{task.description || 'View details...'}</p>
                    <div className="flex items-center gap-3 text-[10px] text-dark-500">
                      {task.assignedTo && <span className="flex items-center gap-1 text-blue-400 font-medium"><FiUser size={10} />{task.assignedTo}</span>}
                      <span className="flex items-center gap-1"><FiClock size={10} />{formatTime(task.reportedAt)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
