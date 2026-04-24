import { createSlice } from '@reduxjs/toolkit'

const initialTeams = [
  {
    id: 'FIRE-UNIT-01',
    name: 'Fire Unit Alpha',
    department: 'Fire',
    rank: 'Station Officer',
    station: 'Central Fire Station',
    location: { lat: 28.6350, lng: 77.2250 },
    status: 'available',
    eta: null,
    currentIncident: null,
  },
  {
    id: 'FIRE-UNIT-02',
    name: 'Fire Unit Bravo',
    department: 'Fire',
    rank: 'Leading Fireman',
    station: 'South Fire Station',
    location: { lat: 28.5800, lng: 77.2500 },
    status: 'available',
    eta: null,
    currentIncident: null,
  },
  {
    id: 'FIRE-UNIT-03',
    name: 'Fire Unit Charlie',
    department: 'Fire',
    rank: 'Sub-Officer',
    station: 'North Fire Station',
    location: { lat: 28.6500, lng: 77.2000 },
    status: 'dispatched',
    eta: '4 min',
    currentIncident: 'INC-001',
  },
  {
    id: 'AMB-UNIT-01',
    name: 'Ambulance Unit 1',
    department: 'Ambulance',
    rank: 'Paramedic',
    station: 'City Hospital',
    location: { lat: 28.6200, lng: 77.2100 },
    status: 'dispatched',
    eta: '6 min',
    currentIncident: 'INC-002',
  },
  {
    id: 'AMB-UNIT-02',
    name: 'Ambulance Unit 2',
    department: 'Ambulance',
    rank: 'Senior Paramedic',
    station: 'General Hospital',
    location: { lat: 28.6300, lng: 77.2050 },
    status: 'dispatched',
    eta: '3 min',
    currentIncident: 'INC-004',
  },
  {
    id: 'AMB-UNIT-03',
    name: 'Ambulance Unit 3',
    department: 'Ambulance',
    rank: 'Paramedic',
    station: 'District Hospital',
    location: { lat: 28.6100, lng: 77.2300 },
    status: 'available',
    eta: null,
    currentIncident: null,
  },
  {
    id: 'POL-UNIT-01',
    name: 'Police Patrol Alpha',
    department: 'Police',
    rank: 'Sub-Inspector',
    station: 'Central Police Station',
    location: { lat: 28.6250, lng: 77.2150 },
    status: 'available',
    eta: null,
    currentIncident: null,
  },
  {
    id: 'POL-UNIT-02',
    name: 'Police Patrol Bravo',
    department: 'Police',
    rank: 'Head Constable',
    station: 'South Police Station',
    location: { lat: 28.5900, lng: 77.2400 },
    status: 'available',
    eta: null,
    currentIncident: null,
  },
  {
    id: 'POL-UNIT-03',
    name: 'Police SWAT Unit',
    department: 'Police',
    rank: 'Inspector',
    station: 'Special Branch',
    location: { lat: 28.6400, lng: 77.2200 },
    status: 'available',
    eta: null,
    currentIncident: null,
  },
]

const initialState = {
  items: initialTeams,
}

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    updateTeamStatus(state, action) {
      const { id, status } = action.payload
      const team = state.items.find(t => t.id === id)
      if (team) team.status = status
    },
    assignTeamToIncident(state, action) {
      const { teamId, incidentId, eta } = action.payload
      const team = state.items.find(t => t.id === teamId)
      if (team) {
        team.status = 'dispatched'
        team.currentIncident = incidentId
        team.eta = eta
      }
    },
    freeTeam(state, action) {
      const team = state.items.find(t => t.id === action.payload)
      if (team) {
        team.status = 'available'
        team.currentIncident = null
        team.eta = null
      }
    },
  },
})

export const { updateTeamStatus, assignTeamToIncident, freeTeam } = teamsSlice.actions
export default teamsSlice.reducer
