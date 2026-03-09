require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Nodemailer setup (email)
const nodemailer = require('nodemailer');
let transporter;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
} else {
    console.warn('⚠️ SMTP configuration incomplete, email endpoint will fail');
}

// health check
app.get('/api/health', (req, res) => {
    res.json({status: 'ok'});
});

// Email endpoint
app.post('/api/send-email', async (req, res) => {
    const { email, subject, message } = req.body;
    if (!email || !subject || !message) {
        return res.status(400).json({ error: 'email, subject and message required' });
    }
    if (!transporter) {
        return res.status(500).json({ error: 'SMTP not configured' });
    }
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject,
            text: message,
        });
        res.json({ success: true, messageId: info.messageId });
    } catch (err) {
        console.error('Email error', err);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// optionally serve the frontend files if you place the build inside ../frontend
const path = require('path');
const frontendPath = path.join(__dirname, '../frontend');
// static assets (css/js/html)
if (require('fs').existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    // fallback to index.html for any route not matching API
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
} else {
    console.warn(`⚠️ Frontend directory not found at ${frontendPath}`);
}

const PORT = process.env.PORT || 10000; // Render preferred default
app.listen(PORT, '0.0.0.0', () => console.log(`📡 Notification backend listening on port ${PORT}`));
