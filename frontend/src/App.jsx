import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import { useEffect } from 'react'

import LandingPage from './components/landing/LandingPage'
import IncidentReport from './components/citizen/IncidentReport'
import CitizenTracking from './components/tracking/CitizenTracking'
import CitizenLogin from './components/citizen/CitizenLogin'
import CitizenSignup from './components/citizen/CitizenSignup'
import TeamLogin from './components/team/TeamLogin'
import TeamSignup from './components/team/TeamSignup'
import CommandLayout from './components/layout/CommandLayout'
import Dashboard from './components/dashboard/Dashboard'
import IncidentManagement from './components/incidents/IncidentManagement'
import LiveMap from './components/map/LiveMap'
import AssignedTasks from './components/tasks/AssignedTasks'
import TeamsPage from './components/teams/TeamsPage'
import ResourcesPage from './components/resources/ResourcesPage'
import AlertsPage from './components/alerts/AlertsPage'
import AdminLogin from './components/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './components/admin/AdminDashboard'

import { socket } from './services/api'
import api from './services/api'
import { supabase } from './services/supabase'
import { addIncident, updateIncidentStatus } from './store/incidentsSlice'
import { loginSuccess } from './store/authSlice'

function ProtectedRoute({ children }) {
  const auth = useSelector(state => state.auth)
  if (!auth.isAuthenticated || auth.role !== 'team') return <Navigate to="/team/login" replace />
  return children
}

function CitizenRoute({ children }) {
  const auth = useSelector(state => state.auth)
  if (!auth.isAuthenticated || auth.role !== 'citizen') return <Navigate to="/citizen/login" replace />
  return children
}

export default function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Listen for Supabase auth state changes (Google OAuth redirect)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            // Send the Supabase session to our backend to sync the citizen record
            const response = await api.post('/auth/google/callback', {
              access_token: session.access_token,
              user: {
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                avatar_url: session.user.user_metadata?.avatar_url,
              },
            })

            dispatch(loginSuccess(response.data))
            navigate('/citizen/report')
            toast.success('Signed in with Google successfully!', {
              icon: '🎉',
              className: 'glass text-white border-green-500/50',
            })
          } catch (err) {
            console.error('Google auth sync failed:', err)
            toast.error('Google sign-in failed. Please try again.', {
              icon: '❌',
              className: 'glass text-white border-red-500/50',
            })
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch, navigate])

  // Socket.io listeners
  useEffect(() => {
    socket.on('new-incident', (incident) => {
      dispatch(addIncident(incident))
      toast.error(`NEW EMERGENCY: ${incident.type} reported!`, {
        icon: '🚨',
        className: 'glass text-white border-red-500/50',
      })
    })

    socket.on('incident-updated', (incident) => {
      dispatch(updateIncidentStatus({ id: incident.id, status: incident.status }))
      toast.success(`Incident ${incident.type} status updated to ${incident.status}`, {
        icon: 'ℹ️',
        className: 'glass text-white border-blue-500/50',
      })
    })

    return () => {
      socket.off('new-incident')
      socket.off('incident-updated')
    }
  }, [dispatch])

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/citizen/login" element={<CitizenLogin />} />
          <Route path="/citizen/signup" element={<CitizenSignup />} />
          <Route path="/citizen/report" element={<CitizenRoute><IncidentReport /></CitizenRoute>} />
          <Route path="/citizen/track" element={<CitizenRoute><CitizenTracking /></CitizenRoute>} />
          <Route path="/team/login" element={<TeamLogin />} />
          <Route path="/team/signup" element={<TeamSignup />} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="resources" element={<ResourcesPage />} />
          </Route>

          <Route
            path="/command"
            element={
              <ProtectedRoute>
                <CommandLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="incidents" element={<IncidentManagement />} />
            <Route path="map" element={<LiveMap />} />
            <Route path="tasks" element={<AssignedTasks />} />
            <Route path="alerts" element={<AlertsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

