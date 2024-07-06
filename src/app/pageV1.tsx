/*
Code before move to GraphQL server

"use client";

import { Button, Grid, TextInput } from "@tremor/react";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/outline";

export default function Home() {
  const [messages, setMessages] = useState<any[]>([
    {
      id: "1",
      role: "system",
      content: "You are an assistant who specializes in scams and cons. Sometimes you  ask the user additional questions to get more information before providing advice. Examples of real scams are helpful to share.",
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
  
  const onSendMessage= async () => {
    setMessages([
      ...messages,
      {
        id: `${messages.length + 1}`,
        role: "user",
        content: "",
      },
    ]);
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(messages)
    };
    const response = await fetch("/api/messages", requestOptions);
      if (response.body == null) {
        return;
      }

    const reader = response.body.getReader();
    let responseMessage = "";
    const numMessages = messages.length;
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      const delta = decoder.decode(value);
      if (done) {
        break;
      }
      responseMessage += delta;
      setMessages([
        ...messages,
        {
          id: `${numMessages + 1}`,
          role: "assistant",
          content: responseMessage,
        },
        {
          id: `${numMessages + 2}`,
          role: "user",
          content: "",
        },
      ]);
    }          
  }

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
        
        <div className="flex pt-2 space-x-2" key={`input`}
>
          <TextInput
            className="border-0 shadow-none"
            placeholder="Type something here..."
            value={message.content}
            onKeyUp={(e) => {
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
}
*/
