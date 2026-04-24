import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import { FiMapPin, FiCrosshair, FiWifi } from 'react-icons/fi'

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

// Component to fix map sizing and recenter when position changes
function MapController({ position }) {
  const map = useMap()

  // Fix: invalidateSize after mount to force correct tile rendering
  useEffect(() => {
    // Small delay to ensure the container is fully rendered
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 200)
    return () => clearTimeout(timer)
  }, [map])

  // Recenter map when position changes
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 15, { duration: 1.5 })
      // invalidateSize again after flyTo
      setTimeout(() => map.invalidateSize(), 500)
    }
  }, [position, map])

  return null
}

const fetchAddress = async (lat, lng) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    return data.display_name || 'Pinned Location';
  } catch (error) {
    console.error("Error fetching address:", error);
    return 'Pinned Location';
  }
};

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng, address: 'Fetching address...' });
      const address = await fetchAddress(lat, lng);
      setPosition({ lat, lng, address });
    },
  })

  return position ? (
    <Marker position={[position.lat, position.lng]} icon={redIcon} />
  ) : null
}

export default function LocationModule({ onLocationSelect }) {
  const [position, setPosition] = useState(null)
  const [gpsAccuracy, setGpsAccuracy] = useState(null)
  const [detecting, setDetecting] = useState(false)
  const center = [20.5937, 78.9629] // Center of India

  const detectLocation = () => {
    setDetecting(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition({ lat, lng, address: 'Fetching address...' });
          setGpsAccuracy(pos.coords.accuracy ? `${Math.round(pos.coords.accuracy)}m` : 'Good');
          setDetecting(false);
          const address = await fetchAddress(lat, lng);
          const finalLoc = { lat, lng, address };
          setPosition(finalLoc);
          onLocationSelect(finalLoc);
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
    if (position) {
      onLocationSelect(position)
    }
  }, [position])

  return (
    <div className="space-y-4">
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
      <div className="rounded-xl overflow-hidden border border-white/10" style={{ height: '350px' }}>
        <MapContainer
          center={center}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapController position={position} />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      {/* Location info */}
      {position && (
        <div className="flex items-start gap-2 text-sm bg-dark-800/30 rounded-lg p-3 border border-white/5">
          <FiMapPin className="text-primary-400 mt-0.5" />
          <div>
            <p className="text-white font-medium">{position.address}</p>
            <p className="text-dark-500 text-xs">
              {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </p>
            <p className="text-dark-500 text-xs mt-1">Click on the map to adjust pin location</p>
          </div>
        </div>
      )}
    </div>
  )
}
