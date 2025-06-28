import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "katex/dist/katex.min.css";
import "./MainContent.css";

const COHERE_API_KEY = process.env.REACT_APP_KEY_COHERE;
const COHERE_CHAT_API_URL = process.env.REACT_APP_BASE_URL;

const MainContent = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        type: "text",
        text: "Chào mừng bạn đến với Gemini! Bạn có thể hỏi tôi bất cứ điều gì về lập trình, thiết kế, hoặc các chủ đề khác.",
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage = { sender: "user", type: "text", text: inputMessage };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      if (!COHERE_API_KEY) {
        throw new Error("Cohere API Key not found. Please set REACT_APP_COHERE_API_KEY in your .env file.");
      }

      const response = await fetch(COHERE_CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${COHERE_API_KEY}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: newUserMessage.text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = `Lỗi API Cohere: ${response.status} ${response.statusText}`;
        if (errorData?.message) errorMessage += ` - ${errorData.message}`;
        if (errorData?.detail) errorMessage += ` - ${errorData.detail}`;
        if (response.status === 401) errorMessage += "\nVui lòng kiểm tra lại API Key của bạn.";
        if (response.status === 429) errorMessage += "\nĐã vượt quá giới hạn tốc độ yêu cầu. Vui lòng thử lại sau.";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const aiResponseText = data.text || "Không có phản hồi nào từ AI.";
      const aiResponse = { sender: "ai", type: "text", text: aiResponseText };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", type: "text", text: `Đã có lỗi xảy ra: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading && inputMessage.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  function convertLatexDelimiters(text) {
    text = text.replace(/\\\[(.+?)\\\]/gs, (_, expr) => `$$\n${expr}\n$$`);
    text = text.replace(/\\\((.+?)\\\)/g, (_, expr) => `$${expr}$`);
    return text;
  }

  return (
    <main className="main-content">
      <header className="main-header">
        <div className="header-left">
          <div className="gemini-title-small">Gemini</div>
          <div className="version-selector">
            2.5 Flash <span className="arrow-down">▼</span>
          </div>
        </div>
        <div className="header-right">
          <button className="upgrade-button">
            <span className="star-icon">✨</span> Nâng cấp
          </button>
          <div className="user-avatar">
            <img src="https://via.placeholder.com/32/FF4081/FFFFFF?text=P" alt="User Avatar" />
          </div>
        </div>
      </header>

      <div className="content-body">
        <div className="chat-message-list">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.sender}`}>
              {msg.sender === "ai" && <div className="message-avatar ai-avatar">AI</div>}
              {msg.type === "text" && (
                <div className={`message-bubble ${msg.sender} markdown-math`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              )}
              {msg.sender === "user" && <div className="message-avatar user-avatar">Bạn</div>}
            </div>
          ))}
          {isLoading && (
            <div className="message-wrapper ai">
              <div className="message-avatar ai-avatar">AI</div>
              <div className="message-bubble ai typing-indicator">
                <p>AI đang gõ...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-input-area">
        <div className="input-row">
          <button className="input-action-button">+ </button>
          <textarea
            className="chat-input"
            placeholder="Gửi tin nhắn cho Gemini"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            disabled={isLoading}
          />
          <button className="send-button" onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
            ➤
          </button>
        </div>
        <div className="chat-footer-text">
          Gemini có thể mắc sai sót, vì vậy, hãy xác minh các câu trả lời của Gemini
        </div>
      </div>
    </main>
  );
};

export default MainContent;
