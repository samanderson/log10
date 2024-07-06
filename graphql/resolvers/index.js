import { PubSub } from "graphql-subscriptions";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "REPLACE ME with your OpenAI API key",
});
const pubSub = new PubSub();
const MESSAGE_UPDATE = "MESSAGE_UPDATE";
export const resolvers = {
  Query: {
    // Send conversation to OpenAI and return the new message ID
    // The message content will be streamed over the subscription
    updateConversation: async (_, args) => {
      const { input } = args;
      const { allMessages, conversationID } = input;

      const newId = `${allMessages.length + 1}`;
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: allMessages.map((message) => ({
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

      console.log(`Message ${newId} added to ${conversationID}`);
      sendChunks(stream, conversationID, newId);
      return newId;
    },
  },
  Subscription: {
    // Sends updated message content over the subscription as deltas comes in from OpenAI
    assistantMessageUpdate: {
      subscribe: (_, args) => {
        const { conversationID } = args;
        console.log(`adding subscriber for ${conversationID}`);
        return pubSub.asyncIterator(`${MESSAGE_UPDATE}${conversationID}`);
      },
    },
  },
};

// Writes chunks recieved by openAI to the graphql subscription as full message
// TODO: would like to send deltas, but was having issues with useEffect skipping some updates
async function sendChunks(stream, conversationID, messageId) {
  let content = "";
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta != null) {
      content += delta;
      pubSub.publish(`${MESSAGE_UPDATE}${conversationID}`, {
        assistantMessageUpdate: { id: messageId, content, done: false },
      });
    }
  }

  pubSub.publish(`${MESSAGE_UPDATE}${conversationID}`, {
    assistantMessageUpdate: { id: messageId, content, done: true },
  });
}
