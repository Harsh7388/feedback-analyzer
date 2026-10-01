import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import { PrivacyPolicyPage, TermsPage, CookiePolicyPage } from './pages/PolicyPages';

// Student
import StudentDashboard from './components/student/StudentDashboard';
import StudentFeedback from './components/student/StudentFeedback';

// Teacher
import TeacherDashboard from './components/teacher/TeacherDashboard';
import TeacherStudents from './components/teacher/TeacherStudents';
import TeacherForms from './components/teacher/TeacherForms';

// Admin
import AdminDashboard from './components/admin/AdminDashboard';
import AdminFeedbacks from './components/admin/AdminFeedbacks';
import AdminSentiment from './components/admin/AdminSentiment';
import AdminStudents from './components/admin/AdminStudents';
import AdminTeachers from './components/admin/AdminTeachers';
import AdminSubjects from './components/admin/AdminSubjects';

// Shared
import CookieBanner from './components/shared/CookieBanner';
import AnimatedBackground from './components/shared/AnimatedBackground';

// ─── Protected Route Guards ────────────────────────────────────────
function RequireAuth({ children, role }) {
  const { currentUser, loading } = useApp();
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <AnimatedBackground />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading FeedSense...</p>
        </div>
      </div>
    );
  }
  if (!currentUser) return <Navigate to="/" replace />;
  if (role && currentUser.role !== role) return <Navigate to="/" replace />;
  return children;
}

function PublicOnly({ children }) {
  const { currentUser } = useApp();
  if (currentUser) {
    const paths = { student: '/student', teacher: '/teacher', admin: '/admin' };
    return <Navigate to={paths[currentUser.role] || '/'} replace />;
  }
  return children;
}

// ─── App Routes ───────────────────────────────────────────────────
function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicOnly><LandingPage /></PublicOnly>} />
        <Route path="/login/:role" element={<PublicOnly><LoginPage /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />

        {/* Policy pages - always accessible */}
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />

        {/* Student routes */}
        <Route path="/student" element={<RequireAuth role="student"><StudentDashboard /></RequireAuth>} />
        <Route path="/student/feedback" element={<RequireAuth role="student"><StudentFeedback /></RequireAuth>} />

        {/* Teacher routes */}
        <Route path="/teacher" element={<RequireAuth role="teacher"><TeacherDashboard /></RequireAuth>} />
        <Route path="/teacher/students" element={<RequireAuth role="teacher"><TeacherStudents /></RequireAuth>} />
        <Route path="/teacher/forms" element={<RequireAuth role="teacher"><TeacherForms /></RequireAuth>} />

        {/* Admin routes */}
        <Route path="/admin" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/feedbacks" element={<RequireAuth role="admin"><AdminFeedbacks /></RequireAuth>} />
        <Route path="/admin/sentiment" element={<RequireAuth role="admin"><AdminSentiment /></RequireAuth>} />
        <Route path="/admin/students" element={<RequireAuth role="admin"><AdminStudents /></RequireAuth>} />
        <Route path="/admin/teachers" element={<RequireAuth role="admin"><AdminTeachers /></RequireAuth>} />
        <Route path="/admin/subjects" element={<RequireAuth role="admin"><AdminSubjects /></RequireAuth>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global components */}
      <CookieBanner />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '0.875rem',
            fontSize: '0.9rem',
            fontFamily: "'Inter', sans-serif",
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#0f172a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0f172a' } },
        }}
      />
    </>
  );
}

// ─── Root App ─────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
