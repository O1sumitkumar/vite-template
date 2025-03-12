import { useState, useEffect, useRef } from "react";
import { Alert, Avatar, Button, Card, Code } from "@heroui/react";
import { Input } from "@heroui/input";
import { button as buttonStyles } from "@heroui/theme";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize the WebSocket connection only once
    // if (!ws) ws = new WebSocket("ws://192.168.31.166:3000/ai");
    console.log("ws", import.meta.env);
    if (!ws) ws = new WebSocket(`${import.meta.env.VITE_API_WS}/ai`);

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
    ws.addEventListener("open", () => (
      <Alert description="Connected to WebSocket" title="Connected" />
    ));
    ws.addEventListener("close", () => (ws = null));

    return () => {
      ws?.removeEventListener("message", handleMessage);
    };
  }, []);

  // Auto-scroll to the bottom when messages update.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus input on mount and after messages update
  useEffect(() => {
    inputRef.current?.focus();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !ws || isLoading) return;

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
      })
    );
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <DefaultLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingBottom: "120px", // Add space for fixed input
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
                  msg.role === "assistant" ? "flex-row" : "flex-row-reverse"
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
                    marginTop: msg.role !== "assistant" ? "1.2rem" : "0",
                    alignSelf: "flex-start",
                    width: "40px",
                    height: "40px",
                  }}
                />

                <Card
                  style={
                    msg.role === "assistant"
                      ? {
                          // backgroundColor: "#e3f2fd",
                          maxWidth: "80%",
                          borderRadius: "2px 20px 20px 20px",
                          marginBottom: "1rem",
                          padding: "1rem",
                          marginRight: "8%",
                        }
                      : {
                          // backgroundColor: "#f3e5f5",
                          maxWidth: "80%",
                          borderRadius: "20px 20px 0px 20px",
                          marginBottom: "0.5rem",
                          padding: "1rem",
                          marginLeft: "5%",
                        }
                  }
                >
                  {isCodeMessage(msg.content) ? (
                    // <Code
                    //   style={{
                    //     padding: "1rem",
                    //     fontSize: "0.9em",
                    //     width: "100%",
                    //     overflowX: "auto",
                    //   }}
                    // >
                    //   {extractCodeContent(msg.content)}
                    // </Code>
                    <SyntaxHighlighter language={"javascript"} style={oneDark}>
                      {extractCodeContent(msg.content)}
                    </SyntaxHighlighter>
                  ) : (
                    <p
                      style={{
                        margin: 0,
                        whiteSpace: "pre-wrap",
                        lineHeight: "1.6",
                        // color: msg.role === "assistant" ? "#1a237e" : "#4a148c",
                      }}
                    >
                      {msg.content}
                    </p>
                  )}
                </Card>
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  display: "flex",
                  // justifyContent: "flex-end",
                  marginLeft: "5%",
                  padding: "1rem",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "12px 20px",
                    borderRadius: "20px",
                    backgroundColor: "#e3f2fd",
                    animation: "pulse 1.5s infinite",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#1a237e",
                        animation: "bounce 1.4s infinite",
                      }}
                    />
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#1a237e",
                        animation: "bounce 1.4s infinite 0.2s",
                      }}
                    />
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#1a237e",
                        animation: "bounce 1.4s infinite 0.4s",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Fixed input footer */}
        <form
          style={{
            position: "fixed",
            bottom: "40px",
            left: "0",
            right: "0",
            // backgroundColor: "white",
            // borderTop: "1px solid #e5e7eb",
            padding: "1rem 0",
            // boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
          onSubmit={handleSubmit}
        >
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Input
              ref={inputRef}
              aria-autocomplete="none"
              disabled={isLoading} // Disable input during loading
              placeholder="Type your message..."
              style={{ flex: 1 }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
              })}
              disabled={!input.trim() || isLoading}
              style={{ marginLeft: "0.5rem" }}
              type="submit"
              variant="solid"
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}
