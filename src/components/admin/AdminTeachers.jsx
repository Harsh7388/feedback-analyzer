import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import { UserCheck, Plus, Search, Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import { addTeacher, saveTeachers } from '../../utils/storage';
import toast from 'react-hot-toast';

function AddTeacherModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', email: '', department: '', username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.department.trim()) e.department = 'Department is required';
    if (!form.username.trim() || form.username.length < 3) e.username = 'Teacher ID must be ≥ 3 characters';
    if (!form.password || form.password.length < 6) e.password = 'Password must be ≥ 6 characters';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const teacher = addTeacher(form);
      toast.success(`Teacher ${form.name} added!`);
      onAdded(teacher);
      onClose();
    } catch (err) {
      toast.error(err.message);
      setErrors({ username: err.message });
    } finally { setLoading(false); }
  };

  const handle = (f) => (e) => { setForm(prev => ({ ...prev, [f]: e.target.value })); setErrors(er => ({ ...er, [f]: '' })); };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Add teacher">
      <div className="modal-box anim-scale-in" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9' }}>Add New Teacher</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }} aria-label="Close"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {[
            { key: 'name', label: 'Full Name', placeholder: 'e.g. Dr. Ravi Shankar', type: 'text' },
            { key: 'email', label: 'Email', placeholder: 'teacher@college.edu', type: 'email' },
            { key: 'department', label: 'Department', placeholder: 'e.g. Computer Science', type: 'text' },
            { key: 'username', label: 'Teacher ID (Login)', placeholder: 'e.g. ravi.shankar', type: 'text' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key} style={{ marginBottom: '1rem' }}>
              <label htmlFor={`add-${key}`} className="input-label">{label}</label>
              <input id={`add-${key}`} type={type} className={`input-field ${errors[key] ? 'error' : ''}`} placeholder={placeholder} value={form[key]} onChange={handle(key)} />
              {errors[key] && <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><AlertCircle size={12} />{errors[key]}</p>}
            </div>
          ))}

          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="add-pwd" className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input id="add-pwd" type={showPwd ? 'text' : 'password'} className={`input-field ${errors.password ? 'error' : ''}`} placeholder="Min. 6 characters" value={form.password} onChange={handle('password')} />
              <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }} aria-label="Toggle password">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><AlertCircle size={12} />{errors.password}</p>}
          </div>

          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '0.625rem', padding: '0.625rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            🔑 Login credentials: <strong style={{ color: '#a5b4fc' }}>{form.username || 'teacher-id'}</strong> / <strong style={{ color: '#a5b4fc' }}>{form.password ? '•'.repeat(form.password.length) : 'password'}</strong>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading} id="add-teacher-submit-btn">
              <span>{loading ? 'Adding...' : '+ Add Teacher'}</span>
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminTeachers() {
  const { teachers, setTeachers, subjects } = useApp();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = teachers.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.department?.toLowerCase().includes(search.toLowerCase()) || t.username?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdded = (teacher) => {
    setTeachers(ts => [...ts, teacher]);
  };

  return (
    <DashboardLayout title="Teacher Management">
      {showModal && <AddTeacherModal onClose={() => setShowModal(false)} onAdded={handleAdded} />}

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="input-field" placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} aria-label="Search teachers" />
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }} id="add-teacher-btn">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={16} /> Add Teacher</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map((t, i) => {
          const teacherSubjects = subjects.filter(s => s.teacherId === t.id);
          return (
            <div key={t.id} className={`card anim-fade-up delay-${(i % 5 + 1) * 100}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(14,165,233,0.1))',
                  border: '1.5px solid rgba(6,182,212,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: 700, color: '#06b6d4',
                }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{t.department}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span>🆔 {t.username}</span>
                <span>📧 {t.email?.split('@')[0]}@...</span>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.4rem', fontWeight: 600 }}>SUBJECTS ({teacherSubjects.length})</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {teacherSubjects.slice(0, 3).map(s => <span key={s.id} className="badge badge-purple" style={{ fontSize: '0.7rem' }}>{s.code}</span>)}
                  {teacherSubjects.length > 3 && <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>+{teacherSubjects.length - 3}</span>}
                  {teacherSubjects.length === 0 && <span style={{ color: '#475569', fontSize: '0.78rem' }}>No subjects assigned</span>}
                </div>
              </div>

              <div style={{
                background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)',
                borderRadius: '0.5rem', padding: '0.5rem 0.75rem',
                fontSize: '0.78rem', color: '#94a3b8',
                fontFamily: 'monospace',
              }}>
                Login: {t.username} / {t.password}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <UserCheck size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No teachers found</p>
        </div>
      )}
    </DashboardLayout>
  );
}
