import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import {
  Brain, Zap, AlertTriangle, Shield, Copy, Globe, Hash,
  TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp,
  MessageSquare, Smile, Frown, Meh, Angry, Heart
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, LineChart, Line, Legend,
} from 'recharts';
import { runFullAnalysis, analyzeTrends } from '../../utils/aiEngine';

const COLORS = ['#6366f1', '#22c55e', '#eab308', '#ef4444', '#06b6d4', '#8b5cf6', '#f97316', '#ec4899'];

const EMOTION_CONFIG = {
  joy: { icon: '😄', color: '#22c55e', label: 'Joy' },
  satisfaction: { icon: '😊', color: '#6366f1', label: 'Satisfaction' },
  frustration: { icon: '😤', color: '#f97316', label: 'Frustration' },
  anger: { icon: '😠', color: '#ef4444', label: 'Anger' },
  sadness: { icon: '😢', color: '#06b6d4', label: 'Sadness' },
};

const URGENCY_CONFIG = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Critical', icon: '🚨' },
  high: { color: '#f97316', bg: 'rgba(249,115,22,0.1)', label: 'High', icon: '⚠️' },
  medium: { color: '#eab308', bg: 'rgba(234,179,8,0.1)', label: 'Medium', icon: '📢' },
  low: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', label: 'Low', icon: '✅' },
};

function StatCard({ icon, label, value, sub, color, badge }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>{icon}</span>
          <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</span>
        </div>
        {badge && (
          <span style={{
            fontSize: '0.68rem', padding: '0.2rem 0.5rem', borderRadius: '0.4rem',
            background: `${color}20`, color, fontWeight: 700, border: `1px solid ${color}40`,
          }}>{badge}</span>
        )}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: color || '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f1f5f9', fontSize: '1.05rem', margin: 0 }}>{title}</h3>
      </div>
      {subtitle && <p style={{ color: '#64748b', fontSize: '0.82rem', marginLeft: '1.7rem' }}>{subtitle}</p>}
    </div>
  );
}

function ConfidenceBadge({ score }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';
  return (
    <span style={{
      fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '1rem',
      background: `${color}20`, color, fontWeight: 700,
      border: `1px solid ${color}40`, display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    }}>
      🎯 {score}% confidence
    </span>
  );
}

export default function AdminAIInsights() {
  const { feedbacks, teachers, subjects } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [expandedUrgent, setExpandedUrgent] = useState(false);

  // Filter feedbacks
  const filteredFeedbacks = useMemo(() => {
    if (selectedTeacher === 'all') return feedbacks;
    const teacherSubjectIds = subjects
      .filter(s => s.teacherId === selectedTeacher)
      .map(s => s.id);
    return feedbacks.filter(f => teacherSubjectIds.includes(f.subjectId));
  }, [feedbacks, selectedTeacher, subjects]);

  // Run full AI analysis
  const aiAnalysis = useMemo(() => {
    const fbs = filteredFeedbacks.map(fb => ({
      ...fb,
      comment: fb.comment || (fb.answers && fb.answers.q9) || '',
      text: fb.comment || (fb.answers && fb.answers.q9) || '',
      avgRating: fb.avgRating || (fb.answers
        ? Object.entries(fb.answers)
            .filter(([k]) => k !== 'q9')
            .reduce((sum, [, v]) => sum + (typeof v === 'number' ? v : 0), 0)
          / (Object.keys(fb.answers).length - 1)
        : 3),
    }));
    return runFullAnalysis(fbs);
  }, [filteredFeedbacks]);

  const trendData = useMemo(() => analyzeTrends(filteredFeedbacks), [filteredFeedbacks]);

  // Emotion pie data
  const emotionData = useMemo(() => {
    return Object.entries(aiAnalysis.emotion.emotions || {})
      .filter(([, v]) => v > 0)
      .map(([emotion, value]) => ({
        name: EMOTION_CONFIG[emotion]?.label || emotion,
        value,
        color: EMOTION_CONFIG[emotion]?.color || '#6366f1',
        icon: EMOTION_CONFIG[emotion]?.icon || '😶',
      }));
  }, [aiAnalysis]);

  // Aspect radar data
  const aspectRadarData = useMemo(() => {
    return Object.entries(aiAnalysis.aspects).map(([aspect, data]) => ({
      aspect: aspect.charAt(0).toUpperCase() + aspect.slice(1),
      score: Math.max(0, 50 + data.score * 50),
    }));
  }, [aiAnalysis]);

  // Topic bar data
  const topicData = useMemo(() => {
    return Object.entries(aiAnalysis.topics.topicDistribution || {})
      .sort((a, b) => b[1] - a[1])
      .map(([topic, count]) => ({ topic: topic.length > 18 ? topic.slice(0, 18) + '…' : topic, count, fullTopic: topic }));
  }, [aiAnalysis]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
          <p style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: '0.3rem' }}>{label}</p>
          {payload.map(p => <p key={p.name} style={{ color: p.color || '#a5b4fc' }}>{p.name}: {p.value}</p>)}
        </div>
      );
    }
    return null;
  };

  const tabs = [
    { id: 'overview', label: '🧠 AI Overview' },
    { id: 'emotions', label: '😊 Emotions' },
    { id: 'aspects', label: '🎯 Aspects' },
    { id: 'topics', label: '📌 Topics' },
    { id: 'alerts', label: '🚨 Alerts' },
    { id: 'trends', label: '📈 Trends' },
  ];

  if (feedbacks.length === 0) {
    return (
      <DashboardLayout title="AI Intelligence Dashboard">
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Brain size={56} style={{ opacity: 0.2, marginBottom: '1rem', color: '#6366f1' }} />
          <h3 style={{ color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '0.5rem' }}>No Data to Analyze</h3>
          <p style={{ color: '#64748b' }}>Collect student feedback to enable AI-powered analysis.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="AI Intelligence Dashboard">
      {/* Header Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '0.75rem',
            padding: '0.5rem 1rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.85rem', color: '#a5b4fc',
          }}>
            <Brain size={16} />
            <span>Analyzing <strong style={{ color: '#f1f5f9' }}>{aiAnalysis.totalFeedbacks}</strong> feedbacks</span>
            <ConfidenceBadge score={aiAnalysis.confidence} />
          </div>
        </div>
        <select
          value={selectedTeacher}
          onChange={e => setSelectedTeacher(e.target.value)}
          className="input-field"
          style={{ maxWidth: '220px', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <option value="all">All Teachers</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard icon="🧠" label="Dominant Emotion" value={EMOTION_CONFIG[aiAnalysis.emotion.dominant]?.icon || '😐'}
          sub={`${EMOTION_CONFIG[aiAnalysis.emotion.dominant]?.label || 'Neutral'} mood`}
          color={EMOTION_CONFIG[aiAnalysis.emotion.dominant]?.color || '#94a3b8'} />
        <StatCard icon="🚨" label="Critical Alerts" value={aiAnalysis.urgency.critical + aiAnalysis.urgency.high}
          sub="Urgent complaints" color="#ef4444" badge={aiAnalysis.urgency.critical > 0 ? 'ACTION NEEDED' : null} />
        <StatCard icon="🛡️" label="Spam Filtered" value={`${aiAnalysis.spam.percent}%`}
          sub={`${aiAnalysis.spam.count} flagged`} color="#8b5cf6" />
        <StatCard icon="📋" label="Topics Found" value={Object.keys(aiAnalysis.topics.topicDistribution || {}).length}
          sub="Unique categories" color="#06b6d4" />
        <StatCard icon="🔗" label="Duplicates" value={aiAnalysis.duplicates.length}
          sub="Similar feedbacks" color="#f97316" />
        <StatCard icon="🌐" label="Languages" value={Object.entries(aiAnalysis.languages || {}).filter(([,v]) => v > 0).length}
          sub="Language types" color="#22c55e" />
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', padding: '0.35rem', width: 'fit-content' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '0.45rem 0.9rem', borderRadius: '0.6rem', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
            background: activeTab === tab.id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
            color: activeTab === tab.id ? 'white' : '#64748b',
            transition: 'all 0.2s',
            boxShadow: activeTab === tab.id ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ───────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* AI Summary */}
          {aiAnalysis.summary && (
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))' }}>
              <SectionHeader icon="📝" title="AI-Generated Summary" subtitle="Extractive analysis of all feedback comments" />
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                {aiAnalysis.summary.summary}
              </p>
              {aiAnalysis.summary.positivePoints.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: 700, marginBottom: '0.5rem' }}>✅ KEY STRENGTHS</p>
                  {aiAnalysis.summary.positivePoints.map((p, i) => (
                    <div key={i} style={{ fontSize: '0.85rem', color: '#94a3b8', padding: '0.4rem 0.75rem', background: 'rgba(34,197,94,0.06)', borderLeft: '2px solid #22c55e', borderRadius: '0 0.4rem 0.4rem 0', marginBottom: '0.4rem' }}>
                      "{p}"
                    </div>
                  ))}
                </div>
              )}
              {aiAnalysis.summary.negativePoints.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 700, marginBottom: '0.5rem' }}>⚠️ AREAS FOR IMPROVEMENT</p>
                  {aiAnalysis.summary.negativePoints.map((p, i) => (
                    <div key={i} style={{ fontSize: '0.85rem', color: '#94a3b8', padding: '0.4rem 0.75rem', background: 'rgba(239,68,68,0.06)', borderLeft: '2px solid #ef4444', borderRadius: '0 0.4rem 0.4rem 0', marginBottom: '0.4rem' }}>
                      "{p}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Language Distribution */}
          <div className="card">
            <SectionHeader icon="🌐" title="Language Distribution" subtitle="Multilingual feedback detection" />
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {Object.entries(aiAnalysis.languages || {}).map(([lang, count]) => (
                <div key={lang} style={{ flex: 1, minWidth: '120px', textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>
                    {lang === 'english' ? '🇬🇧' : lang === 'hindi' ? '🇮🇳' : '🤝'}
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>{count}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>{lang}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Emotions ───────────────────────────────────────────── */}
      {activeTab === 'emotions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          <div className="card">
            <SectionHeader icon="😊" title="Emotion Distribution" subtitle="Detected emotions across all feedback" />
            {emotionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={emotionData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                    {emotionData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.75rem' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No text data for emotion analysis</p>
            )}
          </div>

          <div className="card">
            <SectionHeader icon="🎭" title="Emotion Breakdown" subtitle={`Dominant: ${EMOTION_CONFIG[aiAnalysis.emotion.dominant]?.label || 'Neutral'}`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(EMOTION_CONFIG).map(([key, cfg]) => {
                const value = aiAnalysis.emotion.emotions[key] || 0;
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>{cfg.icon}</span> {cfg.label}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: cfg.color }}>{value}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${value}%`, background: cfg.color, borderRadius: '4px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Aspects ────────────────────────────────────────────── */}
      {activeTab === 'aspects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {aspectRadarData.length > 0 && (
            <div className="card">
              <SectionHeader icon="🎯" title="Aspect Radar" subtitle="Satisfaction score per dimension (0-100)" />
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={aspectRadarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="aspect" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.75rem' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="card">
            <SectionHeader icon="📊" title="Aspect Sentiments" subtitle="Per-category feedback analysis" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(aiAnalysis.aspects).length > 0 ? (
                Object.entries(aiAnalysis.aspects).map(([aspect, data]) => {
                  const color = data.sentiment === 'positive' ? '#22c55e' : data.sentiment === 'negative' ? '#ef4444' : '#eab308';
                  return (
                    <div key={aspect} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.875rem', background: `${color}0D`, borderRadius: '0.625rem', border: `1px solid ${color}25` }}>
                      <div>
                        <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.88rem', textTransform: 'capitalize' }}>{aspect}</span>
                        <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '0.5rem' }}>{data.mentions} mention{data.mentions !== 1 ? 's' : ''}</span>
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color, padding: '0.2rem 0.6rem', background: `${color}20`, borderRadius: '0.4rem', border: `1px solid ${color}40`, textTransform: 'capitalize' }}>
                        {data.sentiment}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>Not enough text data for aspect analysis</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Topics ─────────────────────────────────────────────── */}
      {activeTab === 'topics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <SectionHeader icon="📌" title="Topic Distribution" subtitle="Most common feedback themes" />
            {topicData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topicData} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="topic" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Feedbacks" radius={[4, 4, 0, 0]}>
                    {topicData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No topic data available</p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.875rem' }}>
            {topicData.map((item, i) => (
              <div key={item.fullTopic} style={{
                padding: '0.875rem 1rem', borderRadius: '0.75rem',
                background: `${COLORS[i % COLORS.length]}12`,
                border: `1px solid ${COLORS[i % COLORS.length]}30`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>{item.fullTopic}</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: COLORS[i % COLORS.length] }}>{item.count}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                  {Math.round((item.count / aiAnalysis.totalFeedbacks) * 100)}% of feedbacks
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Alerts ──────────────────────────────────────────────── */}
      {activeTab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Urgency Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {Object.entries(URGENCY_CONFIG).map(([level, cfg]) => (
              <div key={level} style={{ padding: '1rem', borderRadius: '0.875rem', background: cfg.bg, border: `1px solid ${cfg.color}30`, textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{cfg.icon}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: cfg.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {aiAnalysis.urgency[level] || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{cfg.label} Priority</div>
              </div>
            ))}
          </div>

          {/* Spam Info */}
          <div className="card">
            <SectionHeader icon="🛡️" title="Spam & Quality Filter" subtitle="AI-detected non-genuine submissions" />
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', border: '2px solid rgba(139,92,246,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8b5cf6' }}>{aiAnalysis.spam.percent}%</span>
                <span style={{ fontSize: '0.6rem', color: '#64748b' }}>SPAM</span>
              </div>
              <div>
                <p style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: '0.25rem' }}>{aiAnalysis.spam.count} flagged submissions</p>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  {aiAnalysis.spam.count === 0
                    ? 'All feedback appears genuine and informative.'
                    : `${aiAnalysis.spam.count} feedback(s) appear to be spam or low-quality and are excluded from analytics.`}
                </p>
              </div>
            </div>
          </div>

          {/* Duplicate Analysis */}
          <div className="card">
            <SectionHeader icon="🔗" title="Duplicate Detection" subtitle="Similar or repeated feedback submissions" />
            {aiAnalysis.duplicates.length === 0 ? (
              <p style={{ color: '#4ade80', fontSize: '0.9rem' }}>✅ No duplicate feedback detected</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {aiAnalysis.duplicates.map((dup, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.875rem', background: 'rgba(249,115,22,0.08)', borderRadius: '0.625rem', border: '1px solid rgba(249,115,22,0.2)' }}>
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Feedback pair detected</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: dup.isDuplicate ? '#ef4444' : '#f97316' }}>
                      {dup.similarity}% similar {dup.isDuplicate ? '(Exact Duplicate)' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Urgent Feedbacks */}
          {aiAnalysis.urgentFeedbacks && aiAnalysis.urgentFeedbacks.length > 0 && (
            <div className="card" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <SectionHeader icon="🚨" title="Critical Complaints" subtitle="Requires immediate attention" />
                <button onClick={() => setExpandedUrgent(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem' }}>
                  {expandedUrgent ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {expandedUrgent ? 'Collapse' : 'View All'}
                </button>
              </div>
              {(expandedUrgent ? aiAnalysis.urgentFeedbacks : aiAnalysis.urgentFeedbacks.slice(0, 3)).map(fb => {
                const cfg = URGENCY_CONFIG[fb.urgency.level];
                return (
                  <div key={fb.id} style={{ padding: '0.875rem', borderRadius: '0.75rem', background: cfg.bg, border: `1px solid ${cfg.color}30`, marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: cfg.color }}>
                        {cfg.icon} {cfg.label} Priority
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {new Date(fb.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic' }}>
                      "{(fb.comment || fb.text || 'No comment').slice(0, 150)}"
                    </p>
                    {fb.urgency.triggers.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        {fb.urgency.triggers.slice(0, 3).map((t, i) => (
                          <span key={i} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', background: `${cfg.color}25`, color: cfg.color, borderRadius: '0.3rem', fontWeight: 600 }}>
                            {t.keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Trends ──────────────────────────────────────────────── */}
      {activeTab === 'trends' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <SectionHeader icon="📈" title="Rating Trend Over Time" subtitle="Monthly average rating evolution" />
              <span style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700,
                color: trendData.trendDirection === 'improving' ? '#22c55e' : trendData.trendDirection === 'declining' ? '#ef4444' : '#eab308',
              }}>
                {trendData.trendDirection === 'improving' ? <TrendingUp size={16} /> : trendData.trendDirection === 'declining' ? <TrendingDown size={16} /> : <Minus size={16} />}
                {trendData.trendDirection.charAt(0).toUpperCase() + trendData.trendDirection.slice(1)}
              </span>
            </div>
            {trendData.monthlyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trendData.monthlyTrends} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="avgRating" name="Avg Rating" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} />
                  <Line type="monotone" dataKey="count" name="Submissions" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#22c55e', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Not enough time-series data for trend analysis</p>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

