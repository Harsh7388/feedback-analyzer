import React, { useMemo, useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import {
  MessageSquare, Search, ChevronDown, ChevronUp, Star, Download,
  Filter, AlertTriangle, Shield, Zap, Globe,
} from 'lucide-react';
import { analyzeSentiment } from '../../utils/sentimentAnalysis';
import { detectSpam, detectUrgency, detectEmotion, detectLanguage } from '../../utils/aiEngine';

const URGENCY_COLORS = {
  critical: { bg: 'rgba(239,68,68,0.15)', text: '#f87171', border: 'rgba(239,68,68,0.3)', label: '🚨 Critical' },
  high: { bg: 'rgba(249,115,22,0.15)', text: '#fb923c', border: 'rgba(249,115,22,0.3)', label: '⚠️ High' },
  medium: { bg: 'rgba(234,179,8,0.15)', text: '#fbbf24', border: 'rgba(234,179,8,0.3)', label: '📢 Medium' },
  low: { bg: 'rgba(100,116,139,0.1)', text: '#94a3b8', border: 'rgba(100,116,139,0.2)', label: '✅ Low' },
};

const EMOTION_ICONS = { joy: '😄', satisfaction: '😊', frustration: '😤', anger: '😠', sadness: '😢', neutral: '😐' };

function FeedbackRow({ feedback, subjects, students, teachers }) {
  const [expanded, setExpanded] = useState(false);

  const subject = subjects.find(s => s.id === feedback.subjectId);
  const student = students.find(s => s.id === feedback.studentId);
  const teacher = teachers.find(t => t.id === (feedback.teacherId || subject?.teacherId));

  const comment = feedback.comment || (feedback.answers && feedback.answers.q9) || '';
  const sentiment = analyzeSentiment(comment);
  const spam = useMemo(() => detectSpam(comment), [comment]);
  const urgency = useMemo(() => detectUrgency(comment), [comment]);
  const emotion = useMemo(() => detectEmotion(comment), [comment]);
  const lang = useMemo(() => detectLanguage(comment), [comment]);

  const ratingEntries = feedback.ratings
    ? Object.values(feedback.ratings)
    : feedback.answers
    ? Object.entries(feedback.answers).filter(([k]) => k !== 'q9').map(([, v]) => v).filter(v => typeof v === 'number')
    : [];
  const avgRating = feedback.avgRating || (ratingEntries.length ? ratingEntries.reduce((a, b) => a + b, 0) / ratingEntries.length : 0);

  const urg = URGENCY_COLORS[urgency.level];

  return (
    <div style={{
      background: spam.isSpam
        ? 'rgba(100,116,139,0.06)'
        : urgency.level === 'critical' ? 'rgba(239,68,68,0.04)' : 'rgba(15,23,42,0.5)',
      border: urgency.level === 'critical'
        ? '1px solid rgba(239,68,68,0.3)'
        : spam.isSpam ? '1px solid rgba(100,116,139,0.15)' : '1px solid rgba(255,255,255,0.05)',
      borderRadius: '0.875rem', padding: '1rem', marginBottom: '0.625rem', transition: 'all 0.2s',
      opacity: spam.isSpam ? 0.65 : 1,
    }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badges row */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
            {subject && <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>{subject.code}</span>}
            <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>Sem {feedback.semester}</span>
            <span className={`badge badge-${sentiment.label === 'positive' ? 'positive' : sentiment.label === 'negative' ? 'negative' : 'neutral'}`} style={{ fontSize: '0.68rem' }}>
              {sentiment.emoji} {sentiment.label}
            </span>
            {urgency.level !== 'low' && (
              <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem', borderRadius: '0.3rem', background: urg.bg, color: urg.text, border: `1px solid ${urg.border}`, fontWeight: 700 }}>
                {urg.label}
              </span>
            )}
            {spam.isSpam && (
              <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem', borderRadius: '0.3rem', background: 'rgba(100,116,139,0.2)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.3)', fontWeight: 700 }}>
                🛡️ Spam
              </span>
            )}
            {lang.language !== 'english' && (
              <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem', borderRadius: '0.3rem', background: 'rgba(6,182,212,0.1)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.2)' }}>
                🌐 {lang.language}
              </span>
            )}
          </div>

          {/* Student + subject */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.88rem' }}>{student?.name || 'Anonymous'}</span>
            <span style={{ color: '#64748b', fontSize: '0.78rem' }}>→ {subject?.name || 'Unknown Subject'}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem' }}>
            {teacher?.name || 'N/A'} · {new Date(feedback.submittedAt).toLocaleDateString()}
            {comment && <span style={{ color: '#64748b', marginLeft: '0.5rem' }}>· {EMOTION_ICONS[emotion.dominant]} {emotion.dominant}</span>}
          </div>
          {comment && !expanded && (
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '500px', fontStyle: 'italic' }}>
              "{comment.slice(0, 100)}{comment.length > 100 ? '...' : ''}"
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Star size={14} color="#f59e0b" fill="#f59e0b" />
            <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>{avgRating.toFixed(1)}</span>
          </div>
          {expanded ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Full comment */}
          {comment && (
            <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '0.625rem', padding: '0.875rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: 600 }}>💬 Student Comment:</p>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.7, fontStyle: 'italic' }}>"{comment}"</p>
            </div>
          )}

          {/* AI Analysis */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {[
              { label: 'Sentiment', value: `${sentiment.emoji} ${sentiment.label}`, color: sentiment.label === 'positive' ? '#22c55e' : sentiment.label === 'negative' ? '#ef4444' : '#eab308' },
              { label: 'Emotion', value: `${EMOTION_ICONS[emotion.dominant]} ${emotion.dominant}`, color: '#8b5cf6' },
              { label: 'Urgency', value: urg.label, color: urg.text },
              { label: 'Spam Check', value: spam.isSpam ? '🛡️ Flagged' : '✅ Genuine', color: spam.isSpam ? '#94a3b8' : '#22c55e' },
              { label: 'Language', value: `🌐 ${lang.language}`, color: '#06b6d4' },
              { label: 'Confidence', value: `${sentiment.confidence}%`, color: '#f59e0b' },
            ].map(item => (
              <div key={item.label} style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.68rem', color: '#475569', marginBottom: '0.15rem', fontWeight: 600, textTransform: 'uppercase' }}>{item.label}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Individual ratings */}
          {(feedback.ratings || feedback.answers) && (() => {
            const ratingsObj = feedback.ratings || Object.fromEntries(
              Object.entries(feedback.answers || {}).filter(([k, v]) => k !== 'q9' && typeof v === 'number')
            );
            return Object.keys(ratingsObj).length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.4rem' }}>
                {Object.entries(ratingsObj).map(([qId, rating]) => (
                  <div key={qId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '0.4rem', padding: '0.35rem 0.6rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Q{qId.replace('q', '')}</span>
                    <div style={{ display: 'flex', gap: '1px' }}>
                      {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= rating ? '#f59e0b' : '#374151', fontSize: '0.72rem' }}>★</span>)}
                    </div>
                  </div>
                ))}
              </div>
            ) : null;
          })()}

          {/* Urgency triggers */}
          {urgency.triggers.length > 0 && (
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', marginRight: '0.3rem' }}>Triggered by:</span>
              {urgency.triggers.map((t, i) => (
                <span key={i} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', background: `${URGENCY_COLORS[t.severity]?.bg || 'rgba(239,68,68,0.1)'}`, color: URGENCY_COLORS[t.severity]?.text || '#f87171', borderRadius: '0.3rem' }}>
                  {t.keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminFeedbacks() {
  const { feedbacks, subjects, students, teachers } = useApp();
  const [search, setSearch] = useState('');
  const [semFilter, setSemFilter] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [hideSpam, setHideSpam] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const enrichedFeedbacks = useMemo(() => {
    return feedbacks.map(fb => {
      const comment = fb.comment || (fb.answers && fb.answers.q9) || '';
      return {
        ...fb,
        comment,
        _sentiment: analyzeSentiment(comment),
        _spam: detectSpam(comment),
        _urgency: detectUrgency(comment),
      };
    });
  }, [feedbacks]);

  const filtered = useMemo(() => {
    return enrichedFeedbacks.filter(f => {
      const student = students.find(s => s.id === f.studentId);
      const subject = subjects.find(s => s.id === f.subjectId);
      const s = search.toLowerCase();
      const matchSearch = !s || student?.name?.toLowerCase().includes(s) || subject?.name?.toLowerCase().includes(s) || f.comment?.toLowerCase().includes(s);
      const matchSem = !semFilter || f.semester === parseInt(semFilter);
      const matchSentiment = !sentimentFilter || f._sentiment.label === sentimentFilter;
      const matchUrgency = !urgencyFilter || f._urgency.level === urgencyFilter;
      const matchSpam = !hideSpam || !f._spam.isSpam;
      return matchSearch && matchSem && matchSentiment && matchUrgency && matchSpam;
    });
  }, [enrichedFeedbacks, search, semFilter, sentimentFilter, urgencyFilter, hideSpam, students, subjects]);

  // Stats
  const stats = useMemo(() => ({
    total: feedbacks.length,
    critical: enrichedFeedbacks.filter(f => f._urgency.level === 'critical').length,
    spam: enrichedFeedbacks.filter(f => f._spam.isSpam).length,
    positive: enrichedFeedbacks.filter(f => f._sentiment.label === 'positive').length,
  }), [enrichedFeedbacks, feedbacks]);

  const handleExportCSV = () => {
    const rows = [
      ['ID', 'Student', 'Subject', 'Semester', 'Rating', 'Sentiment', 'Urgency', 'Spam', 'Comment', 'Date'],
      ...filtered.map(f => {
        const student = students.find(s => s.id === f.studentId);
        const subject = subjects.find(s => s.id === f.subjectId);
        return [
          f.id, student?.name || 'Anonymous', subject?.name || 'Unknown',
          f.semester, (f.avgRating || 3).toFixed(1),
          f._sentiment.label, f._urgency.level, f._spam.isSpam ? 'Yes' : 'No',
          `"${(f.comment || '').replace(/"/g, "'')}"`,
          new Date(f.submittedAt).toLocaleDateString(),
        ];
      })
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedsense_feedbacks_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout title="All Feedbacks">
      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total', value: stats.total, color: '#6366f1', icon: '📋' },
          { label: 'Positive', value: stats.positive, color: '#22c55e', icon: '😊' },
          { label: 'Critical', value: stats.critical, color: '#ef4444', icon: '🚨' },
          { label: 'Spam', value: stats.spam, color: '#94a3b8', icon: '🛡️' },
        ].map(s => (
          <div key={s.label} style={{ padding: '0.75rem', background: `${s.color}0D`, borderRadius: '0.75rem', border: `1px solid ${s.color}25`, textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="input-field" placeholder="Search by student, subject or comment..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} aria-label="Search feedbacks" />
        </div>
        <button onClick={() => setShowFilters(v => !v)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 0.875rem', whiteSpace: 'nowrap' }}>
          <Filter size={14} /> Filters {showFilters ? '▲' : '▼'}
        </button>
        <button onClick={handleExportCSV} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 0.875rem', whiteSpace: 'nowrap' }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', padding: '0.875rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
          <select className="input-field" style={{ width: 'auto', minWidth: '130px', fontSize: '0.85rem' }} value={semFilter} onChange={e => setSemFilter(e.target.value)}>
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <select className="input-field" style={{ width: 'auto', minWidth: '140px', fontSize: '0.85rem' }} value={sentimentFilter} onChange={e => setSentimentFilter(e.target.value)}>
            <option value="">All Sentiments</option>
            <option value="positive">😄 Positive</option>
            <option value="neutral">😐 Neutral</option>
            <option value="negative">😞 Negative</option>
          </select>
          <select className="input-field" style={{ width: 'auto', minWidth: '140px', fontSize: '0.85rem' }} value={urgencyFilter} onChange={e => setUrgencyFilter(e.target.value)}>
            <option value="">All Urgency</option>
            <option value="critical">🚨 Critical</option>
            <option value="high">⚠️ High</option>
            <option value="medium">📢 Medium</option>
            <option value="low">✅ Low</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94a3b8', cursor: 'pointer' }}>
            <input type="checkbox" checked={hideSpam} onChange={e => setHideSpam(e.target.checked)} style={{ accentColor: '#6366f1' }} />
            Hide Spam
          </label>
          <button onClick={() => { setSearch(''); setSemFilter(''); setSentimentFilter(''); setUrgencyFilter(''); setHideSpam(false); }} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.82rem', cursor: 'pointer' }}>
            Clear filters
          </button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
          Showing <strong style={{ color: '#a5b4fc' }}>{filtered.length}</strong> of {feedbacks.length} feedbacks
          {stats.critical > 0 && <span style={{ color: '#f87171', marginLeft: '0.75rem', fontWeight: 700 }}>⚠️ {stats.critical} critical</span>}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No feedbacks found matching your filters</p>
        </div>
      ) : (
        filtered.map(fb => (
          <FeedbackRow key={fb.id} feedback={fb} subjects={subjects} students={students} teachers={teachers} />
        ))
      )}
    </DashboardLayout>
  );
}
