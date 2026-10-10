import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import { ClipboardList, Search, Plus, Eye, X } from 'lucide-react';
import { getFeedbackForms, createFeedbackForm } from '../../utils/storage';
import { defaultFeedbackQuestions } from '../../data/initialData';
import toast from 'react-hot-toast';

function CreateFormModal({ subjects, onClose, onCreated }) {
  const [selectedSubId, setSelectedSubId] = useState(subjects[0]?.id || '');
  const [title, setTitle] = useState('');
  
  React.useEffect(() => {
    const sub = subjects.find(s => s.id === selectedSubId);
    if (sub) setTitle(`Feedback for ${sub.name}`);
  }, [selectedSubId, subjects]);

  const handleCreate = () => {
    const sub = subjects.find(s => s.id === selectedSubId);
    if (!sub) return toast.error('Please select a subject');
    if (!title.trim()) return toast.error('Form title required');
    
    try {
      createFeedbackForm({
        subjectId: sub.id,
        teacherId: sub.teacherId,
        semester: sub.semesterId,
        title: title.trim(),
        questions: defaultFeedbackQuestions,
      });
      toast.success('Feedback form created! All default questions added automatically.');
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="modal-overlay" role="dialog">
      <div className="modal-box anim-scale-in" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9' }}>
            Create Feedback Form
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {subjects.length === 0 ? (
          <p style={{ color: '#f87171', fontSize: '0.9rem' }}>You have no subjects assigned. Please contact admin.</p>
        ) : (
          <>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="input-label">Select Subject & Semester</label>
              <select 
                className="input-field" 
                value={selectedSubId} 
                onChange={e => setSelectedSubId(e.target.value)}
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name} (Sem {s.semesterId})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="input-label">Form Title</label>
              <input 
                className="input-field" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
              />
            </div>
            
            <div style={{ background: 'rgba(99,102,241,0.08)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              ℹ️ Note: 9 standard feedback questions will be automatically added to this form.
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleCreate} className="btn-primary" style={{ flex: 1 }}>
                Create Form
              </button>
              <button onClick={onClose} className="btn-secondary">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function TeacherForms() {
  const { currentUser, subjects, refreshData } = useApp();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const teacherSubjects = useMemo(() => subjects.filter(s => s.teacherId === currentUser?.id), [subjects, currentUser]);
  const forms = useMemo(() => getFeedbackForms().filter(f => f.teacherId === currentUser?.id), [currentUser]);

  const filtered = forms.filter(f => {
    const sub = subjects.find(s => s.id === f.subjectId);
    return !search || sub?.name.toLowerCase().includes(search.toLowerCase()) || f.title?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <DashboardLayout title="Feedback Forms">
      {showModal && (
        <CreateFormModal 
          subjects={teacherSubjects} 
          onClose={() => setShowModal(false)} 
          onCreated={refreshData} 
        />
      )}

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="input-field" placeholder="Search forms..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} aria-label="Search forms" />
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
          <Plus size={16} /> Create New Form
        </button>
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
