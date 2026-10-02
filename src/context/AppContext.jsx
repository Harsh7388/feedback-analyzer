import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCurrentUser, setCurrentUser, clearCurrentUser,
  getStudents, saveStudents, getTeachers, saveTeachers,
  getSubjects, saveSubjects, getFeedbackForms, saveFeedbackForms,
  getFeedbacks, saveFeedbacks,
  isInitialized, markInitialized,
} from '../utils/storage';
import { initialSubjects, initialTeachers, initialFeedbackForms, initialStudents } from '../data/initialData';
import { adminCredentials } from '../data/initialData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [feedbackForms, setFeedbackForms] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookieConsent, setCookieConsent] = useState(null);

  // Initialize app data
  useEffect(() => {
    if (!isInitialized() || getFeedbackForms().length === 0) {
      if (getTeachers().length === 0) saveTeachers(initialTeachers);
      if (getSubjects().length === 0) saveSubjects(initialSubjects);
      if (getFeedbackForms().length === 0) saveFeedbackForms(initialFeedbackForms);
      if (getStudents().length === 0) saveStudents(initialStudents);
      markInitialized();
    }

    // Load all data
    setStudents(getStudents());
    setTeachers(getTeachers());
    setSubjects(getSubjects());
    setFeedbackForms(getFeedbackForms());
    setFeedbacks(getFeedbacks());

    // Restore session
    const savedUser = getCurrentUser();
    if (savedUser) setUser(savedUser);

    // Cookie consent
    const consent = localStorage.getItem('feedsense_cookie_consent');
    setCookieConsent(consent);

    setLoading(false);
  }, []);

  const refreshData = useCallback(() => {
    setStudents(getStudents());
    setTeachers(getTeachers());
    setSubjects(getSubjects());
    setFeedbackForms(getFeedbackForms());
    setFeedbacks(getFeedbacks());
  }, []);

  const login = useCallback((user) => {
    setUser(user);
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearCurrentUser();
  }, []);

  const acceptCookies = useCallback(() => {
    localStorage.setItem('feedsense_cookie_consent', 'accepted');
    setCookieConsent('accepted');
  }, []);

  const declineCookies = useCallback(() => {
    localStorage.setItem('feedsense_cookie_consent', 'declined');
    setCookieConsent('declined');
  }, []);

  const getSubjectsByTeacher = useCallback((teacherId) => {
    return subjects.filter(s => s.teacherId === teacherId);
  }, [subjects]);

  const getTeacherById = useCallback((id) => {
    return teachers.find(t => t.id === id) || null;
  }, [teachers]);

  const getSubjectById = useCallback((id) => {
    return subjects.find(s => s.id === id) || null;
  }, [subjects]);

  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';
  const isStudent = currentUser?.role === 'student';

  const value = {
    currentUser, login, logout,
    students, setStudents,
    teachers, setTeachers,
    subjects, setSubjects,
    feedbackForms, setFeedbackForms,
    feedbacks, setFeedbacks,
    loading, refreshData,
    cookieConsent, acceptCookies, declineCookies,
    getSubjectsByTeacher, getTeacherById, getSubjectById,
    isAdmin, isTeacher, isStudent,
    adminCredentials,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
