const supabase = require('../config/supabaseClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
};

exports.citizenSignup = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('citizens')
      .insert([{ full_name: fullName, email, phone, password_hash: passwordHash }])
      .select()
      .single();

    if (error) throw error;

    const token = generateToken({ id: data.id, role: 'citizen' });
    res.status(201).json({ token, user: { id: data.id, fullName: data.full_name, email: data.email, role: 'citizen' } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.citizenLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('citizens')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, role: 'citizen' });
    res.json({ token, user: { id: user.id, fullName: user.full_name, email: user.email, role: 'citizen' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyBatch = async (req, res) => {
  try {
    const { batchId } = req.body;

    const { data, error } = await supabase
      .from('batch_records')
      .select('*')
      .eq('batch_id', batchId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Invalid Batch ID' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.teamSignup = async (req, res) => {
  try {
    const { fullName, email, phone, batchId, password } = req.body;

    // Verify batch again
    const { data: batchData, error: batchError } = await supabase
      .from('batch_records')
      .select('*')
      .eq('batch_id', batchId)
      .single();

    if (batchError || !batchData) {
      return res.status(400).json({ error: 'Invalid Batch ID' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate Unique ID
    const random = Math.floor(Math.random() * 9000) + 1000;
    const uniqueId = `RESQ-${random}`;

    const { data, error } = await supabase
      .from('teams')
      .insert([{
        unique_id: uniqueId,
        batch_id: batchId,
        full_name: fullName,
        email,
        phone,
        password_hash: passwordHash,
        department: batchData.department,
        rank: batchData.rank,
        station: batchData.station
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ uniqueId, message: 'Team account created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.teamLogin = async (req, res) => {
  try {
    const { uniqueId, password } = req.body;

    const { data: user, error } = await supabase
      .from('teams')
      .select('*')
      .eq('unique_id', uniqueId)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid Unique ID or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid Unique ID or password' });
    }

    const token = generateToken({ id: user.id, role: 'team' });
    res.json({
      token,
      user: {
        id: user.id,
        uniqueId: user.unique_id,
        fullName: user.full_name,
        department: user.department,
        rank: user.rank,
        station: user.station,
        role: 'team'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
