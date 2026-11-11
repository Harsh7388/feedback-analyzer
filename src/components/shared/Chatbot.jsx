import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { aggregateFeedbacks } from '../../utils/sentimentAnalysis';
import { runFullAnalysis } from '../../utils/aiEngine';

// ─── AI Brain for Chatbot ──────────────────────────────────────────

function buildKnowledgeBase(feedbacks, teachers, subjects, students) {
  const totalFeedbacks = feedbacks.length;
  const allFbs = feedbacks.map(fb => ({
    ...fb,
    comment: fb.comment || (fb.answers && fb.answers.q9) || '',
    avgRating: fb.avgRating || 3,
  }));
  const globalAnalysis = aggregateFeedbacks(allFbs);
  const aiData = runFullAnalysis(allFbs);

  // Per-teacher stats
  const teacherStats = teachers.map(t => {
    const subIds = subjects.filter(s => s.teacherId === t.id).map(s => s.id);
    const tFbs = allFbs.filter(f => subIds.includes(f.subjectId));
    const analysis = aggregateFeedbacks(tFbs);
    return { ...t, analysis, feedbackCount: tFbs.length };
  }).sort((a, b) => b.analysis.avgRating - a.analysis.avgRating);

  const topTeacher = teacherStats.find(t => t.feedbackCount > 0);
  const bottomTeacher = [...teacherStats].reverse().find(t => t.feedbackCount > 0);

  return { totalFeedbacks, globalAnalysis, aiData, teacherStats, topTeacher, bottomTeacher };
}

function generateAIResponse(input, kb) {
  const lower = input.toLowerCase().trim();
  const { totalFeedbacks, globalAnalysis, aiData, teacherStats, topTeacher, bottomTeacher } = kb;

  // ─── Greeting ───────────────────────────────────────────────────
  if (/^(hi|hello|hey|hii|helo|namaste|sup|yo)\b/i.test(lower)) {
    return `👋 Hello! I'm **FeedSense AI**, your intelligent feedback assistant. I can answer questions about:\n\n• 📊 Overall feedback statistics\n• 👨‍🏫 Teacher performance analysis\n• 🧠 AI sentiment & emotion insights\n• 📈 Trends and predictions\n\nWhat would you like to know?`;
  }

  // ─── Total feedbacks ─────────────────────────────────────────────
  if (lower.includes('total') && (lower.includes('feedback') || lower.includes('submission'))) {
    return `📊 **Total Feedback Submissions**\n\nWe have collected **${totalFeedbacks}** feedback submissions so far.\n\n• ✅ Positive: ${globalAnalysis.positivePercent}%\n• 😐 Neutral: ${globalAnalysis.neutralPercent}%\n• ❌ Negative: ${globalAnalysis.negativePercent}%\n\nAverage Rating: **${globalAnalysis.avgRating}/5**`;
  }

  // ─── Sentiment ───────────────────────────────────────────────────
  if (lower.includes('sentiment') || lower.includes('overall') || lower.includes('feeling')) {
    return `🧠 **Overall Sentiment Analysis**\n\nThe general sentiment across all feedback is **${globalAnalysis.sentimentLabel}**.\n\n• Sentiment Score: ${(globalAnalysis.sentimentScore * 100).toFixed(0)}/100\n• Positive Responses: ${globalAnalysis.positivePercent}%\n• Negative Responses: ${globalAnalysis.negativePercent}%\n• Neutral Responses: ${globalAnalysis.neutralPercent}%\n\n${globalAnalysis.sentimentLabel === 'positive' ? '🎉 Great news! Students are largely satisfied.' : globalAnalysis.sentimentLabel === 'negative' ? '⚠️ Action needed — significant negative feedback detected.' : '📋 Mixed results — areas for improvement identified.'}`;
  }

  // ─── Emotion ─────────────────────────────────────────────────────
  if (lower.includes('emotion') || lower.includes('mood') || lower.includes('feeling')) {
    const em = aiData.emotion;
    const emojis = { joy: '😄', satisfaction: '😊', frustration: '😤', anger: '😠', sadness: '😢', neutral: '😐' };
    return `😊 **Emotion Detection Results**\n\nDominant emotion in student feedback: **${em.dominant}** ${emojis[em.dominant] || ''}\n\nEmotion breakdown:\n${Object.entries(em.emotions || {}).filter(([,v]) => v > 0).map(([k,v]) => `• ${emojis[k] || ''} ${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}%`).join('\n') || '• No significant emotion patterns detected'}`;
  }

  // ─── Best teacher ────────────────────────────────────────────────
  if (lower.includes('best') || lower.includes('top') || lower.includes('highest rated')) {
    if (!topTeacher || topTeacher.feedbackCount === 0) return 'No teacher feedback data available yet.';
    return `🏆 **Top Performing Teacher**\n\n**${topTeacher.name}** (${topTeacher.department})\n\n• ⭐ Average Rating: ${topTeacher.analysis.avgRating}/5\n• 📝 Total Feedbacks: ${topTeacher.feedbackCount}\n• 😊 Positive Rate: ${topTeacher.analysis.positivePercent}%\n• Overall Sentiment: ${topTeacher.analysis.sentimentLabel}\n\nCongratulations to ${topTeacher.name.split(' ')[0]} for excellent student feedback! 🎉`;
  }

  // ─── Worst/lowest teacher ────────────────────────────────────────
  if (lower.includes('worst') || lower.includes('lowest') || lower.includes('needs improvement') || lower.includes('poor')) {
    if (!bottomTeacher || bottomTeacher.feedbackCount === 0) return 'No teacher feedback data available yet.';
    return `📉 **Teacher Needing Attention**\n\n**${bottomTeacher.name}** (${bottomTeacher.department})\n\n• ⭐ Average Rating: ${bottomTeacher.analysis.avgRating}/5\n• 📝 Total Feedbacks: ${bottomTeacher.feedbackCount}\n• ❌ Negative Rate: ${bottomTeacher.analysis.negativePercent}%\n• Overall Sentiment: ${bottomTeacher.analysis.sentimentLabel}\n\n💡 Recommendation: Consider scheduling a performance review and providing teaching development support.`;
  }

  // ─── Specific teacher ────────────────────────────────────────────
  const teacherMatch = teacherStats.find(t => lower.includes(t.name.split(' ').slice(-1)[0].toLowerCase()) || lower.includes(t.name.toLowerCase().split(' ')[1] || ''));
  if (teacherMatch && teacherMatch.feedbackCount > 0) {
    return `👨‍🏫 **Performance: ${teacherMatch.name}**\n\n• Department: ${teacherMatch.department}\n• ⭐ Average Rating: ${teacherMatch.analysis.avgRating}/5\n• 📝 Total Feedbacks: ${teacherMatch.feedbackCount}\n• 😊 Positive: ${teacherMatch.analysis.positivePercent}%\n• 😐 Neutral: ${teacherMatch.analysis.neutralPercent}%\n• ❌ Negative: ${teacherMatch.analysis.negativePercent}%\n• Overall: ${teacherMatch.analysis.sentimentLabel}\n\n${teacherMatch.analysis.topKeywords?.slice(0,3).map(k => `🔑 "${k.word}"`).join(', ')}`;
  }

  // ─── Spam / urgency ──────────────────────────────────────────────
  if (lower.includes('spam') || lower.includes('filter') || lower.includes('invalid')) {
    return `🛡️ **Spam Detection Results**\n\n• ${aiData.spam.count} feedback(s) flagged as spam\n• Spam Rate: ${aiData.spam.percent}%\n• ${aiData.spam.count === 0 ? '✅ All submissions appear genuine!' : `⚠️ ${aiData.spam.count} low-quality submissions filtered from analytics.`}`;
  }

  if (lower.includes('urgent') || lower.includes('critical') || lower.includes('complaint')) {
    const urg = aiData.urgency;
    return `🚨 **Urgency Analysis**\n\n• 🔴 Critical: ${urg.critical} complaints\n• 🟠 High Priority: ${urg.high} complaints\n• 🟡 Medium: ${urg.medium} complaints\n• 🟢 Low: ${urg.low} complaints\n\n${urg.critical > 0 ? '⚠️ IMMEDIATE ACTION REQUIRED for critical complaints!' : urg.high > 0 ? '📢 High-priority items need attention soon.' : '✅ No critical issues detected.'}`;
  }

  // ─── Topics ──────────────────────────────────────────────────────
  if (lower.includes('topic') || lower.includes('theme') || lower.includes('issue')) {
    const topics = Object.entries(aiData.topics.topicDistribution || {}).sort((a,b) => b[1]-a[1]).slice(0,5);
    if (topics.length === 0) return 'No topic data available yet — need more text feedback.';
    return `📌 **Top Feedback Topics**\n\n${topics.map(([t,c], i) => `${i+1}. ${t}: **${c} mentions**`).join('\n')}\n\n💡 These are the most common themes students write about in their feedback.`;
  }

  // ─── Duplicate ───────────────────────────────────────────────────
  if (lower.includes('duplicate') || lower.includes('similar') || lower.includes('repeated')) {
    return `🔗 **Duplicate Detection**\n\n• ${aiData.duplicates.length} similar feedback pair(s) detected\n• Threshold: 80% similarity\n\n${aiData.duplicates.length === 0 ? '✅ No duplicates found — all feedback appears unique.' : `⚠️ ${aiData.duplicates.filter(d => d.isDuplicate).length} exact duplicates and ${aiData.duplicates.filter(d => !d.isDuplicate).length} highly-similar pairs found.`}`;
  }

  // ─── Ratings ─────────────────────────────────────────────────────
  if (lower.includes('rating') || lower.includes('score') || lower.includes('average')) {
    const dist = globalAnalysis.ratingDistribution;
    return `⭐ **Rating Distribution**\n\nOverall Average: **${globalAnalysis.avgRating}/5**\n\n${[5,4,3,2,1].map(r => `${'★'.repeat(r)}${'☆'.repeat(5-r)} (${r}): ${dist[r] || 0} feedbacks`).join('\n')}`;
  }

  // ─── Keywords ────────────────────────────────────────────────────
  if (lower.includes('keyword') || lower.includes('word') || lower.includes('mention')) {
    const kws = globalAnalysis.topKeywords || [];
    if (kws.length === 0) return 'No keyword data available yet.';
    return `🔑 **Most Mentioned Keywords**\n\n${kws.map(k => `• "${k.word}" — mentioned ${k.count}× (${k.sentiment})`).join('\n')}`;
  }

  // ─── Help ────────────────────────────────────────────────────────
  if (lower.includes('help') || lower.includes('what can') || lower.includes('what do') || lower === '?') {
    return `🤖 **FeedSense AI Assistant — Help**\n\nHere are things you can ask me:\n\n📊 **Data Queries:**\n• "How many total feedbacks?"\n• "What is the overall sentiment?"\n• "Show rating distribution"\n\n👨‍🏫 **Teacher Queries:**\n• "Who is the best teacher?"\n• "Show Dr. Ravi performance"\n• "Which teacher needs improvement?"\n\n🧠 **AI Features:**\n• "Show emotion analysis"\n• "What topics are common?"\n• "Any spam detected?"\n• "Critical complaints?"\n• "Any duplicate feedback?"\n\nJust type naturally and I'll understand! 🚀`;
  }

  // ─── Fallback ────────────────────────────────────────────────────
  return `🤖 I understand you're asking about "${input}". Try asking me about:\n\n• Total feedbacks or ratings\n• Teacher performance (e.g., "best teacher")\n• Sentiment or emotion analysis\n• Spam or urgency detection\n• Common topics or keywords\n\nType "help" to see all available queries!`;
}

// ─── Suggested Questions ────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  'What is the overall sentiment?',
  'Who is the best teacher?',
  'Show emotion analysis',
  'How many total feedbacks?',
  'Any critical complaints?',
  'What topics are common?',
];

export default function Chatbot() {
  const { feedbacks, teachers, subjects, students, isAdmin } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Hi! I\'m **FeedSense AI**.\n\nI can analyze your feedback data in real-time. Ask me about:\n• Overall sentiment & emotions\n• Teacher performance\n• Critical complaints\n• Topics & keywords\n\nType "help" for all commands!',
      time: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const getKnowledgeBase = useCallback(() => {
    return buildKnowledgeBase(feedbacks, teachers, subjects, students);
  }, [feedbacks, teachers, subjects, students]);

  const handleSend = (text) => {
    const msgText = text || input;
    if (!msgText.trim()) return;

    const userMsg = { sender: 'user', text: msgText, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const kb = getKnowledgeBase();
      const reply = generateAIResponse(msgText, kb);
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: reply, time: new Date() }]);
    }, 700 + Math.random() * 400);
  };

  const handleClear = () => {
    setMessages([{
      sender: 'bot',
      text: '🔄 Chat cleared! How can I help you with the feedback analysis?',
      time: new Date(),
    }]);
  };

  // Simple markdown-lite renderer
  const renderText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      return (
        <div key={i} style={{ marginBottom: line === '' ? '0.4rem' : '0.1rem' }}
          dangerouslySetInnerHTML={{ __html: bold || '&nbsp;' }}
        />
      );
    });
  };

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white', border: 'none', borderRadius: '50%',
          width: '56px', height: '56px',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
          zIndex: 9999, transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(99,102,241,0.6)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.5)'; }}
        aria-label="Open AI Chatbot"
        title="FeedSense AI Assistant"
      >
        <Sparkles size={22} />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: '340px', height: '520px',
          background: '#0f172a',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '1.25rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
          display: 'flex', flexDirection: 'column',
          zIndex: 9999, overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            padding: '0.875rem 1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            color: 'white',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: "'Space Grotesk', sans-serif" }}>FeedSense AI</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>● Online · Analyzing real data</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={handleClear} title="Clear chat" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '0.4rem', padding: '0.3rem', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Trash2 size={14} />
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '0.4rem', padding: '0.3rem', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '0.875rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', scrollbarWidth: 'thin' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '0.4rem',
              }}>
                {msg.sender === 'bot' && (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={12} color="#a5b4fc" />
                  </div>
                )}
                <div style={{
                  maxWidth: '82%',
                  background: msg.sender === 'user'
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'rgba(255,255,255,0.05)',
                  border: msg.sender === 'bot' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  color: '#f1f5f9',
                  padding: '0.6rem 0.875rem',
                  borderRadius: msg.sender === 'user' ? '1rem 1rem 0.2rem 1rem' : '1rem 1rem 1rem 0.2rem',
                  fontSize: '0.82rem',
                  lineHeight: 1.6,
                  wordBreak: 'break-word',
                }}>
                  {renderText(msg.text)}
                  <div style={{ fontSize: '0.62rem', opacity: 0.4, marginTop: '0.3rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                    {msg.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={12} color="#a5b4fc" />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '0.6rem 0.875rem', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#6366f1',
                      animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div style={{ padding: '0 0.875rem 0.5rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {SUGGESTED_QUESTIONS.slice(0, 4).map(q => (
                <button key={q} onClick={() => handleSend(q)} style={{
                  fontSize: '0.7rem', padding: '0.25rem 0.6rem',
                  background: 'rgba(99,102,241,0.12)', color: '#a5b4fc',
                  border: '1px solid rgba(99,102,241,0.25)', borderRadius: '1rem',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask about feedback data..."
              style={{
                flex: 1, background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.625rem', padding: '0.5rem 0.75rem',
                color: '#f1f5f9', fontSize: '0.82rem',
                outline: 'none', fontFamily: 'inherit',
              }}
              disabled={isTyping}
              aria-label="Chat input"
            />
            <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} style={{
              background: input.trim() && !isTyping ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
              border: 'none', borderRadius: '0.625rem', padding: '0.5rem 0.75rem',
              color: input.trim() && !isTyping ? 'white' : '#475569',
              cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}
