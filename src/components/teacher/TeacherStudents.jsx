import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../shared/DashboardLayout';
import { Users, Search } from 'lucide-react';
import { getStudents, getFeedbackForms, hasStudentSubmitted } from '../../utils/storage';

export default function TeacherStudents() {
  const { currentUser, subjects } = useApp();
  const [search, setSearch] = useState('');

  const teacherSubjects = useMemo(() => subjects.filter(s => s.teacherId === currentUser?.id), [subjects, currentUser]);
  const allStudents = useMemo(() => getStudents(), []);
  const forms = useMemo(() => getFeedbackForms(), []);

  const semesterStudents = useMemo(() => {
    const sems = new Set(teacherSubjects.map(s => s.semesterId));
    return allStudents.filter(s => sems.has(s.semester));
  }, [teacherSubjects, allStudents]);

  const filtered = semesterStudents.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  const getStudentStatus = (student) => {
    const studentSubjects = teacherSubjects.filter(s => s.semesterId === student.semester);
    const totalForms = studentSubjects.flatMap(sub => forms.filter(f => f.subjectId === sub.id));
    const submitted = totalForms.filter(f => hasStudentSubmitted(student.id, f.subjectId, f.id));
    return { total: totalForms.length, submitted: submitted.length };
  };

  return (
    <DashboardLayout title="Students">
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
        <input className="input-field" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} aria-label="Search students" />
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <Users size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No students enrolled in your semester(s)</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {filtered.map((student, i) => {
            const { total, submitted } = getStudentStatus(student);
            const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;
            const done = total > 0 && submitted === total;
            return (
              <div key={student.id} className={`card anim-fade-up delay-${(i % 5 + 1) * 100}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: done ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.15)',
                    border: `1.5px solid ${done ? 'rgba(34,197,94,0.3)' : 'rgba(99,102,241,0.25)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: done ? '#22c55e' : '#6366f1',
                  }}>
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.9rem' }}>{student.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{student.rollNo} · Sem {student.semester}</div>
                  </div>
                </div>

                {total > 0 ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem' }}>
                      <span>Submission Progress</span>
                      <span style={{ color: done ? '#4ade80' : '#fbbf24' }}>{submitted}/{total}</span>
                    </div>
                    <div className="progress-bar" style={{ marginBottom: '0.5rem' }}>
                      <div className="progress-fill" style={{ width: `${pct}%`, background: done ? '#22c55e' : 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: done ? '#4ade80' : '#94a3b8', fontWeight: done ? 600 : 400 }}>
                      {done ? '✓ All feedback submitted' : `${total - submitted} form(s) pending`}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '0.82rem', color: '#475569' }}>No feedback forms available</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
