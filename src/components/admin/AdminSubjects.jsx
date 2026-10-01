import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import { BookOpen, Plus, Search, X, AlertCircle } from 'lucide-react';
import { addSubject } from '../../utils/storage';
import toast from 'react-hot-toast';
import { SEMESTERS } from '../../data/initialData';

function AddSubjectModal({ onClose, onAdded }) {
  const { teachers } = useApp();
  const [form, setForm] = useState({ name: '', code: '', semesterId: '', teacherId: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Subject name required';
    if (!form.code.trim()) e.code = 'Subject code required';
    if (!form.semesterId) e.semesterId = 'Semester required';
    if (!form.teacherId) e.teacherId = 'Teacher required';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const sub = addSubject({ ...form, semesterId: parseInt(form.semesterId) });
    toast.success(`Subject ${form.name} added!`);
    onAdded(sub);
    onClose();
  };

  const handle = (f) => (e) => { setForm(p => ({ ...p, [f]: e.target.value })); setErrors(er => ({ ...er, [f]: '' })); };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Add subject">
      <div className="modal-box anim-scale-in" style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9' }}>Add New Subject</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }} aria-label="Close"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {[{ key: 'name', label: 'Subject Name', placeholder: 'e.g. Machine Learning' }, { key: 'code', label: 'Subject Code', placeholder: 'e.g. AI501' }].map(({ key, label, placeholder }) => (
            <div key={key} style={{ marginBottom: '1rem' }}>
              <label htmlFor={`sub-${key}`} className="input-label">{label}</label>
              <input id={`sub-${key}`} type="text" className={`input-field ${errors[key] ? 'error' : ''}`} placeholder={placeholder} value={form[key]} onChange={handle(key)} />
              {errors[key] && <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors[key]}</p>}
            </div>
          ))}

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="sub-sem" className="input-label">Semester</label>
            <select id="sub-sem" className={`input-field ${errors.semesterId ? 'error' : ''}`} value={form.semesterId} onChange={handle('semesterId')}>
              <option value="">Select Semester</option>
              {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
            {errors.semesterId && <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.semesterId}</p>}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="sub-teacher" className="input-label">Assign Teacher</label>
            <select id="sub-teacher" className={`input-field ${errors.teacherId ? 'error' : ''}`} value={form.teacherId} onChange={handle('teacherId')}>
              <option value="">Select Teacher</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.department})</option>)}
            </select>
            {errors.teacherId && <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.teacherId}</p>}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }} id="add-subject-submit-btn">
              <span>+ Add Subject</span>
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminSubjects() {
  const { subjects, setSubjects, teachers } = useApp();
  const [search, setSearch] = useState('');
  const [semFilter, setSemFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = subjects.filter(s => {
    const ms = search.toLowerCase();
    return (
      (!ms || s.name.toLowerCase().includes(ms) || s.code?.toLowerCase().includes(ms)) &&
      (!semFilter || s.semesterId === parseInt(semFilter))
    );
  });

  return (
    <DashboardLayout title="Subject Management">
      {showModal && <AddSubjectModal onClose={() => setShowModal(false)} onAdded={(sub) => setSubjects(s => [...s, sub])} />}

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="input-field" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} aria-label="Search subjects" />
        </div>
        <select className="input-field" style={{ width: 'auto', minWidth: '130px' }} value={semFilter} onChange={e => setSemFilter(e.target.value)} aria-label="Filter by semester">
          <option value="">All Semesters</option>
          {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }} id="add-subject-btn">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={16} /> Add Subject</span>
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Subject Name</th>
              <th>Semester</th>
              <th>Assigned Teacher</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No subjects found</td></tr>
            ) : filtered.map((s, i) => {
              const teacher = teachers.find(t => t.id === s.teacherId);
              return (
                <tr key={s.id}>
                  <td style={{ color: '#64748b' }}>{i + 1}</td>
                  <td><span className="badge badge-purple">{s.code}</span></td>
                  <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{s.name}</td>
                  <td><span className="badge badge-info">Sem {s.semesterId}</span></td>
                  <td>
                    {teacher ? (
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{teacher.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{teacher.department}</div>
                      </div>
                    ) : <span style={{ color: '#475569', fontSize: '0.85rem' }}>Unassigned</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
