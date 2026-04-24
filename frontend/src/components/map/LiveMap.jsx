import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { enterMissionMode } from '../../store/incidentsSlice'
import { getSeverityColor, getStatusColor, getStatusLabel } from '../../utils/helpers'
import { FiMap, FiLayers } from 'react-icons/fi'

// Custom icons
const createIcon = (color, emoji) => L.divIcon({
  html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid rgba(255,255,255,0.3);box-shadow:0 0 10px ${color}40">${emoji}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: '',
})

const incidentIcons = {
  critical: createIcon('#ef4444', '🔥'),
  high: createIcon('#f97316', '⚠️'),
  medium: createIcon('#eab308', '⚡'),
  low: createIcon('#22c55e', '📍'),
}

const teamIcons = {
  Police: createIcon('#3b82f6', '🚔'),
  Fire: createIcon('#ef4444', '🚒'),
  Ambulance: createIcon('#22c55e', '🚑'),
}

export default function LiveMap() {
  const dispatch = useDispatch()
  const incidents = useSelector(state => state.incidents.items)
  const teams = useSelector(state => state.teams.items)
  const center = [28.6139, 77.2090]

  const dangerZones = useMemo(() => [
    { center: [28.6139, 77.2090], radius: 500, severity: 'critical' },
    { center: [28.6329, 77.2195], radius: 300, severity: 'high' },
  ], [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiMap className="text-primary-400" />
            Live Map
          </h1>
          <p className="text-dark-400 text-sm mt-1">Real-time incident and team positions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-dark-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> High</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Medium</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Low</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-white/10" style={{ height: 'calc(100vh - 200px)' }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Danger zone circles (heatmap-like) */}
          {dangerZones.map((zone, i) => (
            <Circle
              key={`zone-${i}`}
              center={zone.center}
              radius={zone.radius}
              pathOptions={{
                color: zone.severity === 'critical' ? '#ef4444' : '#f97316',
                fillColor: zone.severity === 'critical' ? '#ef4444' : '#f97316',
                fillOpacity: 0.1,
                weight: 1,
              }}
            />
          ))}

          {/* Incident markers */}
          {incidents.filter(i => i.status !== 'resolved').map(incident => (
            <Marker
              key={incident.id}
              position={[incident.location.lat, incident.location.lng]}
              icon={incidentIcons[incident.severity] || incidentIcons.medium}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`status-badge ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className={`status-badge ${getStatusColor(incident.status)}`}>
                      {getStatusLabel(incident.status)}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm">{incident.type}</h3>
                  <p className="text-xs text-gray-400 mt-1">{incident.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{incident.location.address}</p>
                  <button
                    onClick={() => dispatch(enterMissionMode(incident))}
                    className="mt-2 w-full bg-blue-600 text-white text-xs py-1.5 rounded-lg hover:bg-blue-500"
                  >
                    Accept Mission
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Team markers */}
          {teams.map(team => (
            <Marker
              key={team.id}
              position={[team.location.lat, team.location.lng]}
              icon={teamIcons[team.department] || teamIcons.Police}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <h3 className="font-bold text-sm">{team.name}</h3>
                  <p className="text-xs text-gray-400">{team.department} • {team.rank}</p>
                  <p className="text-xs text-gray-500 mt-1">{team.station}</p>
                  <p className="text-xs mt-1">
                    Status: <span className={team.status === 'available' ? 'text-green-400' : 'text-orange-400'}>
                      {team.status}
                    </span>
                  </p>
                  {team.eta && <p className="text-xs text-gray-500">ETA: {team.eta}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
