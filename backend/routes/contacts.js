const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../models/user');
const router = express.Router();

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

// Add a contact
router.post('/add', authenticate, (req, res) => {
    const { contactName, contactEmail } = req.body;
    const user = users.find(user => user.username === req.user.username);
    if (!user) return res.status(404).send('User not found');

    user.contacts = user.contacts || [];
    user.contacts.push({ name: contactName, email: contactEmail });

    res.status(200).send('Contact added');
});

// Get contacts
router.get('/list', authenticate, (req, res) => {
    const user = users.find(user => user.username === req.user.username);
    if (!user) return res.status(404).send('User not found');

    res.status(200).json(user.contacts || []);
});

module.exports = router;
