import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DashboardLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminHover, setAdminHover] = useState(false);
  const { isAdmin } = useApp();
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="main-content">
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
            {/* Admin Panel Button */}
            <button
              id="admin-panel-top-btn"
              onClick={() => navigate(isAdmin ? '/admin' : '/login/admin')}
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
              {isAdmin ? 'Admin Panel' : 'Admin Login'}
            </button>

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

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
