const supabase = require('../config/supabaseClient');

exports.reportIncident = async (req, res) => {
  try {
    const { type, severity, description, location, contactNumber, imageUrl } = req.body;
    
    // Parse location coordinates
    const latitude = location?.lat || location?.latitude || 0;
    const longitude = location?.lng || location?.longitude || 0;

    const { data, error } = await supabase
      .from('incidents')
      .insert([{
        incident_type: type,
        severity: severity || 'medium',
        description,
        latitude,
        longitude,
        contact_number: contactNumber,
        image_url: imageUrl,
        citizen_id: req.user?.id
      }])
      .select()
      .single();

    if (error) throw error;

    // Format data for the frontend
    const formattedData = {
      id: data.id,
      type: data.incident_type,
      severity: data.severity,
      description: data.description,
      location: { lat: data.latitude, lng: data.longitude, address: location?.address || 'Location provided' },
      status: data.status,
      reportedAt: data.created_at,
      contactNumber: data.contact_number,
      imageUrl: data.image_url,
      citizenId: data.citizen_id
    };

    // Broadcast new incident to all connected teams
    req.io.emit('new-incident', formattedData);

    res.status(201).json(formattedData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getActiveIncidents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .neq('status', 'resolved')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedData = data.map(incident => ({
      id: incident.id,
      type: incident.incident_type,
      severity: incident.severity,
      description: incident.description,
      location: { lat: incident.latitude, lng: incident.longitude, address: 'Location provided' },
      status: incident.status,
      reportedAt: incident.created_at,
      contactNumber: incident.contact_number,
      imageUrl: incident.image_url,
      citizenId: incident.citizen_id
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateIncidentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'dispatched' or 'resolved'

    const { data, error } = await supabase
      .from('incidents')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const formattedData = {
      id: data.id,
      type: data.incident_type,
      severity: data.severity,
      description: data.description,
      location: { lat: data.latitude, lng: data.longitude, address: 'Location provided' },
      status: data.status,
      reportedAt: data.created_at,
      contactNumber: data.contact_number,
      imageUrl: data.image_url,
      citizenId: data.citizen_id
    };

    // Broadcast status update
    req.io.emit('incident-updated', formattedData);

    res.json(formattedData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
