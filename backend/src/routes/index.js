/**
 * FloorForge – API Routes Index
 * Routen werden in späteren Issues aktiviert
 */
const express = require('express');
const router = express.Router();

// API Version Info
router.get('/', (req, res) => {
  res.json({
    name: 'FloorForge API',
    version: process.env.npm_package_version || '0.1.0',
    status: 'running',
    docs: '/api/docs', // Swagger – folgt in späterem Issue
  });
});

// Routen werden schrittweise aktiviert:
// Issue #4: Authentication
// router.use('/auth', require('./auth'));
// Issue #9: Boards
// router.use('/boards', require('./boards'));
// Issue #15: Export
// router.use('/export', require('./export'));
// Issue #16: Share
// router.use('/share', require('./share'));
// Issue #26: Admin
// router.use('/admin', require('./admin'));
// Issue #20: User/DSGVO
// router.use('/user', require('./user'));

module.exports = router;
