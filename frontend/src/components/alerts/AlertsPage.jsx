import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { formatTime } from '../../utils/helpers'
import { FiBell, FiAlertTriangle, FiCloudRain, FiWind } from 'react-icons/fi'

const weatherAlerts = [
  { type: 'weather', title: 'Heavy Rainfall Warning', message: 'Expected 80mm rainfall in next 6 hours. Flood risk in low-lying areas.', severity: 'high', icon: FiCloudRain, time: new Date(Date.now() - 1800000).toISOString() },
  { type: 'weather', title: 'Strong Wind Advisory', message: 'Wind speeds up to 60 km/h expected. Risk to temporary structures.', severity: 'medium', icon: FiWind, time: new Date(Date.now() - 3600000).toISOString() },
  { type: 'system', title: 'Network Latency Detected', message: 'Communication delay in Sector 7. Backup channels activated.', severity: 'low', icon: FiAlertTriangle, time: new Date(Date.now() - 7200000).toISOString() },
]

export default function AlertsPage() {
  const notifications = useSelector(state => state.notifications.items)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FiBell className="text-orange-400" />
          Alerts & Warnings
        </h1>
        <p className="text-dark-400 text-sm mt-1">Weather alerts and system notifications</p>
      </div>

      {/* Weather Alerts */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Weather & Risk Alerts</h2>
        <div className="space-y-3">
          {weatherAlerts.map((alert, i) => {
            const AlertIcon = alert.icon
            const severityColor = alert.severity === 'high' ? 'text-red-400 bg-red-500/10 border-red-500/20' : alert.severity === 'medium' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card border ${severityColor.split(' ').find(c => c.startsWith('border-'))}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${severityColor.split(' ').find(c => c.startsWith('bg-'))} flex items-center justify-center flex-shrink-0`}>
                    <AlertIcon className={severityColor.split(' ').find(c => c.startsWith('text-'))} size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-semibold ${severityColor.split(' ').find(c => c.startsWith('text-'))}`}>{alert.title}</h3>
                      <span className="text-[10px] text-dark-500">{formatTime(alert.time)}</span>
                    </div>
                    <p className="text-xs text-dark-400 mt-1">{alert.message}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* System Notifications */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">System Notifications</h2>
        <div className="space-y-2">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 ${!notif.read ? 'border-primary-500/20' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">{notif.title}</h4>
                  <p className="text-xs text-dark-400 mt-0.5">{notif.message}</p>
                </div>
                <span className="text-[10px] text-dark-500">{formatTime(notif.timestamp)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
