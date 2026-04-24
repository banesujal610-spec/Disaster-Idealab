import { motion } from 'framer-motion'
import { FiPackage, FiTruck, FiDroplet, FiTool, FiShield } from 'react-icons/fi'

const resources = [
  { name: 'Fire Engines', total: 12, available: 5, icon: FiTruck, color: 'text-red-400', bg: 'bg-red-500/10' },
  { name: 'Ambulances', total: 18, available: 8, icon: FiShield, color: 'text-green-400', bg: 'bg-green-500/10' },
  { name: 'Police Vehicles', total: 24, available: 15, icon: FiTruck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'Water Tankers', total: 6, available: 3, icon: FiDroplet, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { name: 'Rescue Equipment', total: 30, available: 22, icon: FiTool, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { name: 'Medical Kits', total: 50, available: 35, icon: FiPackage, color: 'text-purple-400', bg: 'bg-purple-500/10' },
]

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FiPackage className="text-orange-400" />
          Resources
        </h1>
        <p className="text-dark-400 text-sm mt-1">Emergency resource inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {resources.map((res, i) => (
          <motion.div
            key={res.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl ${res.bg} flex items-center justify-center`}>
                <res.icon className={res.color} size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{res.name}</h3>
                <p className="text-xs text-dark-500">Total: {res.total}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-400">Available</span>
              <span className="text-lg font-bold text-white">{res.available}</span>
            </div>
            <div className="mt-2 h-2 bg-dark-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-green-500 rounded-full"
                style={{ width: `${(res.available / res.total) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-dark-500 mt-1">{Math.round((res.available / res.total) * 100)}% available</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
