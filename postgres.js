async function updateMessageTable(playerEmail, message, sessionId, eventId) {
    const newMessage = {
        playerEmail: playerEmail,
        message: message,
        sessionId: sessionId,
        timestamp: new Date().toISOString(),
    };

    const query = `
        INSERT INTO chat (eventid, messages)
        VALUES ($1, $2::jsonb)
        ON CONFLICT (eventid)
        DO UPDATE SET messages = chat.messages || $2::jsonb
    `;

    try {
        await pool.query(query, [eventId, JSON.stringify([newMessage])]);
        console.log('Message added successfully!');
    } catch (err) {
        console.error('Error updating messages:', err);
    }
}

// Example usage
updateMessageTable('player@example.com', 'Hello, this is a test message', 'session123', 'event123');

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
