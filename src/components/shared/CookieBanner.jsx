import React from 'react';
import { useApp } from '../../context/AppContext';
import { Cookie, X, Check } from 'lucide-react';

export default function CookieBanner() {
  const { cookieConsent, acceptCookies, declineCookies } = useApp();

  if (cookieConsent !== null) return null;

  return (
    <div className="cookie-banner" role="banner" aria-label="Cookie consent">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <Cookie size={24} color="#6366f1" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: '200px' }}>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            🍪 We use cookies to enhance your experience on FeedSense. By continuing, you agree to our{' '}
            <a href="/privacy-policy" style={{ color: '#a5b4fc', textDecoration: 'underline' }}>Privacy Policy</a>
            {' '}and{' '}
            <a href="/terms" style={{ color: '#a5b4fc', textDecoration: 'underline' }}>Terms of Service</a>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
          <button
            onClick={declineCookies}
            aria-label="Decline cookies"
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              transition: 'all 0.2s',
            }}
          >
            <X size={14} /> Decline
          </button>
          <button
            onClick={acceptCookies}
            aria-label="Accept cookies"
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
              transition: 'all 0.2s',
            }}
          >
            <Check size={14} /> Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
