import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  FiGrid, FiAlertCircle, FiMap, FiCheckSquare,
  FiUsers, FiPackage, FiBell, FiChevronLeft, FiChevronRight
} from 'react-icons/fi'
import { useState } from 'react'

const navItems = [
  { path: '/command', icon: FiGrid, label: 'Dashboard', end: true },
  { path: '/command/incidents', icon: FiAlertCircle, label: 'Live Incidents' },
  { path: '/command/map', icon: FiMap, label: 'Map View' },
  { path: '/command/tasks', icon: FiCheckSquare, label: 'Assigned Tasks' },
  { path: '/command/alerts', icon: FiBell, label: 'Alerts' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const user = useSelector(state => state.auth.user)

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2 }}
      className="h-screen bg-dark-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col"
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
          <FiAlertCircle className="text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-sm font-bold text-white">ResQNet</h1>
            <p className="text-[9px] text-dark-500 uppercase tracking-widest">Command Center</p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                  : 'text-dark-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className="flex-shrink-0" size={18} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      {!collapsed && user && (
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-xs font-bold">
              {user.name?.[0] || 'T'}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white font-medium truncate">{user.name}</p>
              <p className="text-[10px] text-dark-500">{user.department} • {user.rank}</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-white/5 text-dark-500 hover:text-white transition-colors flex items-center justify-center"
      >
        {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
      </button>
    </motion.aside>
  )
}
