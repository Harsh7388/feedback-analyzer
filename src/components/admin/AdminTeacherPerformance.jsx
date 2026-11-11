import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import {
  UserCheck, Brain, Star, TrendingUp, TrendingDown, Minus,
  ChevronDown, ChevronUp, Award, AlertTriangle, FileText,
  BarChart3, Download, Search, Filter,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import { aggregateFeedbacks } from '../../utils/sentimentAnalysis';
import {
  runFullAnalysis, generateRecommendations, aggregateAspects,
} from '../../utils/aiEngine';

const SENTIMENT_COLORS = {
  positive: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', text: '#4ade80', hex: '#22c55e' },
  neutral: { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', text: '#fbbf24', hex: '#eab308' },
  negative: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#f87171', hex: '#ef4444' },
};

const PRIORITY_CONFIG = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: '🚨 Critical' },
  high: { color: '#f97316', bg: 'rgba(249,115,22,0.1)', label: '⚠️ High' },
  medium: { color: '#eab308', bg: 'rgba(234,179,8,0.1)', label: '📢 Medium' },
  low: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', label: '✅ Low' },
};

function RatingBar({ value, max = 5, color }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color || '#6366f1', borderRadius: 4, transition: 'width 1s ease' }} />
      </div>
      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: color || '#f1f5f9', minWidth: 36 }}>
        {typeof value === 'number' ? value.toFixed(1) : value}
      </span>
    </div>
  );
}

function TeacherCard({ teacher, subjects, feedbacks, onSelect, isSelected }) {
  const teacherFbs = useMemo(() => {
    const subIds = subjects.filter(s => s.teacherId === teacher.id).map(s => s.id);
    return feedbacks.filter(f => subIds.includes(f.subjectId));
  }, [teacher, subjects, feedbacks]);

  const analysis = useMemo(() => aggregateFeedbacks(teacherFbs.map(fb => ({
    ...fb,
    comment: fb.comment || (fb.answers && fb.answers.q9) || '',
    avgRating: fb.avgRating || 3,
  }))), [teacherFbs]);

  const sentColor = SENTIMENT_COLORS[analysis.sentimentLabel] || SENTIMENT_COLORS.neutral;
  const ratingColor = analysis.avgRating >= 4 ? '#22c55e' : analysis.avgRating >= 3 ? '#eab308' : '#ef4444';

  const initials = teacher.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

  return (
    <div
      className="card"
      onClick={() => onSelect(teacher)}
      style={{
        cursor: 'pointer',
        border: isSelected ? '1.5px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.2s',
        boxShadow: isSelected ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1rem' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))',
          border: '1.5px solid rgba(99,102,241,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.95rem', fontWeight: 800, color: '#a5b4fc',
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.92rem', marginBottom: '0.15rem' }}>{teacher.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{teacher.department}</div>
        </div>
        <span style={{
          fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '0.4rem',
          background: sentColor.bg, color: sentColor.text, border: `1px solid ${sentColor.border}`,
          textTransform: 'capitalize', flexShrink: 0,
        }}>
          {analysis.sentimentLabel}
        </span>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.3rem', fontWeight: 600 }}>OVERALL RATING</div>
        <RatingBar value={analysis.avgRating} color={ratingColor} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
        <span style={{ color: '#4ade80', background: 'rgba(34,197,94,0.08)', padding: '0.2rem 0.5rem', borderRadius: '0.4rem' }}>+{analysis.positivePercent}%</span>
        <span style={{ color: '#fbbf24', background: 'rgba(234,179,8,0.08)', padding: '0.2rem 0.5rem', borderRadius: '0.4rem' }}>~{analysis.neutralPercent}%</span>
        <span style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', padding: '0.2rem 0.5rem', borderRadius: '0.4rem' }}>-{analysis.negativePercent}%</span>
        <span style={{ color: '#94a3b8', marginLeft: 'auto' }}>{teacherFbs.length} feedbacks</span>
      </div>
    </div>
  );
}

function TeacherDetailPanel({ teacher, subjects, feedbacks }) {
  const [activeSection, setActiveSection] = useState('overview');

  const teacherSubjects = subjects.filter(s => s.teacherId === teacher.id);
  const teacherFbs = useMemo(() => {
    const subIds = teacherSubjects.map(s => s.id);
    return feedbacks.filter(f => subIds.includes(f.subjectId)).map(fb => ({
      ...fb,
      comment: fb.comment || (fb.answers && fb.answers.q9) || '',
      avgRating: fb.avgRating || 3,
    }));
  }, [teacher, subjects, feedbacks]);

  const analysis = useMemo(() => aggregateFeedbacks(teacherFbs), [teacherFbs]);
  const aiData = useMemo(() => runFullAnalysis(teacherFbs), [teacherFbs]);
  const aspectAnalysis = useMemo(() => aggregateAspects(teacherFbs), [teacherFbs]);
  const recommendations = useMemo(
    () => generateRecommendations(teacher.name, analysis, aspectAnalysis, aiData.emotion),
    [teacher, analysis, aspectAnalysis, aiData]
  );

  const ratingColor = analysis.avgRating >= 4 ? '#22c55e' : analysis.avgRating >= 3 ? '#eab308' : '#ef4444';

  // Subject-wise performance
  const subjectPerformance = useMemo(() => {
    return teacherSubjects.map(sub => {
      const subFbs = teacherFbs.filter(f => f.subjectId === sub.id);
      const avg = subFbs.length > 0
        ? subFbs.reduce((s, f) => s + (f.avgRating || 3), 0) / subFbs.length
        : 0;
      return { name: sub.code, fullName: sub.name, sem: sub.semesterId, avg: Math.round(avg * 10) / 10, count: subFbs.length };
    }).filter(s => s.count > 0).sort((a, b) => b.avg - a.avg);
  }, [teacherSubjects, teacherFbs]);

  if (teacherFbs.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <Brain size={48} style={{ opacity: 0.2, marginBottom: '1rem', color: '#6366f1' }} />
        <p style={{ color: '#64748b' }}>No feedback data yet for {teacher.name}</p>
      </div>
    );
  }

  const handlePrint = () => {
    const content = `
TEACHER PERFORMANCE REPORT
===========================
Teacher: ${teacher.name}
Department: ${teacher.department}
Generated: ${new Date().toLocaleString()}

OVERALL PERFORMANCE
-------------------
Average Rating: ${analysis.avgRating}/5
Total Feedbacks: ${analysis.totalFeedbacks}
Overall Sentiment: ${analysis.sentimentLabel}
Positive: ${analysis.positivePercent}%
Neutral: ${analysis.neutralPercent}%
Negative: ${analysis.negativePercent}%

AI RECOMMENDATIONS
-------------------
${recommendations.recommendations.map(r => `[${r.priority.toUpperCase()}] ${r.category}\n${r.suggestion}\nAction: ${r.action}`).join('\n\n')}

STRENGTHS
-------------------
${recommendations.strengths.join('\n')}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${teacher.name.replace(/\s+/g, '_')}_Performance_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sections = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'ai', label: '🤖 AI Report' },
    { id: 'subjects', label: '📚 Subjects' },
  ];

  return (
    <div className="card" style={{ borderColor: 'rgba(99,102,241,0.3)' }}>
      {/* Teacher Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem' }}>
            {teacher.name}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            {teacher.department} · {teacherSubjects.length} subjects · {teacherFbs.length} feedbacks
          </p>
        </div>
        <button onClick={handlePrint} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', padding: '0.5rem 0.875rem' }}>
          <Download size={14} /> Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Avg Rating', value: `${analysis.avgRating}/5`, color: ratingColor },
          { label: 'Feedbacks', value: analysis.totalFeedbacks, color: '#6366f1' },
          { label: 'Positive', value: `${analysis.positivePercent}%`, color: '#22c55e' },
          { label: 'Negative', value: `${analysis.negativePercent}%`, color: '#ef4444' },
          { label: 'AI Confidence', value: `${aiData.confidence}%`, color: '#8b5cf6' },
        ].map(m => (
          <div key={m.label} style={{ textAlign: 'center', padding: '0.75rem', background: `${m.color}10`, borderRadius: '0.75rem', border: `1px solid ${m.color}25` }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: m.color, fontFamily: "'Space Grotesk', sans-serif" }}>{m.value}</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', padding: '0.3rem', width: 'fit-content' }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            padding: '0.4rem 0.875rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
            background: activeSection === s.id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
            color: activeSection === s.id ? 'white' : '#64748b', transition: 'all 0.2s',
          }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeSection === 'overview' && (
        <div>
          {/* Sentiment Bar */}
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: 600 }}>SENTIMENT BREAKDOWN</p>
            <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', gap: 2 }}>
              <div style={{ width: `${analysis.positivePercent}%`, background: '#22c55e' }} title={`Positive: ${analysis.positivePercent}%`} />
              <div style={{ width: `${analysis.neutralPercent}%`, background: '#eab308' }} title={`Neutral: ${analysis.neutralPercent}%`} />
              <div style={{ width: `${analysis.negativePercent}%`, background: '#ef4444' }} title={`Negative: ${analysis.negativePercent}%`} />
            </div>
          </div>

          {/* Aspect Analysis */}
          {Object.keys(aspectAnalysis).length > 0 && (
            <div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.6rem', fontWeight: 600 }}>ASPECT-BASED ANALYSIS</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {Object.entries(aspectAnalysis).map(([aspect, data]) => {
                  const scoreColor = data.sentiment === 'positive' ? '#22c55e' : data.sentiment === 'negative' ? '#ef4444' : '#eab308';
                  return (
                    <div key={aspect} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'capitalize', minWidth: 90 }}>{aspect}</span>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.max(0, 50 + data.score * 50)}%`, background: scoreColor, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: scoreColor, fontWeight: 700, minWidth: 55 }}>
                        {data.sentiment} ({data.mentions})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top Keywords */}
          {analysis.topKeywords?.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>TOP KEYWORDS</p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {analysis.topKeywords.map(({ word, count, sentiment }) => {
                  const col = sentiment === 'positive' ? '#22c55e' : sentiment === 'negative' ? '#ef4444' : '#94a3b8';
                  return (
                    <span key={word} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: `${col}15`, color: col, borderRadius: '0.4rem', border: `1px solid ${col}30` }}>
                      {word} ×{count}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Report */}
      {activeSection === 'ai' && (
        <div>
          {/* Strengths */}
          {recommendations.strengths.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: 700, marginBottom: '0.6rem' }}>✅ STRENGTHS</p>
              {recommendations.strengths.map((s, i) => (
                <div key={i} style={{ padding: '0.6rem 0.875rem', background: 'rgba(34,197,94,0.06)', borderLeft: '2px solid #22c55e', borderRadius: '0 0.5rem 0.5rem 0', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {s}
                </div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.6rem' }}>💡 IMPROVEMENT RECOMMENDATIONS</p>
          {recommendations.recommendations.map((rec, i) => {
            const cfg = PRIORITY_CONFIG[rec.priority] || PRIORITY_CONFIG.low;
            return (
              <div key={i} style={{ marginBottom: '0.875rem', padding: '0.875rem', background: cfg.bg, borderRadius: '0.75rem', border: `1px solid ${cfg.color}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '0.3rem' }}>{rec.category}</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.4rem', lineHeight: 1.5 }}>{rec.suggestion}</p>
                <p style={{ color: '#64748b', fontSize: '0.78rem', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <span style={{ color: '#6366f1', fontWeight: 700, flexShrink: 0 }}>ACTION:</span>
                  {rec.action}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Subjects */}
      {activeSection === 'subjects' && (
        <div>
          {subjectPerformance.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={subjectPerformance} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.75rem', fontSize: '0.82rem' }} />
                  <Bar dataKey="avg" name="Avg Rating" radius={[4, 4, 0, 0]}>
                    {subjectPerformance.map((s, i) => <Cell key={i} fill={s.avg >= 4 ? '#22c55e' : s.avg >= 3 ? '#eab308' : '#ef4444'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                {subjectPerformance.map(sub => (
                  <div key={sub.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f1f5f9' }}>{sub.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.5rem' }}>{sub.fullName} · Sem {sub.sem}</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: sub.avg >= 4 ? '#22c55e' : sub.avg >= 3 ? '#eab308' : '#ef4444' }}>
                      ★ {sub.avg}/5 ({sub.count})
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No subject-wise data available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminTeacherPerformance() {
  const { teachers, subjects, feedbacks } = useApp();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const teacherStats = useMemo(() => {
    return teachers.map(t => {
      const subIds = subjects.filter(s => s.teacherId === t.id).map(s => s.id);
      const tFbs = feedbacks.filter(f => subIds.includes(f.subjectId)).map(fb => ({
        ...fb,
        avgRating: fb.avgRating || 3,
        comment: fb.comment || (fb.answers && fb.answers.q9) || '',
      }));
      const analysis = aggregateFeedbacks(tFbs);
      return { ...t, analysis, feedbackCount: tFbs.length };
    });
  }, [teachers, subjects, feedbacks]);

  const filtered = useMemo(() => {
    let list = teacherStats.filter(t =>
      !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.department?.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.analysis.avgRating - a.analysis.avgRating);
    else if (sortBy === 'feedbacks') list = [...list].sort((a, b) => b.feedbackCount - a.feedbackCount);
    else if (sortBy === 'positive') list = [...list].sort((a, b) => b.analysis.positivePercent - a.analysis.positivePercent);
    return list;
  }, [teacherStats, search, sortBy]);

  // Semester-wise comparison data
  const semesterComparison = useMemo(() => {
    const semData = {};
    subjects.forEach(sub => {
      const sem = sub.semesterId;
      const teacher = teachers.find(t => t.id === sub.teacherId);
      if (!teacher) return;
      const subFbs = feedbacks.filter(f => f.subjectId === sub.id).map(fb => ({ ...fb, avgRating: fb.avgRating || 3 }));
      if (subFbs.length === 0) return;

      if (!semData[sem]) semData[sem] = { feedbacks: 0, totalRating: 0, count: 0 };
      semData[sem].feedbacks += subFbs.length;
      semData[sem].totalRating += subFbs.reduce((s, f) => s + f.avgRating, 0);
      semData[sem].count += subFbs.length;
    });

    return Object.entries(semData)
      .map(([sem, d]) => ({ semester: `Sem ${sem}`, avgRating: Math.round((d.totalRating / d.count) * 10) / 10, feedbacks: d.feedbacks }))
      .sort((a, b) => a.semester.localeCompare(b.semester));
  }, [subjects, teachers, feedbacks]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.82rem' }}>
          <p style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: '0.3rem' }}>{label}</p>
          {payload.map(p => <p key={p.name} style={{ color: p.color || '#a5b4fc' }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</p>)}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout title="Teacher Performance Analytics">
      {/* Semester Comparison Chart */}
      {semesterComparison.length > 0 && (
        <div className="card anim-fade-up" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <BarChart3 size={18} color="#6366f1" />
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
              Semester-wise Performance Comparison
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={semesterComparison} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="semester" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgRating" name="Avg Rating" radius={[4, 4, 0, 0]}>
                {semesterComparison.map((d, i) => (
                  <Cell key={i} fill={d.avgRating >= 4 ? '#22c55e' : d.avgRating >= 3 ? '#eab308' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selectedTeacher ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Left: Teacher List */}
        <div>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input className="input-field" placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }} />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field" style={{ maxWidth: '150px', fontSize: '0.85rem' }}>
              <option value="rating">Sort: Rating</option>
              <option value="feedbacks">Sort: Feedbacks</option>
              <option value="positive">Sort: Positive%</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map(t => (
              <TeacherCard
                key={t.id}
                teacher={t}
                subjects={subjects}
                feedbacks={feedbacks}
                onSelect={setSelectedTeacher}
                isSelected={selectedTeacher?.id === t.id}
              />
            ))}
            {filtered.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                <UserCheck size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No teachers found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Detail Panel */}
        {selectedTeacher && (
          <div>
            <div style={{ position: 'sticky', top: '1rem' }}>
              <TeacherDetailPanel
                teacher={selectedTeacher}
                subjects={subjects}
                feedbacks={feedbacks}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

