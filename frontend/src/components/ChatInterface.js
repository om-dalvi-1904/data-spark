import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ChatInterface.css';

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // Adjust speed as needed

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <>{displayedText}</>;
};

const ChatInterface = () => {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/chat/${sessionId}`, {
        message: userMessage.text
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { answer } = response.data;

      if (answer) {
        setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          text: answer,
          sender: 'bot',
          isNew: true // Flag to trigger typewriter effect only once
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error while processing your request.",
        sender: 'bot'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="ds-chat-interface">
      <div className="ds-chat-content">
        {messages.length === 0 ? (
          <div className="ds-welcome-container">
            <div className="ds-welcome-icon">👋</div>
            <h2 className="ds-welcome-title">Welcome to your session!</h2>
            <p className="ds-welcome-text">
              I'm ready to help you analyze your PDF. Ask me anything about the content.
            </p>
            <div className="ds-session-id">Session ID: {sessionId}</div>
          </div>
        ) : (
          <div className="ds-messages-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ds-message ${msg.sender === 'user' ? 'ds-message-user' : 'ds-message-bot'}`}
              >
                <div className="ds-message-bubble">
                  {msg.sender === 'bot' && msg.isNew ? (
                    <TypewriterText text={msg.text} />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="ds-message ds-message-bot">
                <div className="ds-message-bubble ds-typing-bubble">
                  <span className="ds-typing-dot"></span>
                  <span className="ds-typing-dot"></span>
                  <span className="ds-typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="ds-input-area">
        <form className="ds-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="ds-chat-input"
            placeholder="Type your question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
          />
          <button type="submit" className="ds-send-btn" disabled={!inputValue.trim() || isTyping}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
