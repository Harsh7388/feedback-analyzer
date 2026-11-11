import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain, GraduationCap, UserCheck, ArrowRight, ShieldCheck,
  BarChart3, CheckCircle2, Star, Sparkles, TrendingUp, Layers,
  Lock, Eye, Award, MessageSquare, ChevronRight, Sun, Moon,
  FileSpreadsheet, Cpu, Activity, Compass, Check
} from 'lucide-react';
import Chatbot from '../components/shared/Chatbot';

// ─── Real-time Animated Counter ──────────────────────────────────
function Counter({ end, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const duration = 1200;
        const steps = 40;
        const stepTime = Math.floor(duration / steps);
        const stepValue = Math.ceil(end / steps);

        const timer = setInterval(() => {
          start += stepValue;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, stepTime);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [activeTab, setActiveTab] = useState('nlp');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg, #070B14)',
      color: 'var(--color-text, #F8FAFC)',
      fontFamily: "var(--font-main, 'Inter', -apple-system, sans-serif)",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* ── Background Subtle Mesh ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: theme === 'dark'
          ? 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 60%), radial-gradient(circle at 80% 40%, rgba(14, 165, 233, 0.08) 0%, transparent 50%)'
          : 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)',
      }} />

      {/* ── Clean Top Navigation (Next.js / Vercel style) ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: theme === 'dark' ? 'rgba(7, 11, 20, 0.8)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        transition: 'background 0.3s'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Brand */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img
              src="/feedsence-logo.png"
              alt="FeedSense"
              style={{
                height: '38px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="#features" style={{ color: 'var(--color-muted, #94A3B8)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
              Capabilities
            </a>
            <a href="#roles" style={{ color: 'var(--color-muted, #94A3B8)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
              Access Portals
            </a>
            <a href="#analytics-preview" style={{ color: 'var(--color-muted, #94A3B8)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
              Live Engine
            </a>
            <Link to="/privacy-policy" style={{ color: 'var(--color-muted, #94A3B8)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
              Security
            </Link>
          </nav>

          {/* Action Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={toggleTheme}
              style={{
                background: 'transparent',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'inherit',
                cursor: 'pointer'
              }}
              title="Toggle color mode"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              onClick={() => navigate('/login/student')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text, #F8FAFC)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: '0.5rem 0.75rem'
              }}
            >
              Log in
            </button>

            <button
              onClick={() => navigate('/register')}
              style={{
                background: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                color: theme === 'dark' ? '#070B14' : '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.55rem 1.25rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section (Editorial, Professional, High Impact) ── */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '5.5rem 1.5rem 4rem',
        textAlign: 'center'
      }}>
        {/* Subtle Pill Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.35rem 1rem',
          borderRadius: '9999px',
          background: theme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          color: '#818CF8',
          fontSize: '0.82rem',
          fontWeight: 600,
          marginBottom: '2rem'
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6366F1' }} />
          Enterprise Feedback Intelligence Platform · V2.4 Released
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
          fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          maxWidth: '960px',
          margin: '0 auto 1.5rem'
        }}>
          Empowering academic excellence with{' '}
          <span style={{
            background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #34D399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            real-time feedback analytics.
          </span>
        </h1>

        {/* Subhead */}
        <p style={{
          fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
          color: 'var(--color-muted, #94A3B8)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.6
        }}>
          Eliminate bias and manual review cycles. FeedSense collects anonymous student ratings, computes aspect sentiment, detects urgent campus complaints, and outputs actionable faculty development roadmaps.
        </p>

        {/* Hero CTA Group */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/login/student')}
            style={{
              background: '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '0.85rem 2rem',
              fontSize: '0.98rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 14px 30px -5px rgba(79, 70, 229, 0.55)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(79, 70, 229, 0.4)';
            }}
          >
            Launch Student Portal <ArrowRight size={17} />
          </button>

          <button
            onClick={() => navigate('/login/admin')}
            style={{
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
              color: 'var(--color-text, #F8FAFC)',
              border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
              borderRadius: '10px',
              padding: '0.85rem 1.75rem',
              fontSize: '0.98rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background 0.2s, border-color 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#F8FAFC';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF';
            }}
          >
            <ShieldCheck size={18} color="#F97316" />
            Admin Intelligence
          </button>
        </div>

        {/* Trust Badges */}
        <div style={{
          marginTop: '3.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2.5rem',
          flexWrap: 'wrap',
          color: 'var(--color-muted, #94A3B8)',
          fontSize: '0.82rem',
          fontWeight: 500
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Check size={15} color="#22C55E" /> 100% Anonymous & Secure
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Check size={15} color="#22C55E" /> Multilingual Hindi / Hinglish NLP
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Check size={15} color="#22C55E" /> Instant AI Sentiment & Spam Filter
          </span>
        </div>
      </section>

      {/* ── Interactive Live Dashboard Preview (Show, don't tell) ── */}
      <section id="analytics-preview" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1240px',
        margin: '0 auto 6rem',
        padding: '0 1.5rem'
      }}>
        <div style={{
          background: theme === 'dark' ? '#0D1322' : '#FFFFFF',
          border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: theme === 'dark' ? '0 25px 60px -15px rgba(0, 0, 0, 0.6)' : '0 20px 45px -10px rgba(0, 0, 0, 0.08)'
        }}>
          {/* Top Bar of the Mock Dashboard */}
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
              <span style={{ marginLeft: '1rem', fontSize: '0.82rem', color: 'var(--color-muted, #94A3B8)', fontWeight: 600 }}>
                feedsense.ai / analytics / live-stream
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['nlp', 'aspects', 'urgency'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: activeTab === tab ? '#4F46E5' : 'transparent',
                    color: activeTab === tab ? '#FFFFFF' : 'var(--color-muted, #94A3B8)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  {tab === 'nlp' ? 'Sentiment & Emotion' : tab === 'aspects' ? 'Aspect Radar' : 'Complaint Triage'}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Screen Content */}
          <div style={{ padding: '2rem' }}>
            {activeTab === 'nlp' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div style={{
                  padding: '1.5rem',
                  borderRadius: '14px',
                  background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                  border: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted, #94A3B8)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                    Overall Student Sentiment
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span>88.4%</span>
                    <span style={{ fontSize: '0.9rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                      +4.2% vs last sem
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted, #94A3B8)', marginTop: '0.5rem' }}>
                    Evaluated across 2,450+ submissions via multilingual NLP parsing tone, intent, and satisfaction.
                  </p>
                </div>

                <div style={{
                  padding: '1.5rem',
                  borderRadius: '14px',
                  background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                  border: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted, #94A3B8)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                    Dominant Classroom Emotion
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--color-text, #F8FAFC)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span>😊 Satisfaction & Clarity</span>
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-muted, #94A3B8)' }}>
                      <span>Satisfaction: 62%</span>
                      <span>Frustration: 14%</span>
                      <span>Enthusiasm: 24%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: '62%', background: '#6366F1' }} />
                      <div style={{ width: '24%', background: '#10B981' }} />
                      <div style={{ width: '14%', background: '#F59E0B' }} />
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '1.5rem',
                  borderRadius: '14px',
                  background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                  border: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted, #94A3B8)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                    Automated Quality Filter
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', color: '#6366F1' }}>
                    99.2%
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted, #94A3B8)', marginTop: '0.5rem' }}>
                    0 duplicate submissions allowed. Filler words and spam discarded automatically.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'aspects' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {[
                  { title: 'Lecture Clarity', score: 4.8, status: 'Top Tier' },
                  { title: 'Practical Lab Sessions', score: 4.4, status: 'Healthy' },
                  { title: 'Doubt Resolution Outside Class', score: 4.6, status: 'High' },
                  { title: 'Course Content & Pace', score: 4.1, status: 'Needs Minor Tuning' },
                ].map(item => (
                  <div key={item.title} style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
                    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text, #F8FAFC)' }}>{item.title}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38BDF8', margin: '0.4rem 0' }}>{item.score} / 5.0</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted, #94A3B8)' }}>{item.status}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'urgency' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🚨</span>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F87171' }}>Critical Alert Detected · CS701 IoT Systems</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-muted, #94A3B8)' }}>"Lab equipment hardware kits missing components for 3rd continuous week"</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EF4444', background: 'rgba(239,68,68,0.15)', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>
                    Auto-Escalated to HOD
                  </span>
                </div>

                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FBBF24' }}>Pacing Warning · BCS701 Artificial Intelligence</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-muted, #94A3B8)' }}>"3 chapters rushed in last week before midterms without sample numericals"</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B', background: 'rgba(245,158,11,0.15)', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>
                    Medium Priority
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Core Value Pillars (Why FeedSense) ── */}
      <section id="features" style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '5rem 1.5rem',
        borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 4rem' }}>
          <h2 style={{
            fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            marginBottom: '1rem'
          }}>
            Engineered for high-performing educational institutions.
          </h2>
          <p style={{ color: 'var(--color-muted, #94A3B8)', fontSize: '1rem', lineHeight: 1.6 }}>
            Modern infrastructure that bridges the gap between student feedback and continuous academic advancement.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {[
            {
              icon: Brain,
              color: '#818CF8',
              title: 'Aspect-Based Sentiment',
              desc: 'Identifies nuanced feedback on specific dimensions: faculty competence, lab infrastructure, curriculum depth, and campus amenities.'
            },
            {
              icon: Compass,
              color: '#06B6D4',
              title: 'Multilingual Hinglish Parsing',
              desc: 'Students express thoughts naturally in English, Hindi, or conversational Hinglish. Our engine interprets context accurately without losing intent.'
            },
            {
              icon: Activity,
              color: '#F43F5E',
              title: 'Urgency & Anomaly Triage',
              desc: 'Automatically flags urgent complaints such as equipment failures or harassment directly to department heads in real time.'
            },
            {
              icon: Layers,
              color: '#10B981',
              title: 'Dynamic Form Generator',
              desc: 'Create and schedule custom feedback forms with rating scales, MCQs, and open responses with automated active/expiry periods.'
            },
            {
              icon: Award,
              color: '#F59E0B',
              title: 'AI Faculty Development Reports',
              desc: 'Synthesizes hundreds of student comments into clear strengths, areas for improvement, and pedagogical recommendations per teacher.'
            },
            {
              icon: Lock,
              color: '#A855F7',
              title: 'Role-Based Confidentiality',
              desc: 'Strict identity dissociation protects student anonymity while cryptographically verifying single submissions per enrolled student.'
            }
          ].map((feature, i) => (
            <div
              key={feature.title}
              style={{
                padding: '2rem',
                borderRadius: '16px',
                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#FFFFFF',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: theme === 'dark' ? 'none' : '0 4px 20px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = feature.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: `${feature.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <feature.icon size={22} color={feature.color} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--color-text, #F8FAFC)' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--color-muted, #94A3B8)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Three Dedicated Role Portals ── */}
      <section id="roles" style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '5rem 1.5rem',
        borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 4rem' }}>
          <h2 style={{
            fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            marginBottom: '0.75rem'
          }}>
            Tailored interfaces for every stakeholder.
          </h2>
          <p style={{ color: 'var(--color-muted, #94A3B8)', fontSize: '0.95rem' }}>
            Choose your login destination to access role-specific workflows.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Student */}
          <div
            onClick={() => navigate('/login/student')}
            style={{
              padding: '2.5rem 2rem',
              borderRadius: '18px',
              background: theme === 'dark' ? '#0A1020' : '#FFFFFF',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.25s, box-shadow 0.25s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <GraduationCap size={26} color="#10B981" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>Student Portal</h3>
              <p style={{ color: 'var(--color-muted, #94A3B8)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                View your registered semester subjects, complete active forms with star ratings, and leave confidential comments without risk of identification.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Single-click form access', 'Anonymous submission safeguards', 'Completion progress tracking'].map(it => (
                  <li key={it} style={{ fontSize: '0.82rem', color: 'var(--color-muted, #94A3B8)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={15} color="#10B981" /> {it}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: 600, fontSize: '0.9rem' }}>
              Sign In as Student <ChevronRight size={17} />
            </div>
          </div>

          {/* Teacher */}
          <div
            onClick={() => navigate('/login/teacher')}
            style={{
              padding: '2.5rem 2rem',
              borderRadius: '18px',
              background: theme === 'dark' ? '#0A1020' : '#FFFFFF',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.25s, box-shadow 0.25s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(6, 182, 212, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <UserCheck size={26} color="#06B6D4" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>Faculty Portal</h3>
              <p style={{ color: 'var(--color-muted, #94A3B8)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Access course-wise engagement summaries, monitor completion rates across assigned batches, and review synthesized student recommendations.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Subject-specific performance metrics', 'Student enrollment rosters', 'Course evaluation tracking'].map(it => (
                  <li key={it} style={{ fontSize: '0.82rem', color: 'var(--color-muted, #94A3B8)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={15} color="#06B6D4" /> {it}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06B6D4', fontWeight: 600, fontSize: '0.9rem' }}>
              Sign In as Faculty <ChevronRight size={17} />
            </div>
          </div>

          {/* Admin */}
          <div
            onClick={() => navigate('/login/admin')}
            style={{
              padding: '2.5rem 2rem',
              borderRadius: '18px',
              background: theme === 'dark' ? '#0A1020' : '#FFFFFF',
              border: '1px solid rgba(249, 115, 22, 0.25)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.25s, box-shadow 0.25s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(249, 115, 22, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(249, 115, 22, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <ShieldCheck size={26} color="#F97316" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>Administration</h3>
              <p style={{ color: 'var(--color-muted, #94A3B8)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Full institutional control: manage departments, build dynamic forms, schedule evaluation windows, and analyze deep campus-wide trends.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Department & semester comparisons', 'Dynamic Form Builder & scheduling', 'Automated AI report generation'].map(it => (
                  <li key={it} style={{ fontSize: '0.82rem', color: 'var(--color-muted, #94A3B8)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={15} color="#F97316" /> {it}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F97316', fontWeight: 600, fontSize: '0.9rem' }}>
              Sign In as Admin <ChevronRight size={17} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Numbers Strip ── */}
      <section style={{
        borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
        borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
        background: theme === 'dark' ? 'rgba(255,255,255,0.015)' : '#FAFAFA',
        padding: '3rem 1.5rem'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}>
              <Counter end={32} suffix="+" />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-muted, #94A3B8)', marginTop: '0.25rem' }}>Academic Subjects</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}>
              <Counter end={8} />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-muted, #94A3B8)', marginTop: '0.25rem' }}>Semesters Monitored</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}>
              <Counter end={25} suffix="+" />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-muted, #94A3B8)', marginTop: '0.25rem' }}>Faculty Members</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", color: '#10B981' }}>
              <Counter end={99} suffix="%" />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-muted, #94A3B8)', marginTop: '0.25rem' }}>Analysis Reliability</div>
          </div>
        </div>
      </section>

      {/* ── Professional Footer ── */}
      <footer style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '4rem 1.5rem 3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div style={{ maxWidth: '340px' }}>
            <img
              src="/feedsence-logo.png"
              alt="FeedSense"
              style={{ height: '36px', marginBottom: '1rem' }}
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted, #94A3B8)', lineHeight: 1.6 }}>
              FeedSense is an enterprise feedback intelligence system purpose-built for colleges and universities to enhance educational outcomes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Platform
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <li><Link to="/login/student" style={{ color: 'var(--color-muted, #94A3B8)', textDecoration: 'none' }}>Student Portal</Link></li>
                <li><Link to="/login/teacher" style={{ color: 'var(--color-muted, #94A3B8)', textDecoration: 'none' }}>Teacher Portal</Link></li>
                <li><Link to="/login/admin" style={{ color: 'var(--color-muted, #94A3B8)', textDecoration: 'none' }}>Administrator</Link></li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Compliance & Legal
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <li><Link to="/privacy-policy" style={{ color: 'var(--color-muted, #94A3B8)', textDecoration: 'none' }}>Privacy Policy</Link></li>
                <li><Link to="/terms" style={{ color: 'var(--color-muted, #94A3B8)', textDecoration: 'none' }}>Terms of Service</Link></li>
                <li><Link to="/cookies" style={{ color: 'var(--color-muted, #94A3B8)', textDecoration: 'none' }}>Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--color-muted, #94A3B8)'
        }}>
          <div>
            © {new Date().getFullYear()} FeedSense Technologies. All rights reserved.
          </div>
          <div>
            Designed for Academic Excellence & Continuous Quality Improvement
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
}
