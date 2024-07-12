const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');


app.use(bodyParser.json());

// Endpoint to fetch messages
app.post('/getMessages', async (req, res) => {
    const { eventId } = req.body;

    const query = `
        SELECT jsonb_array_elements(messages) AS message
        FROM chat
        WHERE eventid = $1
    `;

    try {
        const result = await pool.query(query, [eventId]);
        const messages = result.rows.map(row => {
            const messageObj = row.message;
            const date = new Date(messageObj.timestamp);
            const formattedTime = date.toISOString().split('T')[1].split('.')[0].slice(0, 5); // Extract HH:MM
            return [
                messageObj.message,
                messageObj.playerEmail,
                messageObj.sessionId,
                formattedTime
            ];
        });

        res.json({ messages });
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Error fetching messages' });
    }
});


// ----------


const axios = require('axios');

async function fetchMessages(eventId) {
    try {
        const response = await axios.post('http://localhost:3000/getMessages', { eventId });
        console.log('Retrieved messages:', response.data.messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
    }
}

// Example usage
fetchMessages('event123');
