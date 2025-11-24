const { verifyToken } = require('../utils/auth');

// Authentication middleware - reads JWT from HttpOnly cookie or Authorization header
const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    console.log('authenticate middleware - token present?', !!token);
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const payload = verifyToken(token);
    console.log('authenticate middleware - payload:', payload);
    if (!payload) return res.status(401).json({ message: 'Invalid or expired token' });

    // Attach user info. Provide both `id` and `userId` for backwards compatibility.
    req.user = { id: payload.userId, userId: payload.userId, role: payload.role };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Authorization middleware - simple role check
const authorize = (requiredRole) => (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    if (req.user.role !== requiredRole) return res.status(403).json({ message: 'Access denied' });
    next();
  } catch (error) {
    console.error('Authorize middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authenticate, authorize };
