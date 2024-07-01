async function getMessagesByEventId(eventId) {
    const query = `
        SELECT messages
        FROM your_table_name
        WHERE eventid = $1
    `;

    try {
        const res = await pool.query(query, [eventId]);
        if (res.rows.length === 0) {
            throw new Error('Event ID not found');
        }
        return res.rows[0].messages;
    } catch (err) {
        console.error('Error retrieving messages:', err);
        throw err;
    }
}

// Example usage
getMessagesByEventId('event123')
    .then(messages => {
        console.log('Retrieved messages:', messages);
    })
    .catch(err => {
        console.error('Error:', err);
    });
