import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import { BookOpen, CheckCircle, Clock, Star, Award, ArrowRight, Sparkles } from 'lucide-react';
import { getFeedbacks } from '../../utils/storage';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { currentUser, subjects, teachers, feedbackForms, feedbacks } = useApp();

  const semSubjects = useMemo(() => {
    return subjects.filter(s => s.semesterId === currentUser?.semester);
  }, [subjects, currentUser]);

  const allFeedbacks = useMemo(() => feedbacks || getFeedbacks(), [feedbacks]);

  const subjectStats = useMemo(() => {
    return semSubjects.map(sub => {
      // Find forms for this subject
      const activeForms = feedbackForms.filter(f => f.subjectId === sub.id && f.isActive);
      // Determine if submitted
      const submittedFeedback = allFeedbacks.find(
        f => f.studentId === currentUser?.id && f.subjectId === sub.id
      );
      const isSubmitted = Boolean(submittedFeedback);
      const teacher = teachers.find(t => t.id === sub.teacherId);

      return {
        ...sub,
        teacher,
        activeForms,
        isSubmitted,
        submittedFeedback,
        pending: isSubmitted ? 0 : 1,
        total: 1,
      };
    });
  }, [semSubjects, teachers, currentUser, feedbackForms, allFeedbacks]);

  const totalPending = subjectStats.filter(s => !s.isSubmitted).length;
  const totalSubmitted = subjectStats.filter(s => s.isSubmitted).length;

  return (
    <DashboardLayout title="Student Dashboard">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '1.25rem',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }} className="anim-fade-up">
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '7rem', opacity: 0.04 }}>🎓</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.35rem' }}>
              Welcome back, {currentUser?.name || 'Student'}! 👋
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Semester {currentUser?.semester} · Roll No: <strong style={{ color: '#a5b4fc' }}>{currentUser?.rollNo}</strong>
            </p>
          </div>
          
          <Link
            to="/student/feedback"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#ffffff',
              padding: '0.65rem 1.25rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
              transition: 'all 0.2s',
            }}
          >
            <Sparkles size={16} /> Give All Feedback
          </Link>
        </div>

        {totalPending > 0 ? (
          <div style={{
            marginTop: '1.25rem',
            background: 'rgba(234,179,8,0.12)',
            border: '1px solid rgba(234,179,8,0.25)',
            borderRadius: '0.75rem',
            padding: '0.6rem 1rem',
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.85rem', color: '#fbbf24',
          }}>
            <Clock size={15} />
            You have <strong>{totalPending}</strong> pending feedback{totalPending !== 1 ? 's' : ''} to submit for Semester {currentUser?.semester}
          </div>
        ) : (
          <div style={{
            marginTop: '1.25rem',
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: '0.75rem',
            padding: '0.6rem 1rem',
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.85rem', color: '#4ade80',
          }}>
            <CheckCircle size={15} />
            Great job! You have submitted all feedback for this semester.
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: BookOpen, label: 'Semester Subjects', value: semSubjects.length, color: '#6366f1' },
          { icon: CheckCircle, label: 'Feedback Submitted', value: totalSubmitted, color: '#22c55e' },
          { icon: Clock, label: 'Pending Feedback', value: totalPending, color: '#f59e0b' },
          { icon: Award, label: 'Current Semester', value: `Sem ${currentUser?.semester || 1}`, color: '#8b5cf6' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="stat-card anim-fade-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Icon size={16} color={color} />
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color, fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Subjects Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9' }}>
            Your Subjects — Semester {currentUser?.semester}
          </h3>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Click "Give Feedback" to submit your ratings
          </span>
        </div>

        {semSubjects.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No subjects found for Semester {currentUser?.semester}.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {subjectStats.map((sub, i) => (
              <div
                key={sub.id}
                className={`card anim-fade-up delay-${(i % 5 + 1) * 100}`}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: sub.isSubmitted ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(99,102,241,0.2)',
                }}
              >
                <div>
                  {/* Subject code & status badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className="badge badge-purple">{sub.code}</span>
                    {sub.isSubmitted ? (
                      <span className="badge badge-positive" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle size={12} /> Submitted
                      </span>
                    ) : (
                      <span className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} /> Pending
                      </span>
                    )}
                  </div>

                  <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.35rem' }}>
                    {sub.name}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                    👨‍🏫 {sub.teacher?.name || 'Assigned Faculty'}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {sub.isSubmitted ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.6rem 0.875rem',
                      background: 'rgba(34,197,94,0.08)',
                      borderRadius: '0.625rem',
                      fontSize: '0.82rem',
                      color: '#4ade80',
                      fontWeight: 600,
                    }}>
                      <span>✓ Feedback Submitted</span>
                      {sub.submittedFeedback?.avgRating && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                          ★ {sub.submittedFeedback.avgRating.toFixed(1)}/5
                        </span>
                      )}
                    </div>
                  ) : (
                    <Link
                      to="/student/feedback"
                      state={{ subjectId: sub.id }}
                      id={`give-feedback-btn-${sub.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        borderRadius: '0.625rem', padding: '0.7rem 1rem',
                        color: '#ffffff', fontSize: '0.875rem', fontWeight: 600,
                        textDecoration: 'none', transition: 'all 0.2s',
                        boxShadow: '0 4px 14px rgba(99,102,241,0.25)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.25)';
                      }}
                    >
                      <Star size={15} fill="#ffffff" color="#ffffff" /> Give Feedback
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
