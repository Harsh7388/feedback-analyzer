import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import { GraduationCap, Search, Trash2 } from 'lucide-react';
import { saveStudents } from '../../utils/storage';
import toast from 'react-hot-toast';

export default function AdminStudents() {
  const { students, setStudents } = useApp();
  const [search, setSearch] = useState('');
  const [semFilter, setSemFilter] = useState('');

  const filtered = students.filter(s => {
    const ms = search.toLowerCase();
    return (
      (!ms || s.name.toLowerCase().includes(ms) || s.rollNo.toLowerCase().includes(ms)) &&
      (!semFilter || s.semester === parseInt(semFilter))
    );
  });

  const handleDelete = (id) => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    const updated = students.filter(s => s.id !== id);
    saveStudents(updated);
    setStudents(updated);
    toast.success('Student removed');
  };

  return (
    <DashboardLayout title="Student Management">
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="input-field" placeholder="Search by name or roll number..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} aria-label="Search students" />
        </div>
        <select className="input-field" style={{ width: 'auto', minWidth: '130px' }} value={semFilter} onChange={e => setSemFilter(e.target.value)} aria-label="Filter by semester">
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="data-table" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Roll No</th>
              <th>Semester</th>
              <th>Registered</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No students found</td></tr>
            ) : filtered.map((s, i) => (
              <tr key={s.id}>
                <td style={{ color: '#64748b' }}>{i + 1}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.1))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', fontWeight: 700, color: '#22c55e',
                    }}>{s.name.charAt(0)}</div>
                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                  </div>
                </td>
                <td><span className="badge badge-purple">{s.rollNo}</span></td>
                <td><span className="badge badge-info">Sem {s.semester}</span></td>
                <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDelete(s.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', padding: '0.35rem 0.625rem', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                    aria-label={`Delete student ${s.name}`}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
