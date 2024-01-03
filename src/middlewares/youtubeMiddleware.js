const { google } = require('googleapis');
const youtube = google.youtube('v3');
const jwt = require('jsonwebtoken');
const readline = require('readline');
const fs = require('fs');
const db=require("../models")
// Replace with your actual secret key

function verifyToken(req, res, next) {
  const token = req.headers.authorization; // Assuming the token is in the 'Authorization' header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is invalid or has expired.' });
    }

    // Check if the token exists in the database and is not expired
    const tokenRecord = await db.User.findOne({ token });

    if (!tokenRecord) {
      return res.status(401).json({ message: 'Token not found.' });
    }

    if (new Date() > tokenRecord.expiry) {
      return res.status(401).json({ message: 'Token has expired.' });
    }

    // If the token is valid and not expired, store the user ID in the request for use in the API route
    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyToken;
