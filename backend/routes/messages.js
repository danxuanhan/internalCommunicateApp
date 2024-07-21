const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const users = require('../models/user');

// Middleware to authenticate user
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

// Send message
router.post('/send', authenticate, (req, res) => {
    const { message } = req.body;
    const user = users.find(user => user.username === req.user.username);
    if (!user) return res.status(404).send('User not found');

    res.status(200).json({ message, sender: user.username });
});

module.exports = router;
