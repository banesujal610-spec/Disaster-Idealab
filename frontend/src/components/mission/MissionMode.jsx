import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import L from 'leaflet'
import { exitMissionMode, updateIncidentStatus } from '../../store/incidentsSlice'
import { freeTeam } from '../../store/teamsSlice'
import { getSeverityColor, getStatusColor, getStatusLabel, formatTime } from '../../utils/helpers'
import { FiX, FiClock, FiMapPin, FiNavigation, FiCheckCircle, FiAlertTriangle, FiRadio } from 'react-icons/fi'

const incidentIcon = L.divIcon({
  html: '<div style="background:#ef4444;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:3px solid rgba(255,255,255,0.4);box-shadow:0 0 20px rgba(239,68,68,0.5)">🔥</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  className: '',
})

const teamIcon = L.divIcon({
  html: '<div style="background:#3b82f6;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid rgba(255,255,255,0.4);box-shadow:0 0 15px rgba(59,130,246,0.5)">🚒</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: '',
})

export default function MissionMode() {
  const dispatch = useDispatch()
  const missionIncident = useSelector(state => state.incidents.missionIncident)
  const incident = useSelector(state =>
    state.incidents.items.find(i => i.id === missionIncident?.id)
  )
  const [missionStatus, setMissionStatus] = useState('en_route')
  const [elapsed, setElapsed] = useState(0)
  const [teamPos, setTeamPos] = useState([incident?.location?.lat + 0.005, incident?.location?.lng - 0.003])
  const [incidentAddress, setIncidentAddress] = useState(incident?.location?.address || 'Fetching address...')
  const [teamAddress, setTeamAddress] = useState('Fetching unit location...')

  useEffect(() => {
    if (!incident) return;

    // Try to get real-time location for the team
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setTeamPos([pos.coords.latitude, pos.coords.longitude])
      })
    }
    
    const fetchAddresses = async () => {
      try {
        // Reverse geocode incident location
        const res1 = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${incident.location.lat}&lon=${incident.location.lng}`);
        const data1 = await res1.json();
        setIncidentAddress(data1.display_name || 'Location provided');

        // Wait 1 second to respect Nominatim rate limits (1 req/sec)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Reverse geocode team location
        const res2 = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${teamPos[0]}&lon=${teamPos[1]}`);
        const data2 = await res2.json();
        setTeamAddress(data2.display_name || 'Current unit location');
      } catch (error) {
        console.error("Geocoding failed:", error);
      }
    };

    fetchAddresses();
  }, [incident])

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!incident) {
    dispatch(exitMissionMode())
    return null
  }

  const formatElapsed = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleStatusChange = (status) => {
    setMissionStatus(status)
    if (status === 'completed') {
      dispatch(updateIncidentStatus({ id: incident.id, status: 'resolved' }))
      dispatch(freeTeam(incident.assignedTeam))
      setTimeout(() => dispatch(exitMissionMode()), 2000)
    }
  }

  const center = [incident.location.lat, incident.location.lng]
  const routePath = [teamPos, center]

  const missionSteps = [
    { key: 'en_route', label: 'En Route', icon: FiNavigation },
    { key: 'arrived', label: 'Arrived', icon: FiMapPin },
    { key: 'completed', label: 'Completed', icon: FiCheckCircle },
  ]

  const currentStepIndex = missionSteps.findIndex(s => s.key === missionStatus)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen bg-dark-950 flex flex-col"
    >
      {/* Top Bar */}
      <div className="bg-dark-900/80 backdrop-blur-xl border-b border-red-500/20 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="text-red-400 animate-pulse" />
            <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Mission Mode</span>
          </div>
          <div className="w-px h-6 bg-dark-700" />
          <span className="text-white font-mono text-sm">{incident.id}</span>
          <span className={`status-badge ${getSeverityColor(incident.severity)}`}>
            {incident.severity}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <FiClock className="text-primary-400" />
            <span className="font-mono text-white">{formatElapsed(elapsed)}</span>
          </div>
          <button
            onClick={() => dispatch(exitMissionMode())}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 text-dark-400 hover:text-red-400 transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Map */}
        <div className="flex-1">
          <MapContainer
            center={center}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution=""
            />
            <Marker position={center} icon={incidentIcon}>
              <Popup>
                <div className="max-w-[200px]">
                  <h3 className="font-bold">{incident.type}</h3>
                  <p className="text-xs text-gray-700 mt-1 leading-tight">{incidentAddress}</p>
                </div>
              </Popup>
            </Marker>
            <Marker position={teamPos} icon={teamIcon}>
              <Popup>
                <div className="max-w-[200px]">
                  <h3 className="font-bold">Your Unit</h3>
                  <p className="text-xs text-gray-700 mt-1 leading-tight">{teamAddress}</p>
                </div>
              </Popup>
            </Marker>
            <Polyline
              positions={routePath}
              pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '10 5', opacity: 0.8 }}
            />
          </MapContainer>
        </div>

        {/* Side Panel */}
        <div className="w-96 bg-dark-900/50 backdrop-blur-xl border-l border-white/5 flex flex-col overflow-y-auto">
          {/* Incident Details */}
          <div className="p-5 border-b border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">{incident.type} Incident</h2>
            <p className="text-sm text-dark-300 mb-4">{incident.description}</p>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-dark-400">
                <FiMapPin size={16} className="mt-0.5 flex-shrink-0 text-red-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Incident Address</p>
                  <p className="text-xs leading-relaxed">{incidentAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-dark-400">
                <FiNavigation size={16} className="mt-0.5 flex-shrink-0 text-blue-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Current Unit Location</p>
                  <p className="text-xs leading-relaxed">{teamAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <FiClock size={14} />
                Reported {formatTime(incident.reportedAt)}
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <FiRadio size={14} />
                Contact: {incident.contactNumber}
              </div>
            </div>
          </div>

          {/* Mission Status Controls */}
          <div className="p-5 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white mb-4">Mission Progress</h3>
            <div className="space-y-3">
              {missionSteps.map((step, index) => {
                const isActive = step.key === missionStatus
                const isCompleted = index < currentStepIndex
                const StepIcon = step.icon

                return (
                  <button
                    key={step.key}
                    onClick={() => {
                      if (index === currentStepIndex + 1 || isCompleted) handleStatusChange(step.key)
                    }}
                    disabled={index > currentStepIndex + 1 && !isCompleted}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      isActive
                        ? 'bg-primary-500/10 border border-primary-500/30 text-primary-400'
                        : isCompleted
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-dark-800/30 border border-white/5 text-dark-500 opacity-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-primary-500/20' : isCompleted ? 'bg-green-500/20' : 'bg-dark-700'
                    }`}>
                      <StepIcon size={14} />
                    </div>
                    <span className="text-sm font-medium">{step.label}</span>
                    {isCompleted && <FiCheckCircle className="ml-auto text-green-400" size={14} />}
                    {isActive && <span className="ml-auto w-2 h-2 rounded-full bg-primary-500 animate-pulse" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* AI Suggestion */}
          <div className="p-5">
            <div className="bg-primary-500/5 border border-primary-500/20 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-primary-400 mb-2">🤖 AI Suggestion</h4>
              <p className="text-xs text-dark-300 leading-relaxed">
                {missionStatus === 'en_route'
                  ? 'Optimal route calculated. Avoid main road due to traffic congestion. ETA: 4 minutes via secondary route.'
                  : missionStatus === 'arrived'
                  ? 'Assess situation and report status. Backup unit available if needed. Check for additional casualties.'
                  : 'Mission completed. File report and update incident status. Mark unit as available for next dispatch.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
