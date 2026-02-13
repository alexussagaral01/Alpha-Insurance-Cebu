import express from 'express';

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const username = req.headers['x-username'];
  const adminId = req.headers['x-admin-id'];

  if (!username || !adminId) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized: Missing authentication credentials' 
    });
  }

  // Attach to request for use in routes
  req.user = { username, adminId };
  next();
};

export default authMiddleware;
