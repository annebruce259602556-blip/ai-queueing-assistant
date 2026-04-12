export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;

    try {
        const response = await fetch('https://api.coze.com/open_api/v2/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.COZE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "bot_id": process.env.COZE_BOT_ID,
                "user": "web_user",
                "query": prompt,
                "stream": false
            })
        });

        const data = await response.json();

        let aiMessage = "";
        if (data.messages && Array.isArray(data.messages)) {
            const answer = data.messages.find(m => m.role === 'assistant' && m.type === 'answer');
            aiMessage = answer ? answer.content : "I'm a bit lost, try again!";
        } else {
            aiMessage = "Sorry, I couldn't process that. Check Coze Bot status!";
        }
        
        res.status(200).json({ reply: aiMessage });

    } catch (error) {
        console.error("Coze API Error:", error);
        res.status(500).json({ error: 'Failed to connect to Coze' });
    }
}