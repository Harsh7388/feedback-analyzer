import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Eye, EyeOff, GraduationCap, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import AnimatedBackground from '../components/shared/AnimatedBackground';
import { registerStudent } from '../utils/storage';
import { useApp } from '../context/AppContext';
import { SEMESTERS } from '../data/initialData';
import toast from 'react-hot-toast';

function InputField({ label, id, error, ...props }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label htmlFor={id} className="input-label">{label}</label>
      <input id={id} className={`input-field ${error ? 'error' : ''}`} {...props} />
      {error && (
        <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { refreshData } = useApp();
  const [form, setForm] = useState({ name: '', rollNo: '', semester: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Full name must be at least 2 characters';
    if (!form.rollNo.trim()) errs.rollNo = 'Roll number is required';
    else if (!/^[A-Za-z0-9_-]{3,20}$/.test(form.rollNo.trim())) errs.rollNo = 'Roll number must be 3-20 alphanumeric characters';
    if (!form.semester) errs.semester = 'Please select your semester';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      registerStudent(form);
      refreshData();
      toast.success('Account created! Please login.', { icon: '🎉' });
      navigate('/login/student');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      setErrors({ rollNo: err.message });
    } finally { setLoading(false); }
  };

  const handle = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '2rem 1rem' }}>
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '460px' }}>
        {/* Back */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '1.5rem', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="glass-dark" style={{ borderRadius: '1.5rem', padding: '2.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.1))',
              border: '1.5px solid rgba(34,197,94,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 0 20px rgba(34,197,94,0.2)',
            }}>
              <GraduationCap size={26} color="#22c55e" />
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.35rem' }}>
              Student Registration
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Create your FeedSense account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <InputField
              label="Full Name"
              id="reg-name"
              type="text"
              placeholder="Harsh Vardhan Maurya"
              value={form.name}
              onChange={handle('name')}
              error={errors.name}
              autoComplete="name"
              required
            />
            <InputField
              label="Roll Number"
              id="reg-roll"
              type="text"
              placeholder="2306410100033"
              value={form.rollNo}
              onChange={handle('rollNo')}
              error={errors.rollNo}
              autoComplete="username"
              required
            />

            {/* Semester Select */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="reg-sem" className="input-label">Current Semester</label>
              <select
                id="reg-sem"
                className={`input-field ${errors.semester ? 'error' : ''}`}
                value={form.semester}
                onChange={handle('semester')}
                required
              >
                <option value="">Select Semester</option>
                {SEMESTERS.map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
              {errors.semester && (
                <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={13} /> {errors.semester}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
              <label htmlFor="reg-pwd" className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-pwd"
                  type={showPwd ? 'text' : 'password'}
                  className={`input-field ${errors.password ? 'error' : ''}`}
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={handle('password')}
                  autoComplete="new-password"
                  required
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><AlertCircle size={13} />{errors.password}</p>}
            </div>

            <InputField
              label="Confirm Password"
              id="reg-cpwd"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handle('confirmPassword')}
              error={errors.confirmPassword}
              autoComplete="new-password"
              required
            />

            {/* Strength indicator */}
            {form.password && (
              <div style={{ marginBottom: '1rem' }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${Math.min(100, form.password.length * 12)}%`,
                    background: form.password.length < 6 ? '#ef4444' : form.password.length < 10 ? '#f97316' : '#22c55e',
                  }} />
                </div>
                <p style={{ fontSize: '0.75rem', color: form.password.length < 6 ? '#f87171' : form.password.length < 10 ? '#fb923c' : '#4ade80', marginTop: '0.3rem' }}>
                  {form.password.length < 6 ? 'Weak' : form.password.length < 10 ? 'Good' : '✓ Strong'}
                </p>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading} id="register-submit-btn">
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>

          <div className="divider" style={{ margin: '1.5rem 0' }}>or</div>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login/student" style={{ color: '#a5b4fc', fontWeight: 600, textDecoration: 'none' }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
