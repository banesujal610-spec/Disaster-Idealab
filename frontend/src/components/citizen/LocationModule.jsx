import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import { FiMapPin, FiCrosshair, FiWifi, FiPhone, FiLoader } from 'react-icons/fi'
import { fetchNearbyFacilities, FACILITY_TYPES } from '../../utils/nearbyFacilities'
import CallModal from './CallModal'

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function createFacilityIcon(emoji, color) {
  return new L.DivIcon({
    className: 'facility-div-icon',
    html: `<div style="
      width:36px;height:36px;border-radius:50%;
      background:${color};
      border:2px solid rgba(255,255,255,0.9);
      display:flex;align-items:center;justify-content:center;
      font-size:18px;
      box-shadow:0 2px 8px rgba(0,0,0,0.4);
    ">${emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })
}

const facilityIcons = {
  hospital: createFacilityIcon('🏥', 'rgba(16,185,129,0.9)'),
  police: createFacilityIcon('🚔', 'rgba(59,130,246,0.9)'),
  fire_station: createFacilityIcon('🚒', 'rgba(239,68,68,0.9)'),
}

function MapController({ position }) {
  const map = useMap()
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 200)
    return () => clearTimeout(timer)
  }, [map])
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 15, { duration: 1.5 })
      setTimeout(() => map.invalidateSize(), 500)
    }
  }, [position, map])
  return null
}

const fetchAddress = async (lat, lng) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    const data = await response.json()
    return data.display_name || 'Pinned Location'
  } catch {
    return 'Pinned Location'
  }
}

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng
      setPosition({ lat, lng, address: 'Fetching address...' })
      const address = await fetchAddress(lat, lng)
      setPosition({ lat, lng, address })
    },
  })
  return position ? <Marker position={[position.lat, position.lng]} icon={redIcon} /> : null
}

export default function LocationModule({ onLocationSelect, onFacilitiesLoaded }) {
  const [position, setPosition] = useState(null)
  const [gpsAccuracy, setGpsAccuracy] = useState(null)
  const [detecting, setDetecting] = useState(false)
  const [facilities, setFacilities] = useState([])
  const [loadingFacilities, setLoadingFacilities] = useState(false)
  const [autoDetected, setAutoDetected] = useState(false)
  const [callModal, setCallModal] = useState({ isOpen: false, phone: '', name: '', type: '', distance: null, address: '' })
  const center = [20.5937, 78.9629]

  // Auto-detect location on mount
  useEffect(() => {
    if (!autoDetected) {
      setAutoDetected(true)
      detectLocation()
    }
  }, [])

  // Fetch nearby facilities when position changes
  useEffect(() => {
    if (position?.lat && position?.lng) {
      setLoadingFacilities(true)
      fetchNearbyFacilities(position.lat, position.lng, 2000)
        .then((results) => {
          setFacilities(results)
          if (onFacilitiesLoaded) onFacilitiesLoaded(results)
        })
        .catch(() => setFacilities([]))
        .finally(() => setLoadingFacilities(false))
    }
  }, [position?.lat, position?.lng])

  const detectLocation = () => {
    setDetecting(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setPosition({ lat, lng, address: 'Fetching address...' })
          setGpsAccuracy(pos.coords.accuracy ? `${Math.round(pos.coords.accuracy)}m` : 'Good')
          setDetecting(false)
          const address = await fetchAddress(lat, lng)
          const finalLoc = { lat, lng, address }
          setPosition(finalLoc)
          onLocationSelect(finalLoc)
        },
        () => {
          const loc = { lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi (Fallback)' }
          setPosition(loc)
          setGpsAccuracy('Fallback')
          onLocationSelect(loc)
          setDetecting(false)
        }
      )
    } else {
      const loc = { lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi (Fallback)' }
      setPosition(loc)
      setGpsAccuracy('Fallback')
      onLocationSelect(loc)
      setDetecting(false)
    }
  }

  useEffect(() => {
    if (position) onLocationSelect(position)
  }, [position])

  const openCallModal = (facility) => {
    setCallModal({
      isOpen: true,
      phone: facility.phone,
      name: facility.name,
      type: facility.label,
      distance: facility.distance,
      address: facility.address,
    })
  }

  const facilityCounts = {}
  for (const f of facilities) {
    facilityCounts[f.amenity] = (facilityCounts[f.amenity] || 0) + 1
  }

  return (
    <div className="space-y-4">
      {/* Call Modal */}
      <CallModal
        isOpen={callModal.isOpen}
        onClose={() => setCallModal(prev => ({ ...prev, isOpen: false }))}
        phone={callModal.phone}
        name={callModal.name}
        type={callModal.type}
        distance={callModal.distance}
        address={callModal.address}
      />

      {/* Auto-detect button */}
      <div className="flex items-center gap-3">
        <button
          onClick={detectLocation}
          disabled={detecting}
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          <FiCrosshair className={detecting ? 'animate-spin' : ''} />
          {detecting ? 'Detecting...' : 'Auto-detect Location'}
        </button>
        {gpsAccuracy && (
          <div className="flex items-center gap-1.5 text-xs">
            <FiWifi className="text-green-400" />
            <span className="text-dark-400">GPS Accuracy:</span>
            <span className="text-green-400 font-medium">{gpsAccuracy}</span>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="rounded-xl border border-white/10" style={{ height: '400px', position: 'relative', zIndex: 1 }}>
        <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }} zoomControl={true}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapController position={position} />
          <LocationMarker position={position} setPosition={setPosition} />

          {position && (
            <Circle
              center={[position.lat, position.lng]}
              radius={2000}
              pathOptions={{
                color: 'rgba(99,102,241,0.4)',
                fillColor: 'rgba(99,102,241,0.06)',
                fillOpacity: 0.3,
                weight: 1,
                dashArray: '6 4',
              }}
            />
          )}

          {facilities.map((f) => (
            <Marker
              key={`${f.amenity}-${f.id}`}
              position={[f.lat, f.lng]}
              icon={facilityIcons[f.amenity] || facilityIcons.hospital}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{f.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>{f.name}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                        {f.label} • {f.distance < 1000 ? `${f.distance}m away` : `${(f.distance / 1000).toFixed(1)}km away`}
                      </div>
                    </div>
                  </div>
                  {f.address && (
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>📍 {f.address}</div>
                  )}
                  <button
                    onClick={() => openCallModal(f)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '6px', padding: '8px 12px', width: '100%',
                      background: f.color, color: '#fff',
                      borderRadius: '8px', border: 'none', cursor: 'pointer',
                      fontWeight: 600, fontSize: '13px',
                    }}
                  >
                    📞 Call {f.phone}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Facilities legend */}
      {position && (
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {loadingFacilities ? (
            <span className="flex items-center gap-1.5 text-dark-400">
              <FiLoader className="animate-spin" /> Searching nearby facilities...
            </span>
          ) : facilities.length > 0 ? (
            <>
              <span className="text-dark-500">Nearby:</span>
              {Object.entries(facilityCounts).map(([type, count]) => {
                const config = FACILITY_TYPES[type]
                return (
                  <span key={type} className="flex items-center gap-1 px-2 py-1 rounded-md"
                    style={{ background: config?.bgColor || 'rgba(255,255,255,0.05)' }}>
                    <span>{config?.emoji}</span>
                    <span style={{ color: config?.color }}>{count} {config?.label || type}{count > 1 ? 's' : ''}</span>
                  </span>
                )
              })}
            </>
          ) : (
            <span className="text-dark-500">No emergency facilities found within 2km</span>
          )}
        </div>
      )}

      {/* Location info */}
      {position && (
        <div className="flex items-start gap-2 text-sm bg-dark-800/30 rounded-lg p-3 border border-white/5">
          <FiMapPin className="text-primary-400 mt-0.5" />
          <div>
            <p className="text-white font-medium">{position.address}</p>
            <p className="text-dark-500 text-xs">{position.lat.toFixed(4)}, {position.lng.toFixed(4)}</p>
            <p className="text-dark-500 text-xs mt-1">Click on the map to adjust pin location</p>
          </div>
        </div>
      )}

      {/* Nearby Facilities List */}
      {facilities.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
            <FiPhone className="text-primary-400" />
            Nearby Emergency Facilities ({facilities.length})
          </h4>
          <div className="grid gap-2 max-h-60 overflow-y-auto pr-1">
            {facilities.slice(0, 15).map((f) => (
              <div
                key={`${f.amenity}-${f.id}`}
                className="flex items-center justify-between bg-dark-800/40 rounded-xl p-3 border border-white/5 hover:border-white/15 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{f.emoji}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{f.name}</p>
                    <p className="text-dark-500 text-xs">
                      {f.distance < 1000 ? `${f.distance}m` : `${(f.distance / 1000).toFixed(1)}km`}
                      {f.address ? ` • ${f.address}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openCallModal(f)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 border-none cursor-pointer"
                  style={{ background: f.color, color: '#fff' }}
                >
                  <FiPhone size={12} />
                  {f.phone}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
