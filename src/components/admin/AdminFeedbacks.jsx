import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import { MessageSquare, Search, ChevronDown, ChevronUp, Star, Eye } from 'lucide-react';
import { analyzeSentiment } from '../../utils/sentimentAnalysis';

function FeedbackRow({ feedback, subjects, students, teachers }) {
  const [expanded, setExpanded] = useState(false);
  const subject = subjects.find(s => s.id === feedback.subjectId);
  const student = students.find(s => s.id === feedback.studentId);
  const teacher = teachers.find(t => t.id === feedback.teacherId);
  const sentiment = analyzeSentiment(feedback.comment || '');

  const ratingEntries = feedback.ratings ? Object.values(feedback.ratings) : [];
  const avgRating = feedback.avgRating || (ratingEntries.length ? ratingEntries.reduce((a, b) => a + b, 0) / ratingEntries.length : 0);

  return (
    <div style={{
      background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '0.875rem', padding: '1rem', marginBottom: '0.625rem', transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', cursor: 'pointer' }} onClick={() => setExpanded(e => !e)}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>{subject?.code || 'N/A'}</span>
            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>Sem {feedback.semester}</span>
            <span className={`badge badge-${sentiment.label === 'positive' ? 'positive' : sentiment.label === 'negative' ? 'negative' : 'neutral'}`} style={{ fontSize: '0.7rem' }}>
              {sentiment.emoji} {sentiment.label}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>{student?.name || 'Unknown'}</span>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>→</span>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{subject?.name}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.25rem' }}>
            Teacher: {teacher?.name || 'N/A'} · {new Date(feedback.submittedAt).toLocaleDateString()}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Star size={14} color="#f59e0b" fill="#f59e0b" />
            <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>{avgRating.toFixed(1)}</span>
          </div>
          {expanded ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', animation: 'fadeInUp 0.3s ease' }}>
          {feedback.comment && (
            <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '0.625rem', padding: '0.75rem', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 600 }}>💬 Comment:</p>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>{feedback.comment}</p>
            </div>
          )}

          {feedback.ratings && Object.keys(feedback.ratings).length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
              {Object.entries(feedback.ratings).map(([qId, rating]) => (
                <div key={qId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', padding: '0.4rem 0.625rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Q{qId.replace('q', '')}</span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} style={{ color: s <= rating ? '#f59e0b' : '#374151', fontSize: '0.75rem' }}>★</span>
                    ))}
                  </div>
                </div>
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

  const filtered = useMemo(() => {
    return feedbacks.filter(f => {
      const student = students.find(s => s.id === f.studentId);
      const subject = subjects.find(s => s.id === f.subjectId);
      const s = search.toLowerCase();
      const matchSearch = !s || student?.name?.toLowerCase().includes(s) || subject?.name?.toLowerCase().includes(s) || f.comment?.toLowerCase().includes(s);
      const matchSem = !semFilter || f.semester === parseInt(semFilter);
      const sentiment = analyzeSentiment(f.comment || '');
      const matchSentiment = !sentimentFilter || sentiment.label === sentimentFilter;
      return matchSearch && matchSem && matchSentiment;
    });
  }, [feedbacks, search, semFilter, sentimentFilter, students, subjects]);

  return (
    <DashboardLayout title="All Feedbacks">
      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="input-field" placeholder="Search by student, subject or comment..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} aria-label="Search feedbacks" />
        </div>
        <select className="input-field" style={{ width: 'auto', minWidth: '130px' }} value={semFilter} onChange={e => setSemFilter(e.target.value)} aria-label="Filter by semester">
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>
        <select className="input-field" style={{ width: 'auto', minWidth: '140px' }} value={sentimentFilter} onChange={e => setSentimentFilter(e.target.value)} aria-label="Filter by sentiment">
          <option value="">All Sentiments</option>
          <option value="positive">😄 Positive</option>
          <option value="neutral">😐 Neutral</option>
          <option value="negative">😞 Negative</option>
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
          Showing <strong style={{ color: '#a5b4fc' }}>{filtered.length}</strong> of {feedbacks.length} feedbacks
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No feedbacks found</p>
        </div>
      ) : (
        filtered.map(fb => (
          <FeedbackRow key={fb.id} feedback={fb} subjects={subjects} students={students} teachers={teachers} />
        ))
      )}
    </DashboardLayout>
  );
}
