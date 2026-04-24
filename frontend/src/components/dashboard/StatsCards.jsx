import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiAlertTriangle, FiUsers, FiCheckCircle, FiClock } from 'react-icons/fi'

export default function StatsCards() {
  const incidents = useSelector(state => state.incidents.items)
  const teams = useSelector(state => state.teams.items)

  const activeIncidents = incidents.filter(i => i.status !== 'resolved').length
  const availableTeams = teams.filter(t => t.status === 'available').length
  const resolvedCases = incidents.filter(i => i.status === 'resolved').length
  const avgResponse = '4.2'

  const stats = [
    {
      title: 'Active Incidents',
      value: activeIncidents,
      icon: FiAlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      glow: 'glow-red',
    },
    {
      title: 'Teams Available',
      value: availableTeams,
      icon: FiUsers,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      glow: 'glow-blue',
    },
    {
      title: 'Resolved Cases',
      value: resolvedCases,
      icon: FiCheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      glow: 'glow-green',
    },
    {
      title: 'Avg Response',
      value: `${avgResponse}m`,
      icon: FiClock,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      glow: 'glow-orange',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`glass-card ${stat.glow}`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center`}>
              <stat.icon className={stat.color} size={20} />
            </div>
            <div>
              <p className="text-xs text-dark-400 uppercase tracking-wider">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
