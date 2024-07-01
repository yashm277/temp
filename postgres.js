const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Create a new pool instance with your connection configuration
const pool = new Pool({
    // your connection configuration here
});

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint to get messages by eventId
app.post('/getMessages', async (req, res) => {
    const { eventId } = req.body;

    if (!eventId) {
        return res.status(400).send('Event ID is required');
    }

    const query = `
        SELECT messages
        FROM your_table_name
        WHERE eventid = $1
    `;

    try {
        const result = await pool.query(query, [eventId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Event ID not found');
        }
        const messages = result.rows[0].messages;
        res.json({ messages });
    } catch (err) {
        console.error('Error retrieving messages:', err);
        res.status(500).send('Error retrieving messages');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
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
