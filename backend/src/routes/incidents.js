const express = require('express');
const router = express.Router();
const incidentsController = require('../controllers/incidentsController');
const authMiddleware = require('../middleware/authMiddleware');

// Report an incident (Citizen)
router.post('/report', authMiddleware, incidentsController.reportIncident);

// Get active incidents (Team)
router.get('/active', authMiddleware, incidentsController.getActiveIncidents);

// Update incident status (Team)
router.put('/:id/status', authMiddleware, incidentsController.updateIncidentStatus);

module.exports = router;
