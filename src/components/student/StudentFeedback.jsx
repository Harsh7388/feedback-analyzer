import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import { Star, Send, CheckCircle, BookOpen, ChevronRight, X, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { submitFeedback, getFeedbacks } from '../../utils/storage';
import { defaultFeedbackQuestions } from '../../data/initialData';
import toast from 'react-hot-toast';

// ─── Star Rating Component ────────────────────────────────────────
function StarRating({ value, onChange, questionId }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }} role="group" aria-label="Star rating">
      <div style={{ display: 'flex', gap: '0.3rem' }}>
        {[1, 2, 3, 4, 5].map(s => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            className={`star ${(hover || value) >= s ? 'filled' : 'empty'}`}
            aria-label={`${s} star${s !== 1 ? 's' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.8rem',
              color: (hover || value) >= s ? '#fbbf24' : '#475569',
              transition: 'transform 0.15s, color 0.15s',
              transform: (hover || value) >= s ? 'scale(1.1)' : 'scale(1)',
              padding: '0 2px',
            }}
          >
            ★
          </button>
        ))}
      </div>
      {value > 0 && (
        <span style={{
          fontSize: '0.82rem',
          color: '#fbbf24',
          marginLeft: '0.5rem',
          fontWeight: 700,
          background: 'rgba(251,191,36,0.1)',
          padding: '0.2rem 0.6rem',
          borderRadius: '0.5rem',
          border: '1px solid rgba(251,191,36,0.25)',
        }}>
          {['', '1 — Poor', '2 — Fair', '3 — Good', '4 — Very Good', '5 — Excellent'][value]}
        </span>
      )}
    </div>
  );
}

// ─── Thank You Modal ─────────────────────────────────────────────
function ThankYouModal({ onClose, onGoDashboard }) {
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="thankyou-title">
      <div className="modal-box anim-scale-in" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: '440px', padding: '2.5rem 2rem' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Animated checkmark */}
        <div style={{ position: 'relative', marginBottom: '1.5rem', display: 'inline-block' }}>
          <div style={{
            width: 84, height: 84, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.1))',
            border: '2px solid rgba(34,197,94,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 0 40px rgba(34,197,94,0.35)',
            animation: 'pulse 2s infinite',
          }}>
            <CheckCircle size={44} color="#22c55e" />
          </div>
        </div>

        <h2 id="thankyou-title" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.75rem' }}>
          Feedback Submitted! 🎉
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Thank you for providing your honest feedback. Your responses are recorded anonymously and will help improve academic quality.
        </p>

        <div style={{
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '0.875rem',
          padding: '0.875rem 1rem',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          color: '#a5b4fc',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          textAlign: 'left',
        }}>
          <Sparkles size={18} color="#818cf8" style={{ flexShrink: 0 }} />
          <span>FeedSense AI will analyze feedback sentiment to generate actionable reports.</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
          <button
            onClick={onGoDashboard}
            className="btn-primary"
            style={{ width: '100%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 4px 20px rgba(34,197,94,0.4)' }}
          >
            <span>Back to Student Dashboard</span>
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ width: '100%' }}
          >
            <span>Submit More Feedback</span>
          </button>
        </div>

        <style>{`
          @keyframes pulse { 0%, 100% { box-shadow: 0 0 35px rgba(34,197,94,0.3); } 50% { box-shadow: 0 0 55px rgba(34,197,94,0.5); } }
        `}</style>
      </div>
    </div>
  );
}

// ─── Feedback Form ────────────────────────────────────────────────
function FeedbackForm({ form, subject, teacher, studentId, onSubmit, onCancel }) {
  const questions = form?.questions || defaultFeedbackQuestions;
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    questions.filter(q => q.type === 'rating').forEach(q => {
      if (!ratings[q.id]) errs[q.id] = 'Please provide a star rating';
    });
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please answer all rating questions before submitting');
      return;
    }

    const ratingVals = Object.values(ratings);
    const avgRating = ratingVals.reduce((a, b) => a + b, 0) / ratingVals.length;

    setSubmitting(true);
    try {
      onSubmit({
        studentId,
        subjectId: subject.id,
        formId: form.id,
        teacherId: subject.teacherId,
        semester: subject.semesterId,
        ratings,
        comment: comment.trim(),
        avgRating,
      });
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <div className="card anim-fade-up" style={{ padding: '2rem', maxWidth: '780px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'none', border: 'none', color: '#94a3b8',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: '0.4rem', fontSize: '0.85rem', marginBottom: '1rem',
            padding: 0,
          }}
        >
          <ArrowLeft size={16} /> Back to All Feedback
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-purple">{subject.code}</span>
              <span className="badge badge-info">Semester {subject.semesterId}</span>
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.35rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.35rem' }}>
              {form.title || `Feedback for ${subject.name}`}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Faculty in charge: <strong style={{ color: '#e2e8f0' }}>👨‍🏫 {teacher?.name || 'Assigned Faculty'}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} noValidate>
        {questions.map((q, i) => (
          <div
            key={q.id}
            style={{
              marginBottom: '1.75rem',
              paddingBottom: '1.75rem',
              borderBottom: i < questions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            <label
              htmlFor={q.id}
              style={{
                display: 'block',
                color: '#f1f5f9',
                fontSize: '0.95rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: '#818cf8', marginRight: '0.4rem' }}>{i + 1}.</span>
              {q.text}
            </label>

            {q.type === 'rating' ? (
              <>
                <StarRating
                  value={ratings[q.id] || 0}
                  onChange={v => {
                    setRatings(r => ({ ...r, [q.id]: v }));
                    setErrors(er => ({ ...er, [q.id]: '' }));
                  }}
                  questionId={q.id}
                />
                {errors[q.id] && (
                  <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', fontWeight: 500 }}>
                    ⚠ {errors[q.id]}
                  </p>
                )}
              </>
            ) : (
              <div>
                <textarea
                  id={q.id}
                  placeholder="Share your thoughts, teaching methods feedback, or suggestions for improvement..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="input-field"
                  rows={4}
                  style={{ resize: 'vertical', fontFamily: 'inherit', width: '100%' }}
                />
                <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.35rem' }}>
                  Optional · Your feedback is completely confidential
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              minWidth: '160px',
              padding: '0.85rem',
              fontSize: '0.95rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 4px 18px rgba(99,102,241,0.35)',
            }}
            id={`submit-feedback-${form.id}`}
          >
            <Send size={16} />
            <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            style={{ minWidth: '100px', padding: '0.85rem' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function StudentFeedback() {
  const { currentUser, subjects, teachers, feedbackForms, feedbacks, refreshData } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedForm, setSelectedForm] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const semSubjects = useMemo(() => {
    return subjects.filter(s => s.semesterId === currentUser?.semester);
  }, [subjects, currentUser]);

  const allFeedbacks = useMemo(() => feedbacks || getFeedbacks(), [feedbacks]);

  // Aggregate subjects with forms and submissions
  const subjectFeedbackList = useMemo(() => {
    return semSubjects.map(sub => {
      const teacher = teachers.find(t => t.id === sub.teacherId);
      
      // Get all active forms for this subject
      let activeForms = feedbackForms.filter(f => f.subjectId === sub.id && f.isActive);
      
      // Fallback: if no active forms exist in storage, create a default one
      if (activeForms.length === 0) {
        activeForms = [{
          id: `form_${sub.id}`,
          subjectId: sub.id,
          teacherId: sub.teacherId,
          semester: sub.semesterId,
          title: `Feedback for ${sub.name}`,
          questions: defaultFeedbackQuestions,
          isActive: true,
        }];
      }

      // Check which forms are submitted
      const formsWithStatus = activeForms.map(form => {
        const submission = allFeedbacks.find(
          f => f.studentId === currentUser?.id && f.subjectId === sub.id && f.formId === form.id
        ) || allFeedbacks.find(
          // Fallback check if student submitted for this subject
          f => f.studentId === currentUser?.id && f.subjectId === sub.id
        );
        return {
          form,
          isSubmitted: Boolean(submission),
          submission,
        };
      });

      const pendingForms = formsWithStatus.filter(f => !f.isSubmitted);
      const submittedForms = formsWithStatus.filter(f => f.isSubmitted);

      return {
        ...sub,
        teacher,
        formsWithStatus,
        pendingForms,
        submittedForms,
        isAllDone: pendingForms.length === 0 && submittedForms.length > 0,
      };
    });
  }, [semSubjects, teachers, feedbackForms, allFeedbacks, currentUser]);

  // Handle query or route state passed from dashboard
  useEffect(() => {
    if (location.state?.subjectId && subjectFeedbackList.length > 0) {
      const targetSub = subjectFeedbackList.find(s => s.id === location.state.subjectId);
      if (targetSub) {
        // Find first pending form, or the default form
        const targetFormItem = targetSub.pendingForms[0] || targetSub.formsWithStatus[0];
        if (targetFormItem && !targetFormItem.isSubmitted) {
          setSelectedForm({
            form: targetFormItem.form,
            subject: targetSub,
          });
        }
      }
    }
  }, [location.state, subjectFeedbackList]);

  const handleSubmit = (data) => {
    try {
      submitFeedback(data);
      refreshData();
      setSelectedForm(null);
      setShowThankYou(true);
      toast.success('Feedback submitted successfully! 🎉');
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    }
  };

  if (selectedForm) {
    const subject = semSubjects.find(s => s.id === selectedForm.subject.id) || selectedForm.subject;
    const teacher = teachers.find(t => t.id === subject?.teacherId);
    return (
      <DashboardLayout title="Submit Feedback">
        <FeedbackForm
          form={selectedForm.form}
          subject={subject}
          teacher={teacher}
          studentId={currentUser?.id}
          onSubmit={handleSubmit}
          onCancel={() => setSelectedForm(null)}
        />
        {showThankYou && (
          <ThankYouModal
            onClose={() => setShowThankYou(false)}
            onGoDashboard={() => navigate('/student')}
          />
        )}
      </DashboardLayout>
    );
  }

  const totalPending = subjectFeedbackList.reduce((a, b) => a + b.pendingForms.length, 0);

  return (
    <DashboardLayout title="My Feedback">
      {showThankYou && (
        <ThankYouModal
          onClose={() => setShowThankYou(false)}
          onGoDashboard={() => navigate('/student')}
        />
      )}

      {/* Top summary */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9' }}>
            Semester {currentUser?.semester} Feedback Forms
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Submit feedback for each course and faculty member below
          </p>
        </div>

        {totalPending > 0 ? (
          <div style={{
            background: 'rgba(234,179,8,0.12)',
            border: '1px solid rgba(234,179,8,0.25)',
            borderRadius: '0.625rem',
            padding: '0.5rem 0.875rem',
            fontSize: '0.82rem',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontWeight: 600,
          }}>
            <Clock size={14} />
            {totalPending} Pending Feedback{totalPending !== 1 ? 's' : ''}
          </div>
        ) : (
          <div style={{
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: '0.625rem',
            padding: '0.5rem 0.875rem',
            fontSize: '0.82rem',
            color: '#4ade80',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontWeight: 600,
          }}>
            <CheckCircle size={14} />
            All Feedback Complete
          </div>
        )}
      </div>

      {subjectFeedbackList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <BookOpen size={56} style={{ opacity: 0.2, marginBottom: '1rem', color: '#6366f1' }} />
          <h3 style={{ color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '0.5rem' }}>No Subjects Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No registered subjects found for Semester {currentUser?.semester}.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {subjectFeedbackList.map((sub, i) => (
            <div
              key={sub.id}
              className={`card anim-fade-up delay-${(i % 4 + 1) * 100}`}
              style={{
                border: sub.isAllDone ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(99,102,241,0.15)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span className="badge badge-purple">{sub.code}</span>
                    <span className="badge badge-info">Semester {sub.semesterId}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9' }}>{sub.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>👨‍🏫 {sub.teacher?.name || 'Assigned Faculty'}</p>
                </div>
                <div>
                  {sub.isAllDone ? (
                    <span className="badge badge-positive" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle size={12} /> Completed
                    </span>
                  ) : (
                    <span className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} /> Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons for Forms */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {sub.pendingForms.map(({ form }) => (
                  <button
                    key={form.id}
                    onClick={() => setSelectedForm({ form, subject: sub })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))',
                      border: '1px solid rgba(99,102,241,0.3)',
                      borderRadius: '0.75rem',
                      padding: '0.875rem 1.25rem',
                      cursor: 'pointer',
                      color: '#ffffff',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))';
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))';
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                    }}
                    id={`open-feedback-${form.id}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '8px',
                        background: 'rgba(251,191,36,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Star size={17} color="#fbbf24" fill="#fbbf24" />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>
                          {form.title || `Fill Feedback Form`}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Rate teaching quality, clarity, curriculum & interaction
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600 }}>
                      <span>Start</span>
                      <ChevronRight size={16} />
                    </div>
                  </button>
                ))}

                {sub.submittedForms.map(({ form, submission }) => (
                  <div
                    key={form.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(34,197,94,0.06)',
                      border: '1px solid rgba(34,197,94,0.18)',
                      borderRadius: '0.75rem',
                      padding: '0.875rem 1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <CheckCircle size={20} color="#22c55e" />
                      <div>
                        <div style={{ fontSize: '0.88rem', color: '#4ade80', fontWeight: 600 }}>
                          {form.title || 'Feedback Form'} — Submitted ✓
                        </div>
                        {submission?.comment && (
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem', fontStyle: 'italic' }}>
                            "{submission.comment.length > 50 ? `${submission.comment.slice(0, 50)}...` : submission.comment}"
                          </div>
                        )}
                      </div>
                    </div>
                    {submission?.avgRating && (
                      <span style={{
                        background: 'rgba(251,191,36,0.12)',
                        border: '1px solid rgba(251,191,36,0.25)',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.8rem',
                        color: '#fbbf24',
                        fontWeight: 700,
                      }}>
                        ★ {submission.avgRating.toFixed(1)}/5
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
