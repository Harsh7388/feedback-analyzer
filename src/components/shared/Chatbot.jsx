import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am the FeedSence AI Assistant. How can I help you understand our AI-ML based feedback system?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Simple mock responses based on keywords
    setTimeout(() => {
      let reply = 'I am an AI assistant. I can help answer queries about how FeedSence analyzes sentiments using Machine Learning.';
      const lower = input.toLowerCase();
      if (lower.includes('how') && lower.includes('work')) {
        reply = 'FeedSence collects student feedback and uses NLP (Natural Language Processing) to perform sentiment analysis, categorizing feedback into positive, neutral, or negative.';
      } else if (lower.includes('ai') || lower.includes('ml')) {
        reply = 'Our system leverages machine learning models to analyze textual feedback, extract keywords, and predict the overall sentiment without manual reading.';
      }
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
          zIndex: 9999,
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '320px',
          height: '450px',
          background: '#1e293b',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={20} />
              <span style={{ fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>FeedSence AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' ? '#6366f1' : 'rgba(255,255,255,0.05)',
                color: '#f1f5f9',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                maxWidth: '85%',
                fontSize: '0.85rem',
                lineHeight: 1.4,
                border: msg.sender === 'bot' ? '1px solid rgba(255,255,255,0.1)' : 'none'
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about FeedSence..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem',
                color: '#f1f5f9',
                fontSize: '0.85rem'
              }}
            />
            <button onClick={handleSend} style={{
              background: '#6366f1', border: 'none', borderRadius: '0.5rem', padding: '0.5rem', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
