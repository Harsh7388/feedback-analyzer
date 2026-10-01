import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import { ClipboardList, Search, Plus, Eye } from 'lucide-react';
import { getFeedbackForms } from '../../utils/storage';

export default function TeacherForms() {
  const { currentUser, subjects, refreshData } = useApp();
  const [search, setSearch] = useState('');

  const teacherSubjects = useMemo(() => subjects.filter(s => s.teacherId === currentUser?.id), [subjects, currentUser]);
  const forms = useMemo(() => getFeedbackForms().filter(f => f.teacherId === currentUser?.id), [currentUser]);

  const filtered = forms.filter(f => {
    const sub = subjects.find(s => s.id === f.subjectId);
    return !search || sub?.name.toLowerCase().includes(search.toLowerCase()) || f.title?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <DashboardLayout title="Feedback Forms">
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
        <input className="input-field" placeholder="Search forms..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} aria-label="Search forms" />
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <ClipboardList size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p style={{ marginBottom: '1rem' }}>No feedback forms created yet</p>
          <p style={{ fontSize: '0.85rem' }}>Go to Dashboard → click "New Form" on any subject to create one</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filtered.map((form, i) => {
            const subject = subjects.find(s => s.id === form.subjectId);
            return (
              <div key={form.id} className={`card anim-fade-up delay-${(i % 5 + 1) * 100}`}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-purple">{subject?.code}</span>
                  <span className="badge badge-info">Sem {form.semester}</span>
                  {form.isActive && <span className="badge badge-positive">Active</span>}
                </div>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f1f5f9', marginBottom: '0.35rem', fontSize: '0.95rem' }}>{form.title}</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem' }}>{subject?.name}</p>
                <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span>📋 {form.questions?.length || 0} questions</span>
                  <span>📅 {new Date(form.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
