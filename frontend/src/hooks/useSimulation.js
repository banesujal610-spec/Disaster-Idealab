import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addIncident, updateIncidentStatus } from '../store/incidentsSlice'
import { addNotification } from '../store/notificationsSlice'
import { MOCK_INCIDENT_TEMPLATES, generateIncidentId, getRandomLocation } from '../services/mockData'

const ADDRESSES = [
  'Karol Bagh, New Delhi',
  'Lajpat Nagar, New Delhi',
  'Saket, New Delhi',
  'Dwarka, New Delhi',
  'Rohini, New Delhi',
  'Vasant Kunj, New Delhi',
  'Mehrauli, New Delhi',
  'Chandni Chowk, New Delhi',
]

export const useSimulation = (enabled = false, intervalMs = 15000) => {
  const dispatch = useDispatch()
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!enabled) return

    intervalRef.current = setInterval(() => {
      const rand = Math.random()

      if (rand < 0.5) {
        // Add new incident
        const template = MOCK_INCIDENT_TEMPLATES[Math.floor(Math.random() * MOCK_INCIDENT_TEMPLATES.length)]
        const location = getRandomLocation()
        const newIncident = {
          id: generateIncidentId(),
          type: template.type,
          severity: template.severity,
          description: template.description,
          location: { ...location, address: ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)] },
          status: 'reported',
          reportedAt: new Date().toISOString(),
          contactNumber: `+91-${Math.floor(Math.random() * 90000 + 10000)}-${Math.floor(Math.random() * 90000 + 10000)}`,
          imageUrl: null,
          aiAnalysis: { type: template.type, severity: template.severity, confidence: 70 + Math.floor(Math.random() * 25) },
          assignedTeam: null,
          distance: (Math.random() * 8 + 0.5).toFixed(1),
        }

        dispatch(addIncident(newIncident))
        dispatch(addNotification({
          id: `notif-${Date.now()}`,
          type: 'incident',
          title: `New ${template.severity === 'critical' ? 'CRITICAL' : ''} Incident`,
          message: `${template.type} reported at ${newIncident.location.address}`,
          timestamp: new Date().toISOString(),
          read: false,
        }))
      } else {
        // Update existing incident status
        // This is handled inside the component that has access to incidents state
      }
    }, intervalMs)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [enabled, intervalMs, dispatch])

  return null
}

export default useSimulation
