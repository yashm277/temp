async function updateMessageTable(playerEmail, message, sessionId, eventId) {
    const newMessage = {
        playerEmail: playerEmail,
        message: message,
        sessionId: sessionId,
        timestamp: new Date().toISOString(),
    };

    const query = `
        UPDATE your_table_name
        SET messages = messages || $1::jsonb
        WHERE eventid = $2
    `;

    try {
        await pool.query(query, [JSON.stringify([newMessage]), eventId]);
        console.log('Message added successfully!');
    } catch (err) {
        console.error('Error updating messages:', err);
    }
}