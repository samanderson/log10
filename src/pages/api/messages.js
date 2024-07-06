// Streaming NextJS REST API
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "REPLACE ME with your OpenAI API key",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests are allowed" });
    return;
  }

  // Check if request is valid
  const body = req.body ?? {};
  let messages = [];
  try {
    messages = JSON.parse(body);
  } catch (error) {
    res.status(400).json({ error: "Invalid messages" });
    return;
  }
  if (messages.length < 1) {
    res.status(400).json({ error: "Need at least one message" });
    return;
  }

  // Send messages to OpenAI
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta != null) {
      res.write(delta);
    }
  }

  res.end();
}
