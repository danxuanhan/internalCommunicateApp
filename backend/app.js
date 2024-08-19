const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const messageRoutes = require('./routes/messages');
const app = express();

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/messages', messageRoutes);

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(3000, () => {
    console.log('Server running on port 3000');
});


