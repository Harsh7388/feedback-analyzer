// Storage utility for FeedSense - manages localStorage operations

const KEYS = {
  STUDENTS: 'feedsense_students',
  TEACHERS: 'feedsense_teachers',
  SUBJECTS: 'feedsense_subjects',
  FEEDBACKS: 'feedsense_feedbacks',
  FEEDBACK_FORMS: 'feedsense_feedback_forms',
  INITIALIZED: 'feedsense_initialized',
  CURRENT_USER: 'feedsense_current_user',
};

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch { return null; }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { console.error('Storage error:', e); }
  },
  remove: (key) => localStorage.removeItem(key),
  clear: () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};

// ─── Student Operations ─────────────────────────────────────────────────────

export const getStudents = () => storage.get(KEYS.STUDENTS) || [];
export const saveStudents = (students) => storage.set(KEYS.STUDENTS, students);

export const registerStudent = (data) => {
  const students = getStudents();
  if (students.find(s => s.rollNo === data.rollNo)) {
    throw new Error('Roll number already registered');
  }
  const newStudent = {
    id: `stu_${Date.now()}`,
    rollNo: data.rollNo,
    name: data.name,
    semester: parseInt(data.semester),
    password: data.password,
    createdAt: new Date().toISOString(),
  };
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
};

export const loginStudent = (rollNo, password) => {
  const students = getStudents();
  const student = students.find(s => s.rollNo === rollNo && s.password === password);
  if (!student) throw new Error('Invalid Roll Number or Password');
  return student;
};

// ─── Teacher Operations ─────────────────────────────────────────────────────

export const getTeachers = () => storage.get(KEYS.TEACHERS) || [];
export const saveTeachers = (teachers) => storage.set(KEYS.TEACHERS, teachers);

export const loginTeacher = (username, password) => {
  const teachers = getTeachers();
  const teacher = teachers.find(t => t.username === username && t.password === password);
  if (!teacher) throw new Error('Invalid Teacher ID or Password');
  return teacher;
};

export const addTeacher = (data) => {
  const teachers = getTeachers();
  if (teachers.find(t => t.username === data.username)) {
    throw new Error('Teacher ID already exists');
  }
  const newTeacher = {
    id: `t_${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  teachers.push(newTeacher);
  saveTeachers(teachers);
  return newTeacher;
};

// ─── Subject Operations ─────────────────────────────────────────────────────

export const getSubjects = () => storage.get(KEYS.SUBJECTS) || [];
export const saveSubjects = (subjects) => storage.set(KEYS.SUBJECTS, subjects);

export const getSubjectsBySemester = (sem) => {
  return getSubjects().filter(s => s.semesterId === parseInt(sem));
};

export const addSubject = (data) => {
  const subjects = getSubjects();
  const newSubject = { id: `sub_${Date.now()}`, ...data };
  subjects.push(newSubject);
  saveSubjects(subjects);
  return newSubject;
};

// ─── Feedback Form Operations ────────────────────────────────────────────────

export const getFeedbackForms = () => storage.get(KEYS.FEEDBACK_FORMS) || [];
export const saveFeedbackForms = (forms) => storage.set(KEYS.FEEDBACK_FORMS, forms);

export const createFeedbackForm = (data) => {
  const forms = getFeedbackForms();
  const newForm = {
    id: `form_${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  forms.push(newForm);
  saveFeedbackForms(forms);
  return newForm;
};

export const getFormsForSubject = (subjectId) => {
  return getFeedbackForms().filter(f => f.subjectId === subjectId && f.isActive);
};

// ─── Feedback Operations ─────────────────────────────────────────────────────

export const getFeedbacks = () => storage.get(KEYS.FEEDBACKS) || [];
export const saveFeedbacks = (feedbacks) => storage.set(KEYS.FEEDBACKS, feedbacks);

export const submitFeedback = (data) => {
  const feedbacks = getFeedbacks();
  // Check if already submitted
  const existing = feedbacks.find(
    f => f.studentId === data.studentId && f.subjectId === data.subjectId && f.formId === data.formId
  );
  if (existing) throw new Error('Feedback already submitted for this subject');
  
  const newFeedback = {
    id: `fb_${Date.now()}`,
    ...data,
    submittedAt: new Date().toISOString(),
  };
  feedbacks.push(newFeedback);
  saveFeedbacks(feedbacks);
  return newFeedback;
};

export const hasStudentSubmitted = (studentId, subjectId, formId) => {
  const feedbacks = getFeedbacks();
  if (formId) {
    return feedbacks.some(f => f.studentId === studentId && f.subjectId === subjectId && (f.formId === formId || !f.formId));
  }
  return feedbacks.some(f => f.studentId === studentId && f.subjectId === subjectId);
};

export const getFeedbacksBySubject = (subjectId) => {
  return getFeedbacks().filter(f => f.subjectId === subjectId);
};

export const getFeedbacksByTeacher = (teacherId) => {
  const subjects = getSubjects().filter(s => s.teacherId === teacherId);
  const subjectIds = subjects.map(s => s.id);
  return getFeedbacks().filter(f => subjectIds.includes(f.subjectId));
};

export const getFeedbacksBySemester = (semester) => {
  const subjects = getSubjectsBySemester(semester);
  const subjectIds = subjects.map(s => s.id);
  return getFeedbacks().filter(f => subjectIds.includes(f.subjectId));
};

// ─── Session Management ─────────────────────────────────────────────────────

export const getCurrentUser = () => storage.get(KEYS.CURRENT_USER);
export const setCurrentUser = (user) => storage.set(KEYS.CURRENT_USER, user);
export const clearCurrentUser = () => storage.remove(KEYS.CURRENT_USER);

// ─── Initialization ──────────────────────────────────────────────────────────

export const isInitialized = () => storage.get(KEYS.INITIALIZED) === true;
export const markInitialized = () => storage.set(KEYS.INITIALIZED, true);

export { KEYS };
