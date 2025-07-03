const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// POST: Register a player for a tournament
router.post('/register', async (req, res) => {
  try {
    const { name, phone, tournamentId, game } = req.body;

    // Check if player already registered
    const existing = await Player.findOne({ phone, tournamentId, game });
    if (existing) {
      return res.status(400).json({ message: 'Player already registered for this tournament and game.' });
    }

    const player = new Player({ name, phone, tournamentId, game });
    await player.save();

    res.status(201).json({ message: 'Player registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
});

module.exports = router;
