import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain, GraduationCap, UserCheck, ArrowRight,
  BarChart2, MessageCircle, TrendingUp, CheckCircle, ChevronRight, ShieldCheck
} from 'lucide-react';

// ─── Animated counter ─────────────────────────────────────────────
function Counter({ end, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = Math.ceil(end / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(start);
        }, 18);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Floating orbs background ────────────────────────────────────
function OrbBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Top-left orb */}
      <div style={{
        position: 'absolute', top: '-15%', left: '-10%',
        width: '55vw', height: '55vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)',
        animation: 'orbFloat 18s ease-in-out infinite',
      }} />
      {/* Bottom-right orb */}
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '50vw', height: '50vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
        animation: 'orbFloat 22s ease-in-out infinite reverse',
      }} />
      {/* Center accent */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '30vw', height: '30vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)',
      }} />
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(2%,3%) scale(1.04); }
          66% { transform: translate(-2%,1%) scale(0.97); }
        }
      `}</style>
    </div>
  );
}

const roles = [
  {
    id: 'student',
    label: 'Student',
    path: '/login/student',
    icon: GraduationCap,
    accentColor: '#22c55e',
    bg: 'rgba(34,197,94,0.06)',
    border: 'rgba(34,197,94,0.18)',
    description: 'Rate your subjects and teachers each semester',
    items: ['View your semester subjects', 'Submit star-rated feedback', 'Track submission progress'],
  },
  {
    id: 'teacher',
    label: 'Teacher',
    path: '/login/teacher',
    icon: UserCheck,
    accentColor: '#06b6d4',
    bg: 'rgba(6,182,212,0.06)',
    border: 'rgba(6,182,212,0.18)',
    description: 'Monitor engagement and create feedback forms',
    items: ['Check submission status', 'Create feedback forms', 'View student enrollment'],
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/login/admin',
    icon: ShieldCheck,
    accentColor: '#f97316',
    bg: 'rgba(249,115,22,0.06)',
    border: 'rgba(249,115,22,0.18)',
    description: 'Manage platform and analyze feedback sentiment',
    items: ['System-wide analytics', 'AI sentiment breakdown', 'User & role management'],
  },
];

const features = [
  {
    icon: Brain,
    color: '#a78bfa',
    title: 'Sentiment Analysis',
    desc: 'Our NLP engine reads between the lines — scoring tone, intent, and emotion in every response.',
  },
  {
    icon: BarChart2,
    color: '#06b6d4',
    title: 'Visual Analytics',
    desc: 'Interactive charts break down ratings by semester, subject, and teacher at a glance.',
  },
  {
    icon: MessageCircle,
    color: '#22c55e',
    title: 'Structured Feedback',
    desc: 'Guided question sets ensure consistent, comparable data across every submission.',
  },
  {
    icon: TrendingUp,
    color: '#f59e0b',
    title: 'Performance Tracking',
    desc: 'Longitudinal views show how quality improves — or needs attention — over time.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', color: '#e2e8f0' }}>
      <OrbBackground />

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(1.5rem, 5vw, 3.5rem)',
        height: '60px',
        background: 'rgba(10,14,28,0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99,102,241,0.45)',
          }}>
            <Brain size={18} color="white" strokeWidth={1.8} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#f1f5f9', letterSpacing: '-0.01em' }}>
            Feed<span style={{ color: '#818cf8' }}>Sense</span>
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {[
            ['Privacy Policy', '/privacy-policy'],
            ['Terms', '/terms'],
          ].map(([label, path]) => (
            <Link key={path} to={path} style={{
              color: '#64748b', fontSize: '0.8rem', textDecoration: 'none', padding: '0.35rem 0.75rem',
              borderRadius: '0.5rem', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
            >{label}</Link>
          ))}
          <Link to="/register" style={{
            marginLeft: '0.25rem',
            padding: '0.4rem 1rem',
            borderRadius: '0.5rem',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#a5b4fc', fontSize: '0.82rem', fontWeight: 600,
            textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
          >
            Register
          </Link>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section style={{
          maxWidth: '860px', margin: '0 auto',
          padding: 'clamp(5rem, 10vh, 8rem) 1.5rem clamp(3rem, 6vh, 5rem)',
          textAlign: 'center',
        }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.35rem 0.875rem', borderRadius: '2rem',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            marginBottom: '2rem',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 6px #6366f1' }} />
            AI / ML Academic Feedback Platform
          </div>

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2.25rem, 5.5vw, 3.75rem)',
            fontWeight: 800, lineHeight: 1.1,
            color: '#f8fafc',
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
          }}>
            Smarter feedback,{' '}
            <br />
            <span style={{
              background: 'linear-gradient(120deg, #818cf8 20%, #a78bfa 60%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              driven by AI.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            color: '#64748b', lineHeight: 1.8,
            maxWidth: '540px', margin: '0 auto 2.5rem',
          }}>
            FeedSense transforms student responses into structured insights — with real-time sentiment analysis, visual dashboards, and role-based access for students, teachers, and administrators.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login/student')}
              style={{
                padding: '0.75rem 2rem', borderRadius: '0.75rem', border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                transition: 'all 0.25s ease',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)'; }}
              id="hero-student-login"
            >
              Get Started <ArrowRight size={15} />
            </button>
            <button
              onClick={() => navigate('/login/teacher')}
              style={{
                padding: '0.75rem 1.75rem', borderRadius: '0.75rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
            >
              Teacher Login
            </button>
          </div>
        </section>

        {/* ── Stats strip ─────────────────────────────────────────── */}
        <section style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '1.75rem clamp(1.5rem, 5vw, 3.5rem)',
        }}>
          <div style={{
            maxWidth: '860px', margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '0', textAlign: 'center',
          }}>
            {[
              { end: 32, suffix: '+', label: 'Subjects' },
              { end: 8, suffix: '', label: 'Semesters' },
              { end: 14, suffix: '+', label: 'Teachers' },
              { end: 98, suffix: '%', label: 'AI Accuracy' },
            ].map(({ end, suffix, label }) => (
              <div key={label} style={{ padding: '0.5rem', position: 'relative' }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  fontWeight: 800, color: '#f1f5f9', lineHeight: 1,
                  background: 'linear-gradient(120deg, #818cf8, #a78bfa)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  <Counter end={end} suffix={suffix} />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500, marginTop: '0.35rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Role cards ──────────────────────────────────────────── */}
        <section style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(4rem, 8vh, 6rem) 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>
              Portal Access
            </p>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.025em', lineHeight: 1.2,
            }}>
              Choose your role to continue
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1rem' }}>
            {roles.map(({ id, label, path, icon: Icon, accentColor, bg, border, description, items }) => (
              <button
                key={id}
                onClick={() => navigate(path)}
                onMouseEnter={() => setActiveCard(id)}
                onMouseLeave={() => setActiveCard(null)}
                aria-label={`Login as ${label}`}
                id={`role-${id}`}
                style={{
                  background: activeCard === id ? bg : 'rgba(15,20,40,0.6)',
                  border: `1px solid ${activeCard === id ? border : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '1.125rem', padding: '1.625rem',
                  textAlign: 'left', cursor: 'pointer',
                  transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: activeCard === id ? 'translateY(-3px)' : 'none',
                  boxShadow: activeCard === id ? `0 12px 40px ${accentColor}18` : 'none',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: '10px',
                  background: `${accentColor}14`,
                  border: `1px solid ${accentColor}28`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.125rem',
                  transition: 'box-shadow 0.28s ease',
                  boxShadow: activeCard === id ? `0 0 18px ${accentColor}30` : 'none',
                }}>
                  <Icon size={21} color={accentColor} strokeWidth={1.75} />
                </div>

                {/* Title + desc */}
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '1.025rem', fontWeight: 700, color: '#f1f5f9',
                  marginBottom: '0.4rem', letterSpacing: '-0.01em',
                }}>
                  {label}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.125rem', lineHeight: 1.55 }}>
                  {description}
                </p>

                {/* Feature list */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem' }}>
                  {items.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                      <CheckCircle size={13} color={accentColor} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* CTA row */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  color: accentColor, fontSize: '0.82rem', fontWeight: 600,
                }}>
                  Sign in as {label}
                  <ChevronRight size={14} style={{ transition: 'transform 0.2s', transform: activeCard === id ? 'translateX(3px)' : 'none' }} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────── */}
        <section style={{
          maxWidth: '960px', margin: '0 auto',
          padding: '0 1.5rem clamp(4rem, 8vh, 6rem)',
        }}>
          <div style={{
            background: 'rgba(15,20,40,0.5)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '1.5rem', padding: 'clamp(1.75rem, 4vw, 2.5rem)',
            backdropFilter: 'blur(16px)',
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Platform Capabilities
              </p>
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em',
              }}>
                Everything you need in one place
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
              {features.map(({ icon: Icon, color, title, desc }) => (
                <div key={title} style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '0.875rem', padding: '1.25rem',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}30`; e.currentTarget.style.background = `${color}06`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '8px',
                    background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '0.875rem',
                  }}>
                    <Icon size={18} color={color} strokeWidth={1.75} />
                  </div>
                  <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    {title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6 }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '1.75rem clamp(1.5rem, 5vw, 3.5rem)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 26, height: 26, borderRadius: '7px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Brain size={13} color="white" />
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#475569' }}>
              FeedSense
            </span>
            <span style={{ color: '#2d3748', fontSize: '0.8rem' }}>· AI/ML College Feedback Analyzer</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              ['Privacy Policy', '/privacy-policy'],
              ['Terms & Conditions', '/terms'],
              ['Cookie Policy', '/cookies'],
            ].map(([label, path]) => (
              <Link key={path} to={path} style={{
                color: '#374151', fontSize: '0.78rem', textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = '#64748b'}
                onMouseLeave={e => e.target.style.color = '#374151'}
              >{label}</Link>
            ))}
          </div>
        </footer>

      </div>
    </div>
  );
}
