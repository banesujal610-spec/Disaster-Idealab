export const formatTime = (isoString) => {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return date.toLocaleDateString()
}

export const getSeverityColor = (severity) => {
  const colors = {
    critical: 'text-red-400 bg-red-500/20 border-red-500/30',
    high: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    low: 'text-green-400 bg-green-500/20 border-green-500/30',
  }
  return colors[severity] || colors.low
}

export const getSeverityGlow = (severity) => {
  const glows = {
    critical: 'glow-red',
    high: 'glow-orange',
    medium: '',
    low: 'glow-green',
  }
  return glows[severity] || ''
}

export const getStatusColor = (status) => {
  const colors = {
    reported: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    assigned: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    in_progress: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    resolved: 'text-green-400 bg-green-500/20 border-green-500/30',
  }
  return colors[status] || colors.reported
}

export const getStatusLabel = (status) => {
  const labels = {
    reported: 'Reported',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    resolved: 'Resolved',
  }
  return labels[status] || status
}

export const getDepartmentIcon = (dept) => {
  const icons = { Police: '🚔', Fire: '🚒', Ambulance: '🚑' }
  return icons[dept] || '🛡️'
}

export const getDepartmentColor = (dept) => {
  const colors = {
    Police: 'text-blue-400 bg-blue-500/20',
    Fire: 'text-red-400 bg-red-500/20',
    Ambulance: 'text-green-400 bg-green-500/20',
  }
  return colors[dept] || ''
}

export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (R * c).toFixed(1)
}

export const generateMockETA = () => {
  const etas = ['2 min', '3 min', '4 min', '5 min', '6 min', '8 min', '10 min']
  return etas[Math.floor(Math.random() * etas.length)]
}
