import { useState, useEffect, useRef } from "react";
import { Avatar, Button, Card, Code } from "@heroui/react";
import { Input } from "@heroui/input";
import { button as buttonStyles } from "@heroui/theme";

import DefaultLayout from "@/layouts/default";

// Message types for user and assistant responses
interface Message {
  role: "user" | "assistant";
  content: string;
}

// WebSocket message interface coming from the server
interface WSMessage {
  type: "token" | "tool" | "done" | "error";
  content: string;
  threadId?: string;
}

// Create WebSocket instance outside component to persist the connection
let ws: WebSocket | null = null;

// Add these helper functions
const isCodeMessage = (content: string): boolean => {
  return content.trim().startsWith("```");
};

const extractCodeContent = (content: string): string => {
  return content
    .replace(/^```[\s\S]*?\n/, "")
    .replace(/```$/, "")
    .trim();
};

export default function DocsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the WebSocket connection only once
    if (!ws) ws = new WebSocket("ws://192.168.31.166:3000/ai");

    const handleMessage = (event: MessageEvent) => {
      const data: WSMessage = JSON.parse(event.data);

      console.log("Received message:", data);
      if (data.type === "error") {
        setIsLoading(false);
        // return;
      }

      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];

        if (data.type === "token") {
          // For token messages, update the last assistant message or create a new one.
          if (lastMessage?.role === "assistant") {
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: lastMessage.content + data.content,
            };
          } else {
            newMessages.push({ role: "assistant", content: data.content });
          }
        } else if (data.type === "tool" || data.type === "error") {
          // Display tool outputs or errors as separate messages.
          newMessages.push({
            role: "assistant",
            content: `${data.type}: ${data.content}`,
          });
        } else if (data.type === "done") {
          // Stop the loading indicator when done.
          setIsLoading(false);
        } else if (data.type === "error") {
          // Stop the loading indicator when done.
          setIsLoading(false);
        }

        return newMessages;
      });
    };

    ws.addEventListener("message", handleMessage);
    ws.addEventListener("open", () => console.log("Connected to WebSocket"));
    ws.addEventListener("close", () => (ws = null));

    return () => {
      ws?.removeEventListener("message", handleMessage);
    };
  }, []);

  // Auto-scroll to the bottom when messages update.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !ws) return;

    // Append the user's message.
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setIsLoading(true);

    // Send the query to the server.
    ws.send(
      JSON.stringify({
        role: "user",
        type: "gemini",
        content: input,
        threadId: "test-thread",
      }),
    );
    setInput("");
  };

  return (
    <DefaultLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          // padding: "1rem",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: "1rem",
            paddingBottom: "1rem",
            paddingTop: "1rem",
          }}
        >
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-4 items-center mx-2 ${
                  msg.role === "assistant" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar
                  isBordered
                  radius="lg"
                  src={
                    msg.role === "assistant"
                      ? "https://i.pravatar.cc/150?u=a04258114e29026302d"
                      : "https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  }
                  style={{
                    marginTop: "0.2rem",
                    alignSelf: "flex-start",
                  }}
                />

                <Card
                  style={
                    msg.role === "assistant"
                      ? {
                          alignSelf: "flex-end",
                          // maxWidth: "fit-content",
                          marginBottom: "1rem",
                          padding: "1rem",
                          marginLeft: "8%",
                        }
                      : {
                          alignSelf: "flex-start",
                          // maxWidth: "fit-content",
                          marginBottom: "0.5rem",
                          padding: "1rem",
                          marginRight: "5%",
                        }
                  }
                >
                  {isCodeMessage(msg.content) ? (
                    <Code>{extractCodeContent(msg.content)}</Code>
                  ) : (
                    <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                      {msg.content}
                    </p>
                  )}
                </Card>
              </div>
            ))}
            {isLoading && (
              <p
                style={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                Thinking...
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form
          style={{
            position: "sticky",
            bottom: "0",
            maxWidth: "900px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            padding: "1rem 0",
          }}
          onSubmit={handleSubmit}
        >
          <Input
            aria-autocomplete="none"
            placeholder="Type your message..."
            style={{ flex: 1, maxWidth: "100%" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            disabled={!input.trim()}
            style={{ marginLeft: "0.5rem" }}
            type="submit"
            variant="solid"
          >
            Send
          </Button>
        </form>
      </div>
    </DefaultLayout>
  );
}
