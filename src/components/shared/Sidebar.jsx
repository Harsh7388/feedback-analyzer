import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, BookOpen, Star, LogOut, Users, Settings,
  BarChart3, ClipboardList, UserCheck, ShieldCheck, ChevronRight,
  GraduationCap, Brain
} from 'lucide-react';

function Logo() {
  return (
    <div style={{ marginBottom: '1.5rem', padding: '0 0.25rem' }}>
      <img
        src="/feedsence-logo.png"
        alt="FeedSence"
        style={{
          width: '100%',
          maxWidth: '180px',
          height: 'auto',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 12px rgba(99,102,241,0.5))',
        }}
      />
    </div>
  );
}

const studentLinks = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/student/feedback', icon: ClipboardList, label: 'My Feedback' },
];

const teacherLinks = [
  { to: '/teacher', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/teacher/students', icon: Users, label: 'Students' },
  { to: '/teacher/forms', icon: ClipboardList, label: 'Feedback Forms' },
];

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/feedbacks', icon: BarChart3, label: 'All Feedbacks' },
  { to: '/admin/sentiment', icon: Brain, label: 'Sentiment Analysis' },
  { to: '/admin/students', icon: GraduationCap, label: 'Students' },
  { to: '/admin/teachers', icon: UserCheck, label: 'Teachers' },
  { to: '/admin/subjects', icon: BookOpen, label: 'Subjects' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser, logout, isAdmin, isTeacher, isStudent } = useApp();
  const navigate = useNavigate();

  const links = isAdmin ? adminLinks : isTeacher ? teacherLinks : studentLinks;
  const roleLabel = isAdmin ? 'Administrator' : isTeacher ? 'Teacher' : 'Student';
  const roleColor = isAdmin ? '#f97316' : isTeacher ? '#06b6d4' : '#22c55e';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 49 }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
        <Logo />

        {/* User info */}
        <div style={{
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.15)',
          borderRadius: '0.875rem',
          padding: '1rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: `linear-gradient(135deg, ${roleColor}33, ${roleColor}22)`,
              border: `1.5px solid ${roleColor}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, color: roleColor,
            }}>
              {currentUser?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.name || 'User'}
              </div>
              <div style={{ fontSize: '0.7rem', color: roleColor, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {roleLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1 }}>
          <div style={{ fontSize: '0.7rem', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
            Menu
          </div>
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{label}</span>
              <ChevronRight size={14} style={{ opacity: 0.4 }} />
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <NavLink to="/privacy-policy" className="sidebar-link" style={{ fontSize: '0.8rem' }} onClick={onClose}>
            <ShieldCheck size={15} />
            <span>Privacy Policy</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'transparent', color: '#f87171', marginTop: '0.25rem' }}
            aria-label="Logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
