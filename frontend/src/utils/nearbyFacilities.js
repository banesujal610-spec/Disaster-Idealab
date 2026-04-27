/**
 * Fetch nearby emergency facilities using OpenStreetMap Overpass API
 * With caching for faster repeated lookups
 */

export const FACILITY_TYPES = {
  hospital: {
    label: 'Hospital',
    emoji: '🏥',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.15)',
    defaultPhone: '102',
  },
  police: {
    label: 'Police Station',
    emoji: '🚔',
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.15)',
    defaultPhone: '100',
  },
  fire_station: {
    label: 'Fire Station',
    emoji: '🚒',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.15)',
    defaultPhone: '101',
  },
}

function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// In-memory cache to avoid repeated API calls for same area
const cache = new Map()

function getCacheKey(lat, lng, radius) {
  // Round to 3 decimal places (~111m precision) so nearby queries hit cache
  return `${lat.toFixed(3)},${lng.toFixed(3)},${radius}`
}

export async function fetchNearbyFacilities(lat, lng, radius = 2000) {
  const cacheKey = getCacheKey(lat, lng, radius)

  // Return cached result if available (valid for 5 minutes)
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)
    if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.data
    }
    cache.delete(cacheKey)
  }

  // Simplified, faster query — uses compact output and bbox instead of around
  const latDelta = (radius / 111320)
  const lngDelta = (radius / (111320 * Math.cos(lat * Math.PI / 180)))
  const bbox = `${lat - latDelta},${lng - lngDelta},${lat + latDelta},${lng + lngDelta}`

  const query = `[out:json][timeout:8];(node["amenity"~"^(hospital|police|fire_station)$"](${bbox});way["amenity"~"^(hospital|police|fire_station)$"](${bbox}););out center body qt;`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
      { signal: controller.signal }
    )
    clearTimeout(timeout)

    if (!response.ok) throw new Error('Overpass API request failed')
    const data = await response.json()

    const results = data.elements
      .map((el) => {
        const amenity = el.tags?.amenity
        const config = FACILITY_TYPES[amenity]
        if (!config) return null

        const fLat = el.lat || el.center?.lat
        const fLng = el.lon || el.center?.lon
        if (!fLat || !fLng) return null

        const distance = getDistanceMeters(lat, lng, fLat, fLng)

        return {
          id: el.id,
          amenity,
          name: el.tags?.name || config.label,
          phone:
            el.tags?.phone ||
            el.tags?.['contact:phone'] ||
            el.tags?.['phone:emergency'] ||
            config.defaultPhone,
          lat: fLat,
          lng: fLng,
          address: el.tags?.['addr:full'] || el.tags?.['addr:street'] || '',
          distance: Math.round(distance),
          ...config,
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance)

    // Cache the result
    cache.set(cacheKey, { data: results, timestamp: Date.now() })

    return results
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Overpass API request timed out, using fallback')
    } else {
      console.error('Error fetching nearby facilities:', error)
    }
    return []
  }
}

export function getNearestByType(facilities) {
  const nearest = {}
  for (const f of facilities) {
    if (!nearest[f.amenity] || f.distance < nearest[f.amenity].distance) {
      nearest[f.amenity] = f
    }
  }
  return nearest
}
