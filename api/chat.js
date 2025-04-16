export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST requests allowed' });
    }
  
    try {
      const userMessage = req.body.message;
  
      if (typeof userMessage !== 'string' || userMessage.trim() === '') {
        return res.status(400).json({ error: 'Invalid or empty message content.' });
      }
  
      const payload = {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage },
        ],
      };
  
      const response = await fetch("https://is215-openai.upou.io/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer fernando-IDoI7Y3iKK",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      console.log("DEBUG: API response", JSON.stringify(data, null, 2));
  
      const assistantReply = data.choices?.[0]?.message?.content;
  
      if (assistantReply) {
        return res.status(200).json({ reply: assistantReply });
      } else {
        return res.status(500).json({ error: "Unexpected response structure", raw: data });
      }
    } catch (err) {
      console.error("ERROR:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  