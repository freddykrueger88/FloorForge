/**
 * FloorForge – JWT Authentication Middleware
 * Vollständige Implementierung folgt in Issue #4
 */
const jwt = require('jsonwebtoken');

/**
 * Authentifizierung prüfen – JWT aus Authorization Header
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Kein gültiger Authorization-Header gefunden.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token ungültig oder abgelaufen.',
    });
  }
};

/**
 * Admin-Rolle prüfen – nach authenticate() einsetzen
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Administratorrechte erforderlich.',
    });
  }
  return next();
};

module.exports = { authenticate, requireAdmin };
