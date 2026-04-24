import { createSlice } from '@reduxjs/toolkit'

const initialIncidents = [
  {
    id: 'INC-001',
    type: 'Fire',
    severity: 'critical',
    description: 'Large fire outbreak in residential building, 3rd floor',
    location: { lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi' },
    status: 'assigned',
    reportedAt: new Date(Date.now() - 1200000).toISOString(),
    contactNumber: '+91-98765-43210',
    imageUrl: null,
    aiAnalysis: { type: 'Fire', severity: 'critical', confidence: 94 },
    assignedTeam: 'FIRE-UNIT-03',
    distance: 1.2,
  },
  {
    id: 'INC-002',
    type: 'Accident',
    severity: 'high',
    description: 'Multi-vehicle collision on highway, injuries reported',
    location: { lat: 28.6329, lng: 77.2195, address: 'India Gate, New Delhi' },
    status: 'in_progress',
    reportedAt: new Date(Date.now() - 3600000).toISOString(),
    contactNumber: '+91-87654-32109',
    imageUrl: null,
    aiAnalysis: { type: 'Accident', severity: 'high', confidence: 87 },
    assignedTeam: 'AMB-UNIT-01',
    distance: 2.5,
  },
  {
    id: 'INC-003',
    type: 'Flood',
    severity: 'medium',
    description: 'Water logging in low-lying area, residents stranded',
    location: { lat: 28.5921, lng: 77.2490, address: 'Nehru Place, New Delhi' },
    status: 'reported',
    reportedAt: new Date(Date.now() - 600000).toISOString(),
    contactNumber: '+91-76543-21098',
    imageUrl: null,
    aiAnalysis: { type: 'Flood', severity: 'medium', confidence: 76 },
    assignedTeam: null,
    distance: 3.8,
  },
  {
    id: 'INC-004',
    type: 'Medical',
    severity: 'high',
    description: 'Cardiac arrest case, elderly patient unconscious',
    location: { lat: 28.6289, lng: 77.2068, address: 'Rajpath, New Delhi' },
    status: 'assigned',
    reportedAt: new Date(Date.now() - 300000).toISOString(),
    contactNumber: '+91-65432-10987',
    imageUrl: null,
    aiAnalysis: { type: 'Medical', severity: 'high', confidence: 91 },
    assignedTeam: 'AMB-UNIT-02',
    distance: 0.8,
  },
  {
    id: 'INC-005',
    type: 'Crime',
    severity: 'medium',
    description: 'Armed robbery in progress at convenience store',
    location: { lat: 28.6189, lng: 77.2150, address: 'Jantar Mantar, New Delhi' },
    status: 'reported',
    reportedAt: new Date(Date.now() - 900000).toISOString(),
    contactNumber: '+91-54321-09876',
    imageUrl: null,
    aiAnalysis: { type: 'Crime', severity: 'medium', confidence: 82 },
    assignedTeam: null,
    distance: 1.5,
  },
  {
    id: 'INC-006',
    type: 'Fire',
    severity: 'low',
    description: 'Small fire in kitchen, contained by residents',
    location: { lat: 28.6400, lng: 77.2300, address: 'Civil Lines, New Delhi' },
    status: 'resolved',
    reportedAt: new Date(Date.now() - 7200000).toISOString(),
    contactNumber: '+91-43210-98765',
    imageUrl: null,
    aiAnalysis: { type: 'Fire', severity: 'low', confidence: 68 },
    assignedTeam: 'FIRE-UNIT-01',
    distance: 4.2,
  },
]

const initialState = {
  items: [],
  activeIncident: null,
  missionMode: false,
  missionIncident: null,
  filters: {
    severity: 'all',
    type: 'all',
    status: 'all',
  },
}

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setIncidents(state, action) {
      state.items = action.payload
    },
    addIncident(state, action) {
      // Check if already exists to avoid duplicates from Socket.io vs polling
      if (!state.items.find(i => i.id === action.payload.id)) {
        state.items.unshift(action.payload)
      }
    },
    updateIncidentStatus(state, action) {
      const { id, status } = action.payload
      const incident = state.items.find(i => i.id === id)
      if (incident) incident.status = status
    },
    assignTeam(state, action) {
      const { incidentId, teamId } = action.payload
      const incident = state.items.find(i => i.id === incidentId)
      if (incident) {
        incident.assignedTeam = teamId
        incident.status = 'assigned'
      }
    },
    setActiveIncident(state, action) {
      state.activeIncident = action.payload
    },
    enterMissionMode(state, action) {
      state.missionMode = true
      state.missionIncident = action.payload
    },
    exitMissionMode(state) {
      state.missionMode = false
      state.missionIncident = null
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
})

export const {
  setIncidents,
  addIncident,
  updateIncidentStatus,
  assignTeam,
  setActiveIncident,
  enterMissionMode,
  exitMissionMode,
  setFilters,
} = incidentsSlice.actions
export default incidentsSlice.reducer
