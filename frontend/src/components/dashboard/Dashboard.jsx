import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StatsCards from './StatsCards'
import AIInsightsPanel from './AIInsightsPanel'
import IncidentCard from '../incidents/IncidentCard'
import { FiTrendingUp } from 'react-icons/fi'

export default function Dashboard() {
  const navigate = useNavigate()
  const incidents = useSelector(state => state.incidents.items)
  const recentIncidents = incidents.slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Command Center</h1>
        <p className="text-dark-400 text-sm mt-1">Real-time disaster response overview</p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* AI Insights + Recent Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <div className="lg:col-span-1">
          <AIInsightsPanel />
        </div>

        {/* Recent Incidents */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FiTrendingUp className="text-primary-400" />
              Recent Incidents
            </h2>
            <button
              onClick={() => navigate('/command/incidents')}
              className="text-xs text-primary-400 hover:text-primary-300"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentIncidents.map((incident, i) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <IncidentCard incident={incident} compact />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
