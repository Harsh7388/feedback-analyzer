import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import { Brain, TrendingUp, Star, MessageSquare, Search, Filter } from 'lucide-react';
import { aggregateFeedbacks, getSentimentColor } from '../../utils/sentimentAnalysis';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';

function SentimentCard({ label, analysis, color }) {
  const sc = getSentimentColor(analysis.sentimentLabel);
  return (
    <div className="card" style={{ borderColor: `${color}25` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
        <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', flex: 1, lineHeight: 1.3 }}>{label}</h4>
        <span className={`badge badge-${analysis.sentimentLabel === 'positive' ? 'positive' : analysis.sentimentLabel === 'negative' ? 'negative' : 'neutral'}`} style={{ flexShrink: 0, marginLeft: '0.5rem' }}>
          {analysis.sentimentLabel}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
            {analysis.avgRating > 0 ? analysis.avgRating.toFixed(1) : 'N/A'}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Avg Rating</div>
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
            {analysis.totalFeedbacks}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Feedbacks</div>
        </div>
      </div>

      {/* Mini sentiment bar */}
      <div style={{ display: 'flex', gap: '2px', height: 6, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${analysis.positivePercent}%`, background: '#22c55e', transition: 'width 1s ease' }} />
        <div style={{ width: `${analysis.neutralPercent}%`, background: '#eab308' }} />
        <div style={{ width: `${analysis.negativePercent}%`, background: '#ef4444' }} />
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem', fontSize: '0.7rem', color: '#64748b' }}>
        <span style={{ color: '#4ade80' }}>+{analysis.positivePercent}%</span>
        <span style={{ color: '#fbbf24' }}>~{analysis.neutralPercent}%</span>
        <span style={{ color: '#f87171' }}>-{analysis.negativePercent}%</span>
      </div>
    </div>
  );
}

export default function AdminSentiment() {
  const { subjects, teachers, feedbacks } = useApp();
  const [tab, setTab] = useState('subject');
  const [search, setSearch] = useState('');

  // Subject-wise analysis
  const subjectAnalysis = useMemo(() => {
    return subjects.map(sub => {
      const subFeedbacks = feedbacks.filter(f => f.subjectId === sub.id);
      const teacher = teachers.find(t => t.id === sub.teacherId);
      return {
        ...sub,
        teacher,
        analysis: aggregateFeedbacks(subFeedbacks),
        feedbacks: subFeedbacks,
      };
    }).filter(s => s.analysis.totalFeedbacks > 0 || true).sort((a, b) => b.analysis.totalFeedbacks - a.analysis.totalFeedbacks);
  }, [subjects, teachers, feedbacks]);

  // Teacher-wise analysis
  const teacherAnalysis = useMemo(() => {
    return teachers.map(t => {
      const teacherSubjects = subjects.filter(s => s.teacherId === t.id);
      const teacherFeedbacks = feedbacks.filter(f => teacherSubjects.some(s => s.id === f.subjectId));
      return {
        ...t,
        subjects: teacherSubjects,
        analysis: aggregateFeedbacks(teacherFeedbacks),
        feedbacks: teacherFeedbacks,
      };
    }).filter(t => t.analysis.totalFeedbacks > 0 || true).sort((a, b) => b.analysis.totalFeedbacks - a.analysis.totalFeedbacks);
  }, [teachers, subjects, feedbacks]);

  // Semester-wise analysis
  const semesterAnalysis = useMemo(() => {
    const sems = {};
    feedbacks.forEach(f => {
      const sem = f.semester || 1;
      if (!sems[sem]) sems[sem] = [];
      sems[sem].push(f);
    });
    
    return Object.keys(sems).map(sem => ({
      id: `sem-${sem}`,
      name: `Semester ${sem}`,
      analysis: aggregateFeedbacks(sems[sem]),
      feedbacks: sems[sem]
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [feedbacks]);

  let filtered = [];
  if (tab === 'subject') {
    filtered = subjectAnalysis.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.code?.toLowerCase().includes(search.toLowerCase()));
  } else if (tab === 'teacher') {
    filtered = teacherAnalysis.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  } else {
    filtered = semesterAnalysis.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  }

  // Top/Bottom performers for chart
  const chartData = tab === 'subject'
    ? subjectAnalysis.filter(s => s.analysis.totalFeedbacks > 0).slice(0, 8).map(s => ({
        name: s.code || s.name.slice(0, 10),
        avgRating: s.analysis.avgRating,
        feedbacks: s.analysis.totalFeedbacks,
        positive: s.analysis.positivePercent,
      }))
    : tab === 'teacher'
    ? teacherAnalysis.filter(t => t.analysis.totalFeedbacks > 0).slice(0, 8).map(t => ({
        name: t.name.split(' ').slice(-1)[0],
        avgRating: t.analysis.avgRating,
        feedbacks: t.analysis.totalFeedbacks,
        positive: t.analysis.positivePercent,
      }))
    : semesterAnalysis.map(s => ({
        name: s.name,
        avgRating: s.analysis.avgRating,
        feedbacks: s.analysis.totalFeedbacks,
        positive: s.analysis.positivePercent,
      }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
          <p style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: '0.35rem' }}>{label}</p>
          {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}{p.name === 'positive' ? '%' : ''}</p>)}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout title="Sentiment Analysis">
      {/* Tab Switch */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', padding: '0.35rem', width: 'fit-content', flexWrap: 'wrap' }}>
        {['subject', 'teacher', 'semester'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer',
              background: tab === t ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
              color: tab === t ? 'white' : '#64748b', fontWeight: 600, fontSize: '0.9rem',
              transition: 'all 0.2s', boxShadow: tab === t ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
            }}
          >
            {t === 'subject' ? '📚 Subject-wise' : t === 'teacher' ? '👨‍🏫 Teacher-wise' : '📅 Semester-wise'}
          </button>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="card anim-fade-up" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem', textTransform: 'capitalize' }}>
            Average Rating by {tab}
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgRating" name="avgRating" radius={[4, 4, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.avgRating >= 4 ? '#22c55e' : d.avgRating >= 3 ? '#eab308' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
        <input
          className="input-field"
          placeholder={`Search ${tab}s...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
          aria-label="Search"
        />
      </div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map((item, i) => (
          <div key={item.id} className={`anim-fade-up delay-${(i % 5 + 1) * 100}`}>
            <SentimentCard
              label={tab === 'subject' ? `${item.code}: ${item.name}` : item.name}
              analysis={item.analysis}
              color={tab === 'subject' ? '#6366f1' : tab === 'teacher' ? '#06b6d4' : '#8b5cf6'}
            />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <Brain size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No results found</p>
        </div>
      )}
    </DashboardLayout>
  );
}
