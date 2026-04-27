import { Outlet, Navigate, useNavigate, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FiLogOut, FiShield, FiMap, FiList, FiUsers, FiPackage } from 'react-icons/fi'
import { logout } from '../../store/authSlice'
import { motion } from 'framer-motion'

export default function AdminLayout() {
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (!auth.isAuthenticated || auth.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-dark-950 text-white overflow-hidden">
      {/* Admin Sidebar */}
      <div className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col z-20">
        <div className="p-6 border-b border-dark-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center glow-purple">
            <FiShield className="text-purple-400 text-xl" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider">RESQNET</h1>
            <p className="text-xs text-purple-400 font-medium">ADMIN OVERSIGHT</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink 
            to="/admin/dashboard"
            className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-purple-500/10 text-purple-400' : 'text-dark-400 hover:bg-dark-800 hover:text-white'}`}
          >
            <FiList className="text-lg" />
            Global Incidents
          </NavLink>
          <NavLink 
            to="/admin/teams"
            className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-purple-500/10 text-purple-400' : 'text-dark-400 hover:bg-dark-800 hover:text-white'}`}
          >
            <FiUsers className="text-lg" />
            Emergency Teams
          </NavLink>
          <NavLink 
            to="/admin/resources"
            className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-purple-500/10 text-purple-400' : 'text-dark-400 hover:bg-dark-800 hover:text-white'}`}
          >
            <FiPackage className="text-lg" />
            Resource Management
          </NavLink>
        </nav>

        <div className="p-4 border-t border-dark-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-dark-800/50">
            <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
              <span className="text-xs font-bold">AD</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">System Admin</p>
              <p className="text-xs text-dark-400 truncate">ID: 123</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <FiLogOut className="text-lg" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-16 bg-dark-900/50 backdrop-blur-md border-b border-dark-800 flex items-center px-6 justify-between z-10">
          <h2 className="text-lg font-medium text-dark-200">Global Command Center</h2>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-xs text-dark-400 px-3 py-1.5 rounded-full bg-dark-800">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               Live System View
             </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
