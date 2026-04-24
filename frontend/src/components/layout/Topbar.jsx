import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { togglePanel, markAsRead, markAllRead, closePanel } from '../../store/notificationsSlice'
import { logout } from '../../store/authSlice'
import { formatTime } from '../../utils/helpers'
import { FiBell, FiX, FiCheck, FiLogOut, FiUser } from 'react-icons/fi'

export default function Topbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const notifications = useSelector(state => state.notifications.items)
  const showPanel = useSelector(state => state.notifications.showPanel)
  const user = useSelector(state => state.auth.user)
  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const notifTypeIcon = {
    incident: '🚨',
    assignment: '📋',
    alert: '⚠️',
  }

  return (
    <header className="h-16 bg-dark-900/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-dark-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          System Active
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => dispatch(togglePanel())}
            className="relative w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <FiBell className="text-dark-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          <AnimatePresence>
            {showPanel && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 max-h-96 bg-dark-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch(markAllRead())}
                      className="text-[10px] text-primary-400 hover:text-primary-300"
                    >
                      Mark all read
                    </button>
                    <button onClick={() => dispatch(closePanel())}>
                      <FiX className="text-dark-400 hover:text-white" size={14} />
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto max-h-72">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => dispatch(markAsRead(notif.id))}
                      className={`p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${
                        !notif.read ? 'bg-primary-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-sm">{notifTypeIcon[notif.type]}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white">{notif.title}</p>
                          <p className="text-[11px] text-dark-400 mt-0.5">{notif.message}</p>
                          <p className="text-[10px] text-dark-500 mt-1">{formatTime(notif.timestamp)}</p>
                        </div>
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1" />}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-xs font-bold">
            {user?.name?.[0] || 'T'}
          </div>
          <div className="hidden md:block">
            <p className="text-xs text-white font-medium">{user?.name}</p>
            <p className="text-[10px] text-dark-500">{user?.rank}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 text-dark-400 transition-colors"
          title="Logout"
        >
          <FiLogOut size={16} />
        </button>
      </div>
    </header>
  )
}
