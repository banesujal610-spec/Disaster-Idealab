export const INCIDENT_TYPES = [
  'Fire', 'Flood', 'Accident', 'Medical', 'Crime', 'Earthquake',
  'Gas Leak', 'Building Collapse', 'Landslide', 'Cyclone', 'Drought', 'Riot'
]

export const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical']

export const DEPARTMENTS = ['Police', 'Fire', 'Ambulance']

export const TEAM_VERIFICATION_DB = {
  'RESQ-9482': { department: 'Police', rank: 'IPS Officer', station: 'Central Police HQ', name: 'Rajesh Kumar', badge: 'IPS' },
  'RESQ-2841': { department: 'Fire', rank: 'Station Officer', station: 'Central Fire Station', name: 'Arun Sharma', badge: 'FSO' },
  'RESQ-1049': { department: 'Ambulance', rank: 'Senior Paramedic', station: 'City General Hospital', name: 'Priya Singh', badge: 'SPM' },
}

export const BATCH_VERIFICATION_DB = {
  'BATCH-POL-001': { department: 'Police', rank: 'Sub-Inspector', station: 'South Police Station' },
  'BATCH-FIRE-001': { department: 'Fire', rank: 'Leading Fireman', station: 'North Fire Station' },
  'BATCH-MED-001': { department: 'Ambulance', rank: 'Paramedic', station: 'District Hospital' },
}

export const AI_ANALYSIS_RESPONSES = {
  Fire: { type: 'Fire', severity: 'critical', confidence: 94 },
  Flood: { type: 'Flood', severity: 'high', confidence: 82 },
  Accident: { type: 'Accident', severity: 'high', confidence: 87 },
  Medical: { type: 'Medical', severity: 'high', confidence: 91 },
  Crime: { type: 'Crime', severity: 'medium', confidence: 78 },
  Earthquake: { type: 'Earthquake', severity: 'critical', confidence: 89 },
  'Gas Leak': { type: 'Gas Leak', severity: 'critical', confidence: 92 },
  'Building Collapse': { type: 'Building Collapse', severity: 'critical', confidence: 88 },
  default: { type: 'Unknown', severity: 'medium', confidence: 65 },
}

export const MOCK_INCIDENT_TEMPLATES = [
  { type: 'Fire', severity: 'critical', description: 'Major fire in commercial complex, multiple floors affected' },
  { type: 'Accident', severity: 'high', description: 'Bus overturned on main road, passengers trapped' },
  { type: 'Medical', severity: 'high', description: 'Mass casualty incident at construction site' },
  { type: 'Flood', severity: 'medium', description: 'Rising water levels in residential colony' },
  { type: 'Crime', severity: 'medium', description: 'Suspicious activity reported near school zone' },
  { type: 'Gas Leak', severity: 'critical', description: 'Major gas pipeline leak in industrial area' },
  { type: 'Earthquake', severity: 'critical', description: 'Strong tremors felt, building damage reported' },
  { type: 'Medical', severity: 'low', description: 'Minor injury from fall, first aid needed' },
]

export const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }

export const generateIncidentId = () => {
  const num = Math.floor(Math.random() * 900) + 100
  return `INC-${num}`
}

export const getRandomLocation = () => {
  const center = DEFAULT_CENTER
  return {
    lat: center.lat + (Math.random() - 0.5) * 0.05,
    lng: center.lng + (Math.random() - 0.5) * 0.05,
  }
}

export const simulateAIAnalysis = (incidentType) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const analysis = AI_ANALYSIS_RESPONSES[incidentType] || AI_ANALYSIS_RESPONSES.default
      resolve({ ...analysis, confidence: analysis.confidence + Math.floor(Math.random() * 6 - 3) })
    }, 1500)
  })
}

export const simulateIDVerification = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const profile = TEAM_VERIFICATION_DB[id]
      resolve(profile || null)
    }, 1000)
  })
}

export const simulateBatchVerification = (batchId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = BATCH_VERIFICATION_DB[batchId]
      resolve(data || null)
    }, 1000)
  })
}

// Legacy compat
const generateMockIncidents = (count = 10) => {
  const types = ['Fire', 'Medical', 'Accident', 'Flood', 'Structural Collapse'];
  const severities = ['Low', 'Medium', 'High', 'Critical'];
  const statuses = ['Reported', 'Assigned', 'En Route', 'Arrived', 'Resolved'];
  const baseLat = 40.7128;
  const baseLng = -74.0060;

  return Array.from({ length: count }).map((_, index) => {
    // Generate random offsets for coordinates within a small radius
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;

    return {
      id: `INC-${1000 + index}`,
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      location: {
        lat: baseLat + latOffset,
        lng: baseLng + lngOffset,
        address: `${Math.floor(Math.random() * 9000) + 100} Main St, Sector ${Math.floor(Math.random() * 10) + 1}`,
      },
      reporter: {
        phone: `+1 555-${Math.floor(Math.random() * 9000) + 1000}`,
      },
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
      assignedTeamId: null,
      imageUrl: `https://source.unsplash.com/400x300/?disaster,${['fire', 'accident', 'flood'][Math.floor(Math.random() * 3)]}`,
    };
  });
};

export const MOCK_TEAMS = [
  { id: 'T-001', name: 'Alpha Fire Squad', department: 'Fire', location: { lat: 40.7150, lng: -74.0100 }, status: 'Available' },
  { id: 'T-002', name: 'Bravo Medics', department: 'Ambulance', location: { lat: 40.7200, lng: -74.0050 }, status: 'Busy' },
  { id: 'T-003', name: 'Charlie Police Unit', department: 'Police', location: { lat: 40.7100, lng: -74.0150 }, status: 'Available' },
];

export const MOCK_AI_ANALYSIS = (imageType) => {
  return {
    detectedType: imageType || 'Fire',
    severity: 'High',
    confidenceScore: Math.floor(Math.random() * 20) + 80, // 80-99
    riskFactors: ['High Wind', 'Residential Area'],
  };
};
