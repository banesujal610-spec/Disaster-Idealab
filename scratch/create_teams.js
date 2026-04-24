const supabase = require('../backend/src/config/supabaseClient');
const bcrypt = require('bcryptjs');

const teamsToCreate = [
  'Rescue-Squad-43',
  'Ladder-1-59',
  'Patrol-X-97',
  'Engine-4-18',
  'Patrol-X-89',
  'Patrol-X-17',
  'Medic-1-99'
];

async function createTeams() {
  for (const teamId of teamsToCreate) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    
    // Determine department based on name
    let dept = 'police';
    if (teamId.includes('Rescue') || teamId.includes('Engine') || teamId.includes('Ladder')) dept = 'fire';
    if (teamId.includes('Medic')) dept = 'ambulance';

    const { data, error } = await supabase
      .from('teams')
      .insert([{
        unique_id: teamId,
        full_name: teamId,
        password_hash: passwordHash,
        department: dept,
        rank: 'Field Unit',
        station: 'Central Station',
        batch_id: 'BATCH-' + Math.floor(Math.random() * 1000)
      }]);
      
    if (error) {
      console.error('Error creating', teamId, error);
    } else {
      console.log('Created', teamId);
    }
  }
}

createTeams();
