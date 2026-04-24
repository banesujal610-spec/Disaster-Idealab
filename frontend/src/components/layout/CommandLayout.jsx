import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import MissionMode from '../mission/MissionMode'
import api from '../../services/api'
import { setIncidents } from '../../store/incidentsSlice'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification } from '../../store/notificationsSlice'

export default function CommandLayout() {
  const dispatch = useDispatch()
  const missionMode = useSelector(state => state.incidents.missionMode)
  const notifications = useSelector(state => state.notifications.items)

  // Fetch initial incidents
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await api.get('/incidents/active')
        dispatch(setIncidents(response.data))
      } catch (err) {
        console.error('Failed to fetch incidents:', err)
      }
    }
    fetchIncidents()
  }, [dispatch])

  // Disable simulation as we use real backend now
  // useSimulation(true, 20000)

  // Toast notifications for new items
  useEffect(() => {
    const latest = notifications[0]
    if (latest && !latest.read) {
      toast.custom((t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } bg-dark-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl max-w-sm`}>
          <div className="flex items-start gap-3">
            <span className="text-lg">🚨</span>
            <div>
              <p className="text-sm font-medium text-white">{latest.title}</p>
              <p className="text-xs text-dark-400 mt-0.5">{latest.message}</p>
            </div>
          </div>
        </div>
      ), { duration: 4000, id: latest.id })
    }
  }, [notifications.length])

  if (missionMode) {
    return <MissionMode />
  }

  return (
    <div className="h-screen flex bg-dark-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
