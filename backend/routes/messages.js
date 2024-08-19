const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');

    try {
        const decoded = jwt.verify(token, 'secretkey');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

// In-memory public messages storage
let publicMessages = [];

// Route for sending a public message
router.post('/send', authenticate, (req, res) => {
    const { message } = req.body;
    const sender = req.user.username;

    const publicMessage = { sender, message };
    publicMessages.push(publicMessage);
    res.status(200).json(publicMessage);
});

// Route for retrieving public messages
router.get('/public', authenticate, (req, res) => {
    res.status(200).json(publicMessages);
});

module.exports = router;
