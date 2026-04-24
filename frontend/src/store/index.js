import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import incidentsReducer from './incidentsSlice'
import teamsReducer from './teamsSlice'
import notificationsReducer from './notificationsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    incidents: incidentsReducer,
    teams: teamsReducer,
    notifications: notificationsReducer,
  },
})
