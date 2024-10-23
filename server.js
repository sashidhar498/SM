const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const MESSAGES_FILE = path.join(__dirname, 'messages.txt');

// Middleware to parse JSON data
app.use(express.json());
app.use(express.static(__dirname));

// Route to send a message and store it in the text file
app.post('/send-message', (req, res) => {
    const message = req.body;
    const messageString = `${message.user}: ${message.text} (${message.timestamp})\n`;

    // Append the message to the messages.txt file
    fs.appendFile(MESSAGES_FILE, messageString, (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to save message' });
        }
        res.json({ success: true });
    });
});

// Route to get all messages from the text file
app.get('/get-messages', (req, res) => {
    fs.readFile(MESSAGES_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to load messages' });
        }

        const messages = data.split('\n').filter(Boolean).map(line => {
            const [user, text, timestamp] = line.split(/: | \(/);
            return { user, text, timestamp: timestamp.replace(')', '') };
        });

        res.json(messages);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
