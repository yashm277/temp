import pool from './db';

interface ChatMessage {
  name: string;
  playerEmail: string;
  timestamp: Date;
  message: string;
}

async function insertChatMessage(eventId: string, message: ChatMessage): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const query = `
      UPDATE chats
      SET messages = messages || $1::jsonb
      WHERE eventid = $2
    `;

    await client.query(query, [JSON.stringify(message), eventId]);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// -------

import { insertChatMessage } from './chatDb';

// Example usage in your chat application
app.post('/send-message', async (req, res) => {
  const { eventId, name, playerEmail, message } = req.body;

  const chatMessage: ChatMessage = {
    name,
    playerEmail,
    timestamp: new Date(),
    message,
  };

  try {
    await insertChatMessage(eventId, chatMessage);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error inserting chat message:', error);
    res.status(500).json({ success: false, error: 'Failed to insert message' });
  }
});

// ------

async function getChatMessages(eventId: string): Promise<ChatMessage[]> {
  const query = 'SELECT messages FROM chats WHERE eventid = $1';
  const result = await pool.query(query, [eventId]);
  return result.rows[0]?.messages || [];
}