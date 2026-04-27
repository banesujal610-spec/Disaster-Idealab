import { useMemo, useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
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

const myLocationIcon = L.divIcon({
  html: `<div style="background:#0ea5e9;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 0 15px rgba(14,165,233,0.8)"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: '',
})

function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 13, { animate: false })
    }
  }, [center, map])
  return null
}

export default function LiveMap() {
  const dispatch = useDispatch()
  const incidents = useSelector(state => state.incidents.items)
  const teams = useSelector(state => state.teams.items)
  const [center, setCenter] = useState([28.6139, 77.2090]) // Default Delhi
  const [myLocation, setMyLocation] = useState(null)
  const [isLocating, setIsLocating] = useState(false)

  const handleLocate = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = [position.coords.latitude, position.coords.longitude]
          setCenter(loc)
          setMyLocation(loc)
          setIsLocating(false)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setIsLocating(false)
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      )
    } else {
      setIsLocating(false)
    }
  }

  useEffect(() => {
    handleLocate() // Auto-locate on mount
  }, [])

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
            <button 
              onClick={handleLocate}
              disabled={isLocating}
              className="ml-4 text-xs bg-dark-800 hover:bg-dark-700 text-primary-400 border border-primary-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLocating ? (
                <div className="w-3 h-3 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
              ) : (
                <FiMap className="text-primary-400" />
              )}
              {isLocating ? 'Locating...' : 'Locate Me'}
            </button>
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
          <MapUpdater center={center} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {myLocation && (
            <Marker position={myLocation} icon={myLocationIcon}>
              <Popup>
                <div className="font-bold text-sm">Your Location</div>
              </Popup>
            </Marker>
          )}

          {/* Danger zone circles (heatmap-like) */}
          {dangerZones.map((zone, i) => {
            const zLat = center[0] + (i === 0 ? 0.01 : -0.015)
            const zLng = center[1] + (i === 0 ? 0.01 : -0.005)
            return (
              <Circle
                key={`zone-${i}`}
                center={[zLat, zLng]}
                radius={zone.radius}
                pathOptions={{
                  color: zone.severity === 'critical' ? '#ef4444' : '#f97316',
                  fillColor: zone.severity === 'critical' ? '#ef4444' : '#f97316',
                  fillOpacity: 0.1,
                  weight: 1,
                }}
              />
            )
          })}

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

          {/* Team markers - Teleported to surround user's actual location */}
          {teams.map((team, index) => {
            // Distribute teams in a rough circle/grid around the center
            const latOffset = (Math.sin(index) * 0.03)
            const lngOffset = (Math.cos(index) * 0.03)
            
            return (
              <Marker
                key={team.id}
                position={[center[0] + latOffset, center[1] + lngOffset]}
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
            )
          })}
        </MapContainer>
      </div>
    </div>
  )
}
