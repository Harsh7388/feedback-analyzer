import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Frown, ArrowLeft, Home } from 'lucide-react';
import AnimatedBackground from '../components/shared/AnimatedBackground';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', textAlign: 'center', padding: '2rem' }}>
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '8rem', fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontFamily: "'Space Grotesk', sans-serif",
          marginBottom: '1rem',
        }}>404</div>
        <Frown size={64} color="#475569" style={{ marginBottom: '1.5rem' }} />
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.75rem' }}>
          Page Not Found
        </h1>
        <p style={{ color: '#64748b', maxWidth: '400px', marginBottom: '2rem', lineHeight: 1.7 }}>
          Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link to="/" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Home size={16} /> Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
