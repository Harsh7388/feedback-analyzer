import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import { BookOpen, Users, CheckCircle, Clock, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { getFeedbackForms, getStudents, hasStudentSubmitted, createFeedbackForm } from '../../utils/storage';
import { defaultFeedbackQuestions } from '../../data/initialData';
import toast from 'react-hot-toast';

function CreateFormModal({ subject, onClose, onCreated }) {
  const [title, setTitle] = useState(`Feedback for ${subject.name}`);
  const [questions, setQuestions] = useState(defaultFeedbackQuestions);
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    if (!title.trim()) { toast.error('Form title required'); return; }
    setLoading(true);
    try {
      const form = createFeedbackForm({
        subjectId: subject.id,
        teacherId: subject.teacherId,
        semester: subject.semesterId,
        title: title.trim(),
        questions,
      });
      toast.success('Feedback form created!');
      onCreated(form);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Create feedback form">
      <div className="modal-box anim-scale-in" style={{ maxWidth: '560px' }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.35rem' }}>
          Create Feedback Form
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>For: <strong style={{ color: '#a5b4fc' }}>{subject.name}</strong></p>

        <label className="input-label" htmlFor="form-title">Form Title</label>
        <input id="form-title" className="input-field" value={title} onChange={e => setTitle(e.target.value)} style={{ marginBottom: '1.25rem' }} />

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
            Questions ({questions.length}) — Default questions will be used
          </p>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {questions.map((q, i) => (
              <div key={q.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.02)', marginBottom: '0.35rem' }}>
                <span style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.8rem', minWidth: '20px' }}>{i + 1}.</span>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4 }}>{q.text}</p>
                <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', flexShrink: 0 }}>{q.type}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleCreate} disabled={loading} className="btn-primary" style={{ flex: 1 }} id="create-form-confirm-btn">
            <span>{loading ? 'Creating...' : 'Create Form'}</span>
          </button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { currentUser, subjects, refreshData } = useApp();
  const [expanded, setExpanded] = useState({});
  const [createFor, setCreateFor] = useState(null);

  const teacherSubjects = useMemo(() => subjects.filter(s => s.teacherId === currentUser?.id), [subjects, currentUser]);
  const allStudents = useMemo(() => getStudents(), []);
  const forms = useMemo(() => getFeedbackForms(), []);

  const subjectData = useMemo(() => {
    return teacherSubjects.map(sub => {
      const semStudents = allStudents.filter(s => s.semester === sub.semesterId);
      const subForms = forms.filter(f => f.subjectId === sub.id);
      const submittedStudents = semStudents.filter(s =>
        subForms.some(f => hasStudentSubmitted(s.id, sub.id, f.id))
      );
      return {
        ...sub,
        students: semStudents,
        forms: subForms,
        submitted: submittedStudents.length,
        pending: semStudents.length - submittedStudents.length,
        submittedIds: new Set(submittedStudents.map(s => s.id)),
      };
    });
  }, [teacherSubjects, allStudents, forms]);

  const totalStudents = useMemo(() => {
    const sems = new Set(teacherSubjects.map(s => s.semesterId));
    return allStudents.filter(s => sems.has(s.semester)).length;
  }, [teacherSubjects, allStudents]);

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  return (
    <DashboardLayout title="Teacher Dashboard">
      {createFor && (
        <CreateFormModal
          subject={createFor}
          onClose={() => setCreateFor(null)}
          onCreated={() => refreshData()}
        />
      )}

      {/* AI/ML Context Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '1rem',
        padding: '1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }} className="anim-fade-up">
        <div style={{ fontSize: '2rem' }}>🧠</div>
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '0.25rem' }}>
            AI-Driven Feedback Analysis
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>
            Welcome to FeedSence. Please note that this is not a standard static website; it is an intelligent AI/ML based platform. 
            Student feedback is automatically processed using Machine Learning algorithms to determine sentiment (positive, neutral, negative) and extract key insights.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: BookOpen, label: 'Subjects', value: teacherSubjects.length, color: '#6366f1' },
          { icon: Users, label: 'Students', value: totalStudents, color: '#06b6d4' },
          { icon: CheckCircle, label: 'Submitted', value: subjectData.reduce((a, b) => a + b.submitted, 0), color: '#22c55e' },
          { icon: Clock, label: 'Pending', value: subjectData.reduce((a, b) => a + b.pending, 0), color: '#f59e0b' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="stat-card anim-fade-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Icon size={16} color={color} />
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color, fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Subject Cards */}
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>
        Your Subjects & Feedback Status
      </h3>

      {subjectData.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No subjects assigned to you. Contact admin.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {subjectData.map((sub, i) => (
            <div key={sub.id} className={`card anim-fade-up delay-${(i % 5 + 1) * 100}`}>
              {/* Subject Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-purple">{sub.code}</span>
                    <span className="badge badge-info">Sem {sub.semesterId}</span>
                    {sub.forms.length > 0 && <span className="badge badge-positive">{sub.forms.length} Form{sub.forms.length !== 1 ? 's' : ''}</span>}
                  </div>
                  <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem' }}>{sub.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{sub.students.length} students enrolled</p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => setCreateFor(sub)} className="btn-secondary" style={{ padding: '0.5rem 0.875rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }} id={`create-form-btn-${sub.id}`}>
                    <Plus size={14} /> New Form
                  </button>
                  {sub.students.length > 0 && (
                    <button onClick={() => toggleExpand(sub.id)} style={{
                      background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: '0.5rem', padding: '0.5rem', color: '#a5b4fc', cursor: 'pointer',
                    }} aria-label="Toggle student list">
                      {expanded[sub.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  )}
                </div>
              </div>

              {/* Progress */}
              {sub.students.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem' }}>
                    <span>Feedback Submission Rate</span>
                    <span style={{ color: sub.pending === 0 ? '#4ade80' : '#fbbf24' }}>
                      {sub.submitted}/{sub.students.length} ({Math.round((sub.submitted / Math.max(sub.students.length, 1)) * 100)}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${(sub.submitted / Math.max(sub.students.length, 1)) * 100}%`,
                      background: sub.pending === 0 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    }} />
                  </div>
                </div>
              )}

              {/* Student List (collapsed by default) */}
              {expanded[sub.id] && sub.students.length > 0 && (
                <div style={{ marginTop: '1rem', animation: 'fadeInUp 0.3s ease' }}>
                  <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    Student Submission Status
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {sub.students.map(student => {
                      const done = sub.submittedIds.has(student.id);
                      return (
                        <div key={student.id} style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          background: done ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${done ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)'}`,
                          borderRadius: '0.625rem', padding: '0.5rem 0.75rem',
                          fontSize: '0.82rem',
                        }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: done ? '#22c55e' : '#475569', flexShrink: 0 }} />
                          <span style={{ color: done ? '#4ade80' : '#94a3b8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {student.name}
                          </span>
                          <span style={{ color: done ? '#4ade80' : '#475569', fontSize: '0.7rem' }}>
                            {done ? '✓' : '○'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
