const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
};

// Handle Google OAuth callback — sync/create citizen record
router.post('/callback', async (req, res) => {
  try {
    const { access_token, user } = req.body;

    if (!user || !user.email) {
      return res.status(400).json({ error: 'Missing user data from Google' });
    }

    // Check if citizen already exists by email
    const { data: existingCitizen, error: lookupError } = await supabase
      .from('citizens')
      .select('*')
      .eq('email', user.email)
      .single();

    let citizenRecord;

    if (existingCitizen) {
      // Citizen exists — use existing record
      citizenRecord = existingCitizen;
    } else {
      // Create a new citizen record (no password since they use Google)
      const { data: newCitizen, error: insertError } = await supabase
        .from('citizens')
        .insert([{
          full_name: user.full_name || user.email.split('@')[0],
          email: user.email,
          phone: 'N/A',
          password_hash: 'GOOGLE_OAUTH_USER',
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      citizenRecord = newCitizen;
    }

    // Generate a local JWT for the system
    const token = generateToken({ id: citizenRecord.id, role: 'citizen' });

    res.json({
      token,
      user: {
        id: citizenRecord.id,
        fullName: citizenRecord.full_name,
        email: citizenRecord.email,
        role: 'citizen',
        avatar_url: user.avatar_url || null,
        authProvider: 'google',
      },
    });
  } catch (error) {
    console.error('Google auth callback error:', error);
    res.status(500).json({ error: error.message || 'Google authentication failed' });
  }
});

module.exports = router;
