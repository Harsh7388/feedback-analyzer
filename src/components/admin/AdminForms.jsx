import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import {
  Plus, Trash2, GripVertical, Eye, EyeOff, Calendar, Clock,
  Edit3, CheckCircle, X, ChevronDown, ChevronUp, Sparkles, Copy, Save,
  ToggleLeft, ToggleRight, Hash, AlignLeft, Star, List,
} from 'lucide-react';
import { getFeedbackForms, saveFeedbackForms, createFeedbackForm } from '../../utils/storage';
import { defaultFeedbackQuestions } from '../../data/initialData';
import toast from 'react-hot-toast';

const QUESTION_TYPES = [
  { type: 'rating', label: 'Star Rating', icon: '⭐', desc: '1–5 star scale' },
  { type: 'text', label: 'Text Response', icon: '📝', desc: 'Open-ended comment' },
  { type: 'scale', label: 'Scale 1–10', icon: '📊', desc: 'Numerical scale' },
  { type: 'mcq', label: 'Multiple Choice', icon: '☑️', desc: 'Select one option' },
];

const DEFAULT_TEMPLATES = [
  {
    name: 'Standard Faculty Feedback',
    questions: [
      { id: 'tq1', text: 'How would you rate the teacher\'s overall teaching quality?', type: 'rating' },
      { id: 'tq2', text: 'How clearly does the teacher explain concepts?', type: 'rating' },
      { id: 'tq3', text: 'How well does the teacher engage with students?', type: 'rating' },
      { id: 'tq4', text: 'How would you rate the course content and curriculum?', type: 'rating' },
      { id: 'tq5', text: 'How punctual and regular is the teacher?', type: 'rating' },
      { id: 'tq6', text: 'How helpful is the teacher outside of class hours?', type: 'rating' },
      { id: 'tq7', text: 'Additional comments or suggestions:', type: 'text' },
    ],
  },
  {
    name: 'Lab/Practical Evaluation',
    questions: [
      { id: 'lq1', text: 'How well are lab sessions organized?', type: 'rating' },
      { id: 'lq2', text: 'How would you rate the lab equipment and infrastructure?', type: 'rating' },
      { id: 'lq3', text: 'How clearly are lab objectives explained?', type: 'rating' },
      { id: 'lq4', text: 'How relevant are the experiments to the course?', type: 'rating' },
      { id: 'lq5', text: 'How would you rate instructor support during labs?', type: 'rating' },
      { id: 'lq6', text: 'Suggestions for improving lab sessions:', type: 'text' },
    ],
  },
  {
    name: 'General Course Evaluation',
    questions: [
      { id: 'cq1', text: 'Overall, how satisfied are you with this course?', type: 'rating' },
      { id: 'cq2', text: 'How well does the course meet your learning objectives?', type: 'rating' },
      { id: 'cq3', text: 'How would you rate the difficulty level of this course?', type: 'scale' },
      { id: 'cq4', text: 'How useful are the course assignments and assessments?', type: 'rating' },
      { id: 'cq5', text: 'Would you recommend this course to other students?', type: 'mcq', options: ['Definitely Yes', 'Probably Yes', 'Not Sure', 'Probably Not', 'Definitely Not'] },
      { id: 'cq6', text: 'What can be improved in this course?', type: 'text' },
    ],
  },
];

function QuestionEditor({ question, index, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [expanded, setExpanded] = useState(true);
  const [localText, setLocalText] = useState(question.text);

  const qTypeCfg = QUESTION_TYPES.find(qt => qt.type === question.type) || QUESTION_TYPES[0];

  return (
    <div style={{
      border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: '0.875rem',
      background: 'rgba(99,102,241,0.04)',
      marginBottom: '0.75rem',
      overflow: 'hidden',
    }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', cursor: 'pointer' }}
        onClick={() => setExpanded(v => !v)}
      >
        <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, marginRight: '0.25rem' }}>Q{index + 1}</span>
        <span style={{ fontSize: '1rem' }}>{qTypeCfg.icon}</span>
        <span style={{ flex: 1, fontSize: '0.88rem', color: '#f1f5f9', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {question.text || 'Untitled Question'}
        </span>
        <span style={{ fontSize: '0.72rem', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '0.3rem', flexShrink: 0 }}>
          {qTypeCfg.label}
        </span>
        <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          {!isFirst && <button onClick={onMoveUp} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.2rem' }}><ChevronUp size={14} /></button>}
          {!isLast && <button onClick={onMoveDown} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.2rem' }}><ChevronDown size={14} /></button>}
          <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.2rem' }}><Trash2 size={14} /></button>
          {expanded ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 1rem 1rem 1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
            <label className="input-label">Question Text</label>
            <input
              className="input-field"
              value={localText}
              onChange={e => setLocalText(e.target.value)}
              onBlur={() => onUpdate({ ...question, text: localText })}
              placeholder="Enter your question here..."
              style={{ fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label className="input-label">Question Type</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {QUESTION_TYPES.map(qt => (
                <button
                  key={qt.type}
                  onClick={() => onUpdate({ ...question, type: qt.type })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                    fontSize: '0.78rem', fontWeight: 600,
                    background: question.type === qt.type ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.04)',
                    color: question.type === qt.type ? '#a5b4fc' : '#64748b',
                    border: question.type === qt.type ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span>{qt.icon}</span> {qt.label}
                </button>
              ))}
            </div>
          </div>

          {question.type === 'mcq' && (
            <div>
              <label className="input-label">Options (comma-separated)</label>
              <input
                className="input-field"
                value={(question.options || []).join(', ')}
                onChange={e => onUpdate({ ...question, options: e.target.value.split(',').map(o => o.trim()).filter(Boolean) })}
                placeholder="e.g. Excellent, Good, Average, Poor"
                style={{ fontSize: '0.88rem' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#94a3b8', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={question.required !== false}
                onChange={e => onUpdate({ ...question, required: e.target.checked })}
                style={{ accentColor: '#6366f1' }}
              />
              Required
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

function FormPreviewModal({ form, subject, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box anim-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>
            Preview: {form.title}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        {form.questions.map((q, i) => (
          <div key={q.id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: i < form.questions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <label style={{ color: '#f1f5f9', fontSize: '0.92rem', fontWeight: 600, display: 'block', marginBottom: '0.6rem' }}>
              <span style={{ color: '#818cf8', marginRight: '0.4rem' }}>{i + 1}.</span>
              {q.text}
              {q.required !== false && <span style={{ color: '#ef4444', marginLeft: '0.3rem' }}>*</span>}
            </label>
            {q.type === 'rating' && (
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: '1.6rem', color: '#475569' }}>★</span>)}
              </div>
            )}
            {q.type === 'text' && (
              <div style={{ height: '80px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem' }} />
            )}
            {q.type === 'scale' && (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[1,2,3,4,5,6,7,8,9,10].map(s => (
                  <span key={s} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.4rem', fontSize: '0.82rem', color: '#94a3b8' }}>{s}</span>
                ))}
              </div>
            )}
            {q.type === 'mcq' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {(q.options || ['Option A', 'Option B', 'Option C']).map((opt, j) => (
                  <label key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94a3b8', cursor: 'pointer' }}>
                    <input type="radio" name={`q${q.id}`} style={{ accentColor: '#6366f1' }} disabled />
                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminForms() {
  const { subjects, teachers, feedbackForms, setFeedbackForms, subjects: allSubjects } = useApp();
  const [mode, setMode] = useState('list'); // 'list' | 'create' | 'edit'
  const [previewForm, setPreviewForm] = useState(null);

  // Form builder state
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    semester: '',
    description: '',
    startDate: '',
    endDate: '',
    isActive: true,
    questions: [...defaultFeedbackQuestions],
  });
  const [editingFormId, setEditingFormId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Grouped forms by semester
  const formsBySemester = useMemo(() => {
    const grouped = {};
    feedbackForms.forEach(form => {
      const sem = form.semester || 0;
      if (!grouped[sem]) grouped[sem] = [];
      grouped[sem].push(form);
    });
    return grouped;
  }, [feedbackForms]);

  const getSubject = (id) => subjects.find(s => s.id === id);
  const getTeacher = (id) => teachers.find(t => t.id === id);

  const handleTemplateSelect = (templateName) => {
    if (!templateName) return;
    const tmpl = DEFAULT_TEMPLATES.find(t => t.name === templateName);
    if (tmpl) {
      setFormData(prev => ({ ...prev, questions: tmpl.questions.map(q => ({ ...q, id: `q_${Date.now()}_${Math.random()}` })) }));
      toast.success(`Loaded template: ${templateName}`);
    }
    setSelectedTemplate('');
  };

  const handleSubjectChange = (subjectId) => {
    const sub = subjects.find(s => s.id === subjectId);
    setFormData(prev => ({
      ...prev,
      subjectId,
      semester: sub?.semesterId || '',
      title: sub ? `Feedback for ${sub.name}` : prev.title,
    }));
  };

  const addQuestion = () => {
    const newQ = { id: `q_${Date.now()}`, text: '', type: 'rating', required: true };
    setFormData(prev => ({ ...prev, questions: [...prev.questions, newQ] }));
  };

  const updateQuestion = (index, updated) => {
    setFormData(prev => {
      const qs = [...prev.questions];
      qs[index] = updated;
      return { ...prev, questions: qs };
    });
  };

  const deleteQuestion = (index) => {
    if (formData.questions.length <= 1) { toast.error('Form must have at least one question'); return; }
    setFormData(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) }));
  };

  const moveQuestion = (index, direction) => {
    const qs = [...formData.questions];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= qs.length) return;
    [qs[index], qs[newIndex]] = [qs[newIndex], qs[index]];
    setFormData(prev => ({ ...prev, questions: qs }));
  };

  const handleSaveForm = () => {
    if (!formData.title.trim()) { toast.error('Form title is required'); return; }
    if (!formData.subjectId) { toast.error('Please select a subject'); return; }
    if (formData.questions.some(q => !q.text.trim())) { toast.error('All questions must have text'); return; }

    const forms = getFeedbackForms();
    const sub = subjects.find(s => s.id === formData.subjectId);

    if (editingFormId) {
      const updated = forms.map(f => f.id === editingFormId ? { ...f, ...formData, updatedAt: new Date().toISOString() } : f);
      saveFeedbackForms(updated);
      setFeedbackForms(updated);
      toast.success('Form updated successfully!');
    } else {
      const newForm = {
        id: `form_${Date.now()}`,
        ...formData,
        semester: sub?.semesterId || formData.semester,
        teacherId: sub?.teacherId || '',
        createdAt: new Date().toISOString(),
        isActive: formData.isActive,
      };
      forms.push(newForm);
      saveFeedbackForms(forms);
      setFeedbackForms(forms);
      toast.success('Feedback form created!');
    }

    setMode('list');
    setEditingFormId(null);
    setFormData({ title: '', subjectId: '', semester: '', description: '', startDate: '', endDate: '', isActive: true, questions: [...defaultFeedbackQuestions] });
  };

  const handleEditForm = (form) => {
    setFormData({
      title: form.title,
      subjectId: form.subjectId,
      semester: form.semester,
      description: form.description || '',
      startDate: form.startDate || '',
      endDate: form.endDate || '',
      isActive: form.isActive !== false,
      questions: form.questions || defaultFeedbackQuestions,
    });
    setEditingFormId(form.id);
    setMode('create');
  };

  const handleToggleForm = (formId) => {
    const forms = getFeedbackForms().map(f => f.id === formId ? { ...f, isActive: !f.isActive } : f);
    saveFeedbackForms(forms);
    setFeedbackForms(forms);
    toast.success('Form status updated');
  };

  const handleDeleteForm = (formId) => {
    const forms = getFeedbackForms().filter(f => f.id !== formId);
    saveFeedbackForms(forms);
    setFeedbackForms(forms);
    toast.success('Form deleted');
  };

  const handleDuplicateForm = (form) => {
    const forms = getFeedbackForms();
    const newForm = {
      ...form,
      id: `form_${Date.now()}`,
      title: `Copy of ${form.title}`,
      createdAt: new Date().toISOString(),
    };
    forms.push(newForm);
    saveFeedbackForms(forms);
    setFeedbackForms(forms);
    toast.success('Form duplicated!');
  };

  // ── Render: Create/Edit Mode ──────────────────────────────────────
  if (mode === 'create') {
    return (
      <DashboardLayout title={editingFormId ? 'Edit Feedback Form' : 'Create Feedback Form'}>
        {previewForm && <FormPreviewModal form={previewForm} onClose={() => setPreviewForm(null)} />}

        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          {/* Back button */}
          <button onClick={() => { setMode('list'); setEditingFormId(null); }} className="btn-secondary" style={{ marginBottom: '1.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            ← Back to Forms
          </button>

          {/* Form Settings */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1.25rem' }}>
              📋 Form Settings
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="input-label">Form Title *</label>
                <input className="input-field" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Feedback for Data Structures" />
              </div>
              <div>
                <label className="input-label">Subject *</label>
                <select className="input-field" value={formData.subjectId} onChange={e => handleSubjectChange(e.target.value)}>
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code}) — Sem {s.semesterId}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="input-label">Description (optional)</label>
              <textarea className="input-field" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of this feedback form..." rows={2} style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="input-label">📅 Start Date</label>
                <input className="input-field" type="datetime-local" value={formData.startDate} onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">📅 End Date</label>
                <input className="input-field" type="datetime-local" value={formData.endDate} onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: formData.isActive ? '#22c55e' : '#64748b', display: 'flex', alignItems: 'center' }}
                >
                  {formData.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
                <span style={{ color: formData.isActive ? '#4ade80' : '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>
                  Form is {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </label>
            </div>
          </div>

          {/* Question Builder */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                ❓ Questions ({formData.questions.length})
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select value={selectedTemplate} onChange={e => handleTemplateSelect(e.target.value)} className="input-field" style={{ fontSize: '0.8rem', maxWidth: '200px' }}>
                  <option value="">📄 Load Template</option>
                  {DEFAULT_TEMPLATES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                </select>
                <button onClick={() => setPreviewForm({ ...formData, questions: formData.questions })} className="btn-secondary" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem' }}>
                  <Eye size={14} /> Preview
                </button>
              </div>
            </div>

            <div>
              {formData.questions.map((q, i) => (
                <QuestionEditor
                  key={q.id}
                  question={q}
                  index={i}
                  onUpdate={(updated) => updateQuestion(i, updated)}
                  onDelete={() => deleteQuestion(i)}
                  onMoveUp={() => moveQuestion(i, -1)}
                  onMoveDown={() => moveQuestion(i, 1)}
                  isFirst={i === 0}
                  isLast={i === formData.questions.length - 1}
                />
              ))}
            </div>

            <button onClick={addQuestion} className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem', padding: '0.75rem' }}>
              <Plus size={16} /> Add Question
            </button>
          </div>

          {/* Save */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSaveForm} className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Save size={16} /> {editingFormId ? 'Update Form' : 'Create Form'}
            </button>
            <button onClick={() => { setMode('list'); setEditingFormId(null); }} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Render: List Mode ──────────────────────────────────────────────
  return (
    <DashboardLayout title="Feedback Form Manager">
      {previewForm && <FormPreviewModal form={previewForm} onClose={() => setPreviewForm(null)} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '0.85rem', color: '#a5b4fc' }}>
            📋 {feedbackForms.length} Total Forms
          </div>
          <div style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '0.85rem', color: '#4ade80' }}>
            ✅ {feedbackForms.filter(f => f.isActive !== false).length} Active
          </div>
        </div>
        <button onClick={() => setMode('create')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Create New Form
        </button>
      </div>

      {/* Forms by Semester */}
      {feedbackForms.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '0.5rem' }}>No Forms Created</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Create your first dynamic feedback form with custom questions and scheduling.</p>
          <button onClick={() => setMode('create')} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} /> Create Form with AI Template
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {Object.entries(formsBySemester).sort(([a], [b]) => Number(a) - Number(b)).map(([sem, forms]) => (
            <div key={sem}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', fontWeight: 700, color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📅 {sem === '0' ? 'General Forms' : `Semester ${sem}`}
                <span style={{ fontSize: '0.72rem', background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '0.15rem 0.5rem', borderRadius: '0.3rem' }}>{forms.length} forms</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.875rem' }}>
                {forms.map(form => {
                  const sub = getSubject(form.subjectId);
                  const teacher = sub ? getTeacher(sub.teacherId) : null;
                  const isScheduled = form.startDate || form.endDate;
                  const now = new Date();
                  const isLive = form.isActive !== false &&
                    (!form.startDate || new Date(form.startDate) <= now) &&
                    (!form.endDate || new Date(form.endDate) >= now);

                  return (
                    <div key={form.id} className="card" style={{ border: `1px solid ${isLive ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {form.title}
                          </h4>
                          {sub && <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{sub.code} · {teacher?.name || 'Unknown Teacher'}</p>}
                        </div>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '0.4rem', flexShrink: 0, marginLeft: '0.5rem',
                          background: isLive ? 'rgba(34,197,94,0.15)' : 'rgba(100,116,139,0.15)',
                          color: isLive ? '#4ade80' : '#64748b',
                          border: `1px solid ${isLive ? 'rgba(34,197,94,0.3)' : 'rgba(100,116,139,0.2)'}`,
                        }}>
                          {isLive ? '🟢 LIVE' : '⚫ OFF'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        <span>❓ {form.questions?.length || 0} questions</span>
                        {isScheduled && <span>📅 Scheduled</span>}
                        {form.startDate && <span>Start: {new Date(form.startDate).toLocaleDateString()}</span>}
                        {form.endDate && <span>End: {new Date(form.endDate).toLocaleDateString()}</span>}
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button onClick={() => setPreviewForm(form)} title="Preview" style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', padding: '0.4rem', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
                          <Eye size={13} /> Preview
                        </button>
                        <button onClick={() => handleEditForm(form)} title="Edit" style={{ flex: 1, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.5rem', padding: '0.4rem', cursor: 'pointer', color: '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
                          <Edit3 size={13} /> Edit
                        </button>
                        <button onClick={() => handleToggleForm(form.id)} title="Toggle Active" style={{ padding: '0.4rem 0.5rem', background: form.isActive !== false ? 'rgba(34,197,94,0.08)' : 'rgba(100,116,139,0.08)', border: `1px solid ${form.isActive !== false ? 'rgba(34,197,94,0.2)' : 'rgba(100,116,139,0.15)'}`, borderRadius: '0.5rem', cursor: 'pointer', color: form.isActive !== false ? '#4ade80' : '#64748b' }}>
                          {form.isActive !== false ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                        </button>
                        <button onClick={() => handleDuplicateForm(form)} title="Duplicate" style={{ padding: '0.4rem 0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5rem', cursor: 'pointer', color: '#64748b' }}>
                          <Copy size={15} />
                        </button>
                        <button onClick={() => { if (window.confirm('Delete this form?')) handleDeleteForm(form.id); }} title="Delete" style={{ padding: '0.4rem 0.5rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '0.5rem', cursor: 'pointer', color: '#f87171' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

