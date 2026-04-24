import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [
    {
      id: 'notif-1',
      type: 'incident',
      title: 'New Critical Incident',
      message: 'Fire outbreak reported at Connaught Place',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      read: false,
    },
    {
      id: 'notif-2',
      type: 'assignment',
      title: 'Team Dispatched',
      message: 'FIRE-UNIT-03 assigned to INC-001',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: false,
    },
    {
      id: 'notif-3',
      type: 'alert',
      title: 'Weather Alert',
      message: 'Heavy rainfall expected in next 2 hours',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: true,
    },
  ],
  showPanel: false,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action) {
      state.items.unshift(action.payload)
    },
    markAsRead(state, action) {
      const notif = state.items.find(n => n.id === action.payload)
      if (notif) notif.read = true
    },
    markAllRead(state) {
      state.items.forEach(n => { n.read = true })
    },
    togglePanel(state) {
      state.showPanel = !state.showPanel
    },
    closePanel(state) {
      state.showPanel = false
    },
  },
})

export const { addNotification, markAsRead, markAllRead, togglePanel, closePanel } = notificationsSlice.actions
export default notificationsSlice.reducer
