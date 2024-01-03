const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key'; // Change this with your secret key

module.exports = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRETKEY);

    if (decodedToken.secretKey !== process.env.SECRETKEY) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decodedToken; // Store user information in request for future use
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};
