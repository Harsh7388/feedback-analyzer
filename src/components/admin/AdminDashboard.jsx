import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import {
  BarChart3, Brain, Users, GraduationCap, UserCheck,
  BookOpen, TrendingUp, Award, MessageSquare, Smile, Frown, Meh
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { aggregateFeedbacks } from '../../utils/sentimentAnalysis';
import { initialFeedbacks } from '../../data/initialData';
import { saveFeedbacks } from '../../utils/storage';
import toast from 'react-hot-toast';

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#6366f1', '#06b6d4'];

function SentimentMeter({ score }) {
  const pct = ((score + 1) / 2) * 100;
  return (
    <div style={{ marginTop: '0.75rem' }}>
      <div className="sentiment-meter">
        <div className="sentiment-needle" style={{ left: `${pct}%` }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.7rem', color: '#64748b' }}>
        <span>Negative</span><span>Neutral</span><span>Positive</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { students, teachers, subjects, feedbacks, feedbackForms, refreshData } = useApp();

  const handleLoadDemoData = () => {
    saveFeedbacks(initialFeedbacks);
    refreshData();
    toast.success('Demo feedbacks loaded successfully! Enjoy your interview.');
  };

  const globalAnalysis = useMemo(() => aggregateFeedbacks(feedbacks), [feedbacks]);

  // Semester-wise feedback count
  const semData = useMemo(() => {
    const sems = {};
    feedbacks.forEach(f => {
      const sem = f.semester || 1;
      sems[sem] = (sems[sem] || 0) + 1;
    });
    return Object.entries(sems).map(([sem, count]) => ({ semester: `Sem ${sem}`, count })).sort((a, b) => a.semester.localeCompare(b.semester));
  }, [feedbacks]);

  // Sentiment distribution pie
  const pieData = [
    { name: 'Positive', value: globalAnalysis.positivePercent, color: '#22c55e' },
    { name: 'Neutral', value: globalAnalysis.neutralPercent, color: '#eab308' },
    { name: 'Negative', value: globalAnalysis.negativePercent, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Rating distribution
  const ratingData = Object.entries(globalAnalysis.ratingDistribution).map(([r, c]) => ({
    rating: `${r}★`, count: c,
  }));

  const sentimentIcon = globalAnalysis.sentimentLabel === 'positive' ? <Smile color="#22c55e" size={24} />
    : globalAnalysis.sentimentLabel === 'negative' ? <Frown color="#ef4444" size={24} />
    : <Meh color="#eab308" size={24} />;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
          <p style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</p>
          {payload.map(p => <p key={p.name} style={{ color: p.color, fontSize: '0.85rem' }}>{p.name}: {p.value}</p>)}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button onClick={handleLoadDemoData} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
          <Brain size={14} /> Load Demo Data
        </button>
      </div>
      
      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: GraduationCap, label: 'Students', value: students.length, color: '#22c55e' },
          { icon: UserCheck, label: 'Teachers', value: teachers.length, color: '#06b6d4' },
          { icon: BookOpen, label: 'Subjects', value: subjects.length, color: '#6366f1' },
          { icon: MessageSquare, label: 'Feedbacks', value: feedbacks.length, color: '#8b5cf6' },
          { icon: BarChart3, label: 'Forms', value: feedbackForms.length, color: '#f97316' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="stat-card anim-fade-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Icon size={16} color={color} />
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color, fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Sentiment Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Overall Sentiment */}
        <div className="card anim-fade-up" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Brain size={20} color="#a5b4fc" />
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f1f5f9' }}>Overall Sentiment</h3>
          </div>
          {feedbacks.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No feedback data yet</p>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                {sentimentIcon}
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
                    {globalAnalysis.avgRating}/5
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Average Rating</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <span className={`badge badge-${globalAnalysis.sentimentLabel === 'positive' ? 'positive' : globalAnalysis.sentimentLabel === 'negative' ? 'negative' : 'neutral'}`}>
                    {globalAnalysis.sentimentLabel?.charAt(0).toUpperCase() + globalAnalysis.sentimentLabel?.slice(1)}
                  </span>
                </div>
              </div>
              <SentimentMeter score={globalAnalysis.sentimentScore} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
                {[
                  { label: 'Positive', value: globalAnalysis.positivePercent, color: '#22c55e' },
                  { label: 'Neutral', value: globalAnalysis.neutralPercent, color: '#eab308' },
                  { label: 'Negative', value: globalAnalysis.negativePercent, color: '#ef4444' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ textAlign: 'center', background: `${color}12`, borderRadius: '0.625rem', padding: '0.5rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color, fontFamily: "'Space Grotesk', sans-serif" }}>{value}%</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{label}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sentiment Pie */}
        <div className="card anim-fade-up">
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>Sentiment Distribution</h3>
          {feedbacks.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Semester-wise feedbacks */}
        <div className="card anim-fade-up">
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>Feedbacks by Semester</h3>
          {semData.length === 0 ? <p style={{ color: '#64748b' }}>No data yet</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={semData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="semester" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Feedbacks" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="card anim-fade-up">
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>Rating Distribution</h3>
          {feedbacks.length === 0 ? <p style={{ color: '#64748b' }}>No data yet</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ratingData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="rating" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
                  {ratingData.map((_, i) => <Cell key={i} fill={['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'][i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Keywords */}
      {globalAnalysis.topKeywords?.length > 0 && (
        <div className="card anim-fade-up">
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>
            🔍 Most Mentioned Keywords
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {globalAnalysis.topKeywords.map(({ word, count, sentiment }) => (
              <div key={word} className={`badge badge-${sentiment === 'positive' ? 'positive' : sentiment === 'negative' ? 'negative' : 'info'}`}
                style={{ fontSize: '0.82rem', padding: '0.3rem 0.75rem' }}>
                {word} <span style={{ opacity: 0.7, marginLeft: '0.25rem' }}>×{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teachers Section */}
      <div className="card anim-fade-up" style={{ marginTop: '2rem' }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserCheck size={20} color="#06b6d4" /> Teachers Directory
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {teachers.map(t => (
            <div key={t.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '0.75rem',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(6,182,212,0.15)',
                color: '#06b6d4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.9rem'
              }}>
                {t.name.charAt(0)}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.department || 'Faculty'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
