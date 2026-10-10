import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, ShieldCheck, Sun, Moon, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Chatbot from './Chatbot';

export default function DashboardLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminHover, setAdminHover] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const { isAdmin, currentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`dashboard-layout ${sidebarHidden ? 'sidebar-hidden' : ''}`} style={{
      '--bg-color': theme === 'light' ? '#f8fafc' : '#0f172a',
      '--text-color': theme === 'light' ? '#0f172a' : '#f1f5f9',
      '--card-bg': theme === 'light' ? '#ffffff' : '#1e293b',
      '--border-color': theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.06)',
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-color)',
      minHeight: '100vh',
      display: 'flex',
    }}>
      {!sidebarHidden && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} theme={theme} />}
      
      <main className="main-content" style={{ flex: 1, padding: '2rem', transition: 'all 0.3s' }}>
        {/* Top Bar */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                display: 'none',
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                color: '#a5b4fc',
                cursor: 'pointer',
              }}
              className="mobile-menu-btn"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9' }}>
                {title}
              </h1>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Admin Controls */}
            {isAdmin && (
              <>
                <button
                  onClick={() => setSidebarHidden(!sidebarHidden)}
                  title="Toggle Sidebar"
                  style={{
                    background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.4rem', color: 'var(--text-color)', cursor: 'pointer', display: 'flex', alignItems: 'center'
                  }}
                >
                  {sidebarHidden ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
                </button>
                <button
                  onClick={toggleTheme}
                  title="Toggle Theme"
                  style={{
                    background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.4rem', color: 'var(--text-color)', cursor: 'pointer', display: 'flex', alignItems: 'center'
                  }}
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </>
            )}

            {/* Admin Panel Button - Only show if Admin */}
            {isAdmin && (
              <button
                id="admin-panel-top-btn"
                onClick={() => navigate('/admin')}
                onMouseEnter={() => setAdminHover(true)}
                onMouseLeave={() => setAdminHover(false)}
                aria-label="Go to Admin Panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.42rem 0.9rem',
                  borderRadius: '0.6rem',
                  border: `1px solid ${adminHover ? 'rgba(249,115,22,0.55)' : 'rgba(249,115,22,0.25)'}`,
                  background: adminHover
                    ? 'linear-gradient(135deg, rgba(249,115,22,0.22), rgba(239,68,68,0.15))'
                    : 'rgba(249,115,22,0.08)',
                  color: adminHover ? '#fb923c' : '#f97316',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'all 0.2s ease',
                  boxShadow: adminHover ? '0 0 16px rgba(249,115,22,0.25)' : 'none',
                  transform: adminHover ? 'translateY(-1px)' : 'translateY(0)',
                }}
              >
                <ShieldCheck size={15} strokeWidth={2} />
                Admin Panel
              </button>
            )}

            <div style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.15)',
              borderRadius: '0.5rem',
              padding: '0.4rem 0.5rem',
              color: '#94a3b8',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
            }}>
              🤖 AI Powered
            </div>
          </div>
        </header>

        <div className="page-enter">
          {children}
        </div>
      </main>
      
      <Chatbot />

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
