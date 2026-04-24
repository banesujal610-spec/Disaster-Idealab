import { motion } from 'framer-motion'
import { FiCpu, FiAlertTriangle, FiMapPin, FiCloudRain, FiTruck } from 'react-icons/fi'

const insights = [
  {
    type: 'priority',
    icon: FiAlertTriangle,
    title: 'High Priority Nearby',
    message: '3 critical incidents within 5km radius. Immediate dispatch recommended.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  {
    type: 'resource',
    icon: FiTruck,
    title: 'Available Units',
    message: '2 Fire units, 1 Ambulance, and 2 Police units currently available for dispatch.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    type: 'weather',
    icon: FiCloudRain,
    title: 'Weather Risk Alert',
    message: 'Heavy rainfall predicted in next 3 hours. Flood risk in low-lying areas.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
  {
    type: 'suggestion',
    icon: FiCpu,
    title: 'AI Recommendation',
    message: 'Pre-position ambulance units near high-traffic zones based on incident pattern analysis.',
    color: 'text-primary-400',
    bg: 'bg-primary-500/10',
  },
]

export default function AIInsightsPanel() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <FiCpu className="text-primary-400" />
        AI Insights
      </h2>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <motion.div
            key={insight.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="glass-card p-4"
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg ${insight.bg} flex items-center justify-center flex-shrink-0`}>
                <insight.icon className={insight.color} size={14} />
              </div>
              <div>
                <h4 className={`text-sm font-semibold ${insight.color}`}>{insight.title}</h4>
                <p className="text-xs text-dark-400 mt-1 leading-relaxed">{insight.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
