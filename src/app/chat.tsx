import { Button, TextInput } from "@tremor/react";
import { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/outline";
import { useLazyQuery, useSubscription } from "@apollo/client";
import { ASSISTANT_MESSAGE_UPDATE } from "../graphql/subscriptions.js";
import { UPDATE_CONVERSATION } from "../graphql/queries.js";
import { v4 as uuid } from "uuid";

const conversationID = uuid();

export const Chat = () => {
  // Updated system message to make the assistant specialize in scams and cons
  const [messages, setMessages] = useState<any[]>([
    {
      id: "1",
      role: "system",
      content:
        "You are an assistant who specializes in scams and cons. Sometimes you  ask the user additional questions to get more information before providing advice. Examples of real scams are helpful to share.",
    },
    {
      id: "2",
      role: "assistant",
      content: "Hi, how can I help you today?",
    },
    {
      id: "3",
      role: "user",
      content: "",
    },
  ]);

  // Subscribe to the assistant message update for this conversation
  const { data: subData } = useSubscription(ASSISTANT_MESSAGE_UPDATE, {
    variables: { conversationID },
  });
  const assistantMessageUpdate = subData?.assistantMessageUpdate;
  const [updateMessages] = useLazyQuery(UPDATE_CONVERSATION);

  useEffect(() => {
    if (assistantMessageUpdate != null) {
      const messageId = assistantMessageUpdate.id;
      const currMessageIdx = messages.findIndex((m) => m.id == messageId);
      if (assistantMessageUpdate.content != null && currMessageIdx != -1) {
        const currMessage = messages[currMessageIdx];
        const updatedMessage = {
          ...currMessage,
          content: assistantMessageUpdate.content,
        };
        setMessages([
          ...messages.slice(0, currMessageIdx),
          updatedMessage,
          ...messages.slice(currMessageIdx + 1),
        ]);
      }
    }
  }, [assistantMessageUpdate]);

  const onSendMessage = async () => {
    setMessages([
      ...messages,
      {
        id: `${messages.length + 1}`,
        role: "user",
        content: "",
      },
    ]);

    const { data } = await updateMessages({
      variables: { input: { conversationID, allMessages: messages } },
    });
    const newMessageId = data?.updateConversation ?? `${messages.length + 1}`;
    let responseMessage = "";

    setMessages([
      ...messages,
      {
        id: newMessageId,
        role: "assistant",
        content: responseMessage,
      },
      {
        id: `${messages.length + 2}`,
        role: "user",
        content: "",
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto pt-10">
      {messages.slice(0, -1).map((message: any) => (
        <div
          key={`div ${message.id}`}
          className={`p-4 ${
            message.role == "user"
              ? ""
              : "bg-gray-50 border-t-2 border-b-2 border-gray-100"
          }`}
        >
          <>
            <div className="relative">
              <div className="absolute right-0">
                <Button
                  variant="light"
                  color="gray"
                  tooltip="Delete"
                  icon={TrashIcon}
                  onClick={() => {
                    setMessages(messages.filter((m) => m.id != message.id));
                  }}
                />
              </div>
            </div>
            {message.role == "system" && (
              <p className="text-xs font-bold">system</p>
            )}
            <div>
              <p className="text-sm text-gray-600">{message.content || " "}</p>
            </div>
          </>
        </div>
      ))}
      {messages.slice(-1).map((message: any) => (
        <div className="flex pt-2 space-x-2" key={`input`}>
          <TextInput
            className="border-0 shadow-none"
            placeholder="Type something here..."
            value={message.content}
            onKeyUp={(e) => {
              // Enter key behaves like clicking submit button
              if (e.key == "Enter") {
                onSendMessage();
              }
            }}
            onChange={(e) => {
              setMessages([
                ...messages.slice(0, -1),
                {
                  id: `${messages.length}`,
                  role: "user",
                  content: e.target.value,
                },
              ]);
            }}
          />
          <Button
            type="submit"
            disabled={message.content == ""}
            onClick={onSendMessage}
          >
            Submit
          </Button>
        </div>
      ))}
    </div>
  );
};
