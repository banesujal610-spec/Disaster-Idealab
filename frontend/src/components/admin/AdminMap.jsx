import { useState, useMemo, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { motion } from 'framer-motion'
import { FiTarget, FiAlertCircle } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { socket } from '../../services/api'

// Custom map icons
const createIcon = (color, innerColor = '') => L.divIcon({
  html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid ${innerColor || 'rgba(0,0,0,0.5)'};box-shadow:0 0 10px ${color}80;display:flex;align-items:center;justify-content:center;"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: '',
})

const responderIcons = {
  ambulance: createIcon('#ffffff', '#333333'), // White dot
  police: createIcon('#f0e68c', '#665c00'),   // Khaki dot
  fire: createIcon('#ef4444', '#7f1d1d'),     // Red dot
}

const incidentIcon = L.divIcon({
  html: `<div style="background:#a855f7;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 20px #a855f7">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: 'animate-pulse',
})

// Helper to generate random points around a center
const generateResponders = (lat, lng, count) => {
  const responders = []
  const types = ['ambulance', 'police', 'fire']
  const names = {
    ambulance: ['Medic-1', 'Medic-2', 'Alpha-Rescue'],
    police: ['Patrol-X', 'Unit-9', 'K9-Unit'],
    fire: ['Engine-4', 'Ladder-1', 'Rescue-Squad']
  }

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const nameList = names[type]
    const r = 0.02 * Math.sqrt(Math.random()) // radius
    const theta = Math.random() * 2 * Math.PI
    
    responders.push({
      id: `resp-${i}`,
      type,
      name: nameList[Math.floor(Math.random() * nameList.length)] + '-' + Math.floor(Math.random() * 100),
      lat: lat + r * Math.cos(theta),
      lng: lng + r * Math.sin(theta),
      status: 'available'
    })
  }
  return responders
}

export default function AdminMap({ incident }) {
  const [assigned, setAssigned] = useState([])
  
  // Extract coordinates, handling both data structures just in case
  const lat = incident.latitude || incident.location?.lat || 0
  const lng = incident.longitude || incident.location?.lng || 0
  
  const [responders, setResponders] = useState([])

  useEffect(() => {
    if (lat && lng) {
      setResponders(generateResponders(lat, lng, 8))
    }
  }, [lat, lng])

  const handleAssign = (responder) => {
    if (assigned.includes(responder.id)) return;
    
    setAssigned([...assigned, responder.id])
    
    // Simulate emitting task assignment
    const taskData = {
      incidentId: incident.id,
      responderId: responder.id,
      responderType: responder.type,
      responderName: responder.name,
      incidentType: incident.type || incident.incident_type,
      description: incident.description,
      location: { lat, lng }
    }
    
    socket.emit('assign-task', taskData)
    
    toast.success(`Assigned ${responder.name} to the incident!`, {
      icon: '✅',
      className: 'glass text-white border-green-500/50',
    })
  }

  if (!lat || !lng) {
    return <div className="h-full flex items-center justify-center text-dark-400">Invalid coordinates for this incident.</div>
  }

  return (
    <div className="h-full w-full relative bg-dark-900 z-0">
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <Circle
          center={[lat, lng]}
          radius={800}
          pathOptions={{
            color: '#a855f7',
            fillColor: '#a855f7',
            fillOpacity: 0.1,
            weight: 1,
            dashArray: '4 4'
          }}
        />

        {/* Incident Marker */}
        <Marker position={[lat, lng]} icon={incidentIcon}>
          <Popup className="admin-popup">
            <div className="p-1">
              <h3 className="font-bold text-sm mb-1">{incident.type || incident.incident_type || 'Emergency'}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">{incident.description}</p>
            </div>
          </Popup>
        </Marker>

        {/* Responder Markers */}
        {responders.map(resp => (
          <Marker 
            key={resp.id} 
            position={[resp.lat, resp.lng]} 
            icon={responderIcons[resp.type]}
          >
            <Popup>
              <div className="min-w-[150px] p-1">
                <h3 className="font-bold text-sm capitalize flex items-center gap-2">
                  {resp.type === 'ambulance' ? '🚑' : resp.type === 'police' ? '🚓' : '🚒'}
                  {resp.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 capitalize">Status: {assigned.includes(resp.id) ? 'Dispatched' : resp.status}</p>
                
                <button
                  onClick={() => handleAssign(resp)}
                  disabled={assigned.includes(resp.id)}
                  className={`mt-3 w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                    assigned.includes(resp.id) 
                      ? 'bg-dark-700 text-dark-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                  }`}
                >
                  {assigned.includes(resp.id) ? 'En Route' : 'Assign to Incident'}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend overlays could go here */}
      <div className="absolute bottom-6 left-6 z-[1000] glass-card p-4 rounded-2xl flex flex-col gap-3">
        <h4 className="text-xs font-bold text-dark-400 uppercase tracking-wider mb-1">Map Legend</h4>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-3 h-3 rounded-full bg-white border border-dark-600"></div>
          <span>Ambulance</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-3 h-3 rounded-full bg-[#f0e68c] border border-[#665c00]"></div>
          <span>Police</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-3 h-3 rounded-full bg-red-500 border border-red-900"></div>
          <span>Fire Brigade</span>
        </div>
        <div className="flex items-center gap-3 text-sm mt-2 pt-2 border-t border-dark-700">
          <div className="text-lg">📍</div>
          <span className="text-purple-400 font-medium">Target Incident</span>
        </div>
      </div>
    </div>
  )
}
