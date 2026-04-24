import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { getDepartmentIcon, getDepartmentColor } from '../../utils/helpers'
import { FiUsers, FiMapPin, FiClock, FiRadio } from 'react-icons/fi'

export default function TeamsPage() {
  const teams = useSelector(state => state.teams.items)

  const grouped = teams.reduce((acc, team) => {
    if (!acc[team.department]) acc[team.department] = []
    acc[team.department].push(team)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FiUsers className="text-blue-400" />
          Emergency Teams
        </h1>
        <p className="text-dark-400 text-sm mt-1">{teams.length} units registered</p>
      </div>

      {Object.entries(grouped).map(([dept, deptTeams]) => (
        <div key={dept}>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="text-lg">{getDepartmentIcon(dept)}</span>
            {dept} Department
            <span className="text-xs text-dark-500 font-normal">({deptTeams.length} units)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {deptTeams.map((team, i) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getDepartmentIcon(team.department)}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{team.name}</h3>
                      <p className="text-[10px] text-dark-500">{team.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                    team.status === 'available'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : team.status === 'dispatched'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-dark-700 text-dark-400 border border-dark-600'
                  }`}>
                    {team.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-dark-400">
                  <div className="flex items-center gap-2">
                    <FiRadio size={10} />
                    <span>{team.rank}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin size={10} />
                    <span>{team.station}</span>
                  </div>
                  {team.eta && (
                    <div className="flex items-center gap-2 text-orange-400">
                      <FiClock size={10} />
                      <span>ETA: {team.eta}</span>
                    </div>
                  )}
                  {team.currentIncident && (
                    <div className="text-primary-400">
                      Assigned: {team.currentIncident}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
