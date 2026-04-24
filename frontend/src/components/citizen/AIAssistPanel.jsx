import { motion } from 'framer-motion'
import { FiCpu, FiAlertTriangle, FiActivity, FiTarget } from 'react-icons/fi'

export default function AIAssistPanel({ analysis, loading }) {
  if (loading) {
    return (
      <div className="glass-card border-primary-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center animate-pulse">
            <FiCpu className="text-primary-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Analysis</h3>
            <p className="text-xs text-dark-400">Processing image...</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-dark-700 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-dark-700 rounded animate-pulse w-1/2" />
          <div className="h-4 bg-dark-700 rounded animate-pulse w-2/3" />
        </div>
      </div>
    )
  }

  if (!analysis) return null

  const severityColors = {
    critical: 'text-red-400 bg-red-500/20 border-red-500/30',
    high: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    low: 'text-green-400 bg-green-500/20 border-green-500/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border-primary-500/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
          <FiCpu className="text-primary-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">AI Analysis Complete</h3>
          <p className="text-xs text-dark-400">Image processed successfully</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Detected Type */}
        <div className="bg-dark-800/50 rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-1.5 mb-1">
            <FiAlertTriangle className="text-orange-400 text-xs" />
            <span className="text-[10px] text-dark-400 uppercase tracking-wider">Detected</span>
          </div>
          <p className="text-sm font-semibold text-white">{analysis.type}</p>
        </div>

        {/* Severity */}
        <div className="bg-dark-800/50 rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-1.5 mb-1">
            <FiActivity className="text-red-400 text-xs" />
            <span className="text-[10px] text-dark-400 uppercase tracking-wider">Severity</span>
          </div>
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${severityColors[analysis.severity]}`}>
            {analysis.severity.toUpperCase()}
          </span>
        </div>

        {/* Confidence */}
        <div className="bg-dark-800/50 rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-1.5 mb-1">
            <FiTarget className="text-green-400 text-xs" />
            <span className="text-[10px] text-dark-400 uppercase tracking-wider">Confidence</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">{analysis.confidence}%</p>
            <div className="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analysis.confidence}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary-500 to-green-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
