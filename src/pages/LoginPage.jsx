import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, UserCheck, ShieldCheck, ArrowLeft, AlertCircle, Lock } from 'lucide-react';
import AnimatedBackground from '../components/shared/AnimatedBackground';
import { loginStudent, loginTeacher } from '../utils/storage';
import { useApp } from '../context/AppContext';
import { adminCredentials } from '../data/initialData';
import toast from 'react-hot-toast';

const roleConfig = {
  student: {
    title: 'Student Login',
    subtitle: 'Access your semester feedback portal',
    icon: GraduationCap,
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.08))',
    border: 'rgba(34,197,94,0.3)',
    fields: [
      { id: 'rollNo', label: 'Roll Number', placeholder: '2306410100033', type: 'text', autoComplete: 'username' },
      { id: 'password', label: 'Password', placeholder: 'Enter your password', type: 'password', autoComplete: 'current-password' },
    ],
  },
  teacher: {
    title: 'Teacher Login',
    subtitle: 'Access your teaching dashboard',
    icon: UserCheck,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(14,165,233,0.08))',
    border: 'rgba(6,182,212,0.3)',
    fields: [
      { id: 'username', label: 'Teacher ID', placeholder: 'Enter your teacher ID', type: 'text', autoComplete: 'username' },
      { id: 'password', label: 'Password', placeholder: 'Enter your password', type: 'password', autoComplete: 'current-password' },
    ],
  },
  admin: {
    title: 'Admin Login',
    subtitle: 'Access the administration panel',
    icon: ShieldCheck,
    color: '#f97316',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(239,68,68,0.08))',
    border: 'rgba(249,115,22,0.3)',
    fields: [
      { id: 'username', label: 'Admin ID', placeholder: 'Admin@123', type: 'text', autoComplete: 'username' },
      { id: 'password', label: 'Password', placeholder: 'Enter admin password', type: 'password', autoComplete: 'current-password' },
    ],
  },
};

export default function LoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useApp();
  const config = roleConfig[role] || roleConfig.student;
  const { icon: Icon, color } = config;

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    config.fields.forEach(f => {
      if (!form[f.id]?.trim()) errs[f.id] = `${f.label} is required`;
    });
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    try {
      let user;
      if (role === 'student') {
        user = loginStudent(form.rollNo?.trim(), form.password);
        user = { ...user, role: 'student' };
        login(user);
        navigate('/student');
      } else if (role === 'teacher') {
        user = loginTeacher(form.username?.trim(), form.password);
        user = { ...user, role: 'teacher' };
        login(user);
        navigate('/teacher');
      } else if (role === 'admin') {
        if (form.username?.trim() !== adminCredentials.username || form.password !== adminCredentials.password) {
          throw new Error('Invalid Admin ID or Password');
        }
        user = { ...adminCredentials, role: 'admin', id: 'admin' };
        login(user);
        navigate('/admin');
      }
      toast.success(`Welcome back, ${user.name}!`);
    } catch (err) {
      toast.error(err.message || 'Login failed');
      setErrors({ password: err.message });
    } finally { setLoading(false); }
  };

  const handle = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '2rem 1rem' }}>
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>

        {/* Back link */}
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '1.75rem', transition: 'color 0.2s', letterSpacing: '0.01em' }}
          onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
          onMouseLeave={e => e.currentTarget.style.color = '#475569'}
        >
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div style={{
          background: 'rgba(10, 14, 28, 0.85)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '1.5rem',
          padding: '2.5rem 2.25rem',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(24px)',
        }}>
          {/* Icon + Title */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 54, height: 54,
              borderRadius: '14px',
              background: config.gradient,
              border: `1px solid ${config.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: `0 0 24px ${color}28`,
            }}>
              <Icon size={24} color={color} strokeWidth={1.75} />
            </div>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.45rem', fontWeight: 700, color: '#f1f5f9',
              marginBottom: '0.35rem', letterSpacing: '-0.02em',
            }}>
              {config.title}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>
              {config.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {config.fields.map(field => (
              <div key={field.id} style={{ marginBottom: '1.125rem' }}>
                <label htmlFor={`login-${field.id}`} style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.45rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {field.label}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id={`login-${field.id}`}
                    type={field.type === 'password' ? (showPwd ? 'text' : 'password') : field.type}
                    className={`input-field ${errors[field.id] ? 'error' : ''}`}
                    placeholder={field.placeholder}
                    value={form[field.id] || ''}
                    onChange={handle(field.id)}
                    autoComplete={field.autoComplete}
                    required
                    style={{ paddingRight: field.type === 'password' ? '3rem' : '1rem' }}
                  />
                  {field.type === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPwd(v => !v)}
                      style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '0.25rem', borderRadius: '0.25rem', transition: 'color 0.2s' }}
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
                {errors[field.id] && (
                  <p style={{ color: '#f87171', fontSize: '0.775rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertCircle size={12} /> {errors[field.id]}
                  </p>
                )}
              </div>
            ))}

            <div style={{ marginTop: '1.75rem' }}>
              <button
                type="submit"
                disabled={loading}
                id={`${role}-login-btn`}
                style={{
                  width: '100%',
                  padding: '0.825rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  background: `linear-gradient(135deg, ${color}, ${color}bb)`,
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.25s ease',
                  boxShadow: `0 4px 20px ${color}35`,
                  letterSpacing: '0.01em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${color}50`; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${color}35`; }}
              >
                {loading ? (
                  <>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite', display: 'inline-block' }} />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>

          {role === 'student' && (
            <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.85rem', marginTop: '1.5rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#a5b4fc', fontWeight: 600, textDecoration: 'none' }}>
                Register here
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
