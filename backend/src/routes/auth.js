const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Citizen Auth
router.post('/citizen/signup', authController.citizenSignup);
router.post('/citizen/login', authController.citizenLogin);

// Team Auth
router.post('/team/verify-batch', authController.verifyBatch);
router.post('/team/signup', authController.teamSignup);
router.post('/team/login', authController.teamLogin);

module.exports = router;
