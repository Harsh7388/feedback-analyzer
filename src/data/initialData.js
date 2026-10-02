// Initial seed data for FeedSense
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const initialSubjects = [
  // Semester 1
  { id: 's1-1', semesterId: 1, name: 'Mathematics I', code: 'MA101', teacherId: 't1' },
  { id: 's1-2', semesterId: 1, name: 'Physics', code: 'PH101', teacherId: 't2' },
  { id: 's1-3', semesterId: 1, name: 'Engineering Drawing', code: 'ME101', teacherId: 't3' },
  { id: 's1-4', semesterId: 1, name: 'Communication Skills', code: 'EN101', teacherId: 't4' },
  // Semester 2
  { id: 's2-1', semesterId: 2, name: 'Mathematics II', code: 'MA201', teacherId: 't1' },
  { id: 's2-2', semesterId: 2, name: 'Chemistry', code: 'CH201', teacherId: 't5' },
  { id: 's2-3', semesterId: 2, name: 'Basic Electronics', code: 'EC201', teacherId: 't6' },
  { id: 's2-4', semesterId: 2, name: 'Programming in C', code: 'CS201', teacherId: 't7' },
  // Semester 3
  { id: 's3-1', semesterId: 3, name: 'Data Structures', code: 'CS301', teacherId: 't7' },
  { id: 's3-2', semesterId: 3, name: 'Discrete Mathematics', code: 'MA301', teacherId: 't1' },
  { id: 's3-3', semesterId: 3, name: 'Digital Logic', code: 'EC301', teacherId: 't6' },
  { id: 's3-4', semesterId: 3, name: 'Object Oriented Programming', code: 'CS302', teacherId: 't8' },
  // Semester 4
  { id: 's4-1', semesterId: 4, name: 'Algorithms', code: 'CS401', teacherId: 't8' },
  { id: 's4-2', semesterId: 4, name: 'Computer Organization', code: 'CS402', teacherId: 't9' },
  { id: 's4-3', semesterId: 4, name: 'Database Management', code: 'CS403', teacherId: 't10' },
  { id: 's4-4', semesterId: 4, name: 'Operating Systems', code: 'CS404', teacherId: 't9' },
  // Semester 5
  { id: 's5-1', semesterId: 5, name: 'Machine Learning', code: 'AI501', teacherId: 't11' },
  { id: 's5-2', semesterId: 5, name: 'Computer Networks', code: 'CS501', teacherId: 't10' },
  { id: 's5-3', semesterId: 5, name: 'Software Engineering', code: 'CS502', teacherId: 't12' },
  { id: 's5-4', semesterId: 5, name: 'Web Technologies', code: 'CS503', teacherId: 't8' },
  // Semester 6
  { id: 's6-1', semesterId: 6, name: 'Deep Learning', code: 'AI601', teacherId: 't11' },
  { id: 's6-2', semesterId: 6, name: 'Natural Language Processing', code: 'AI602', teacherId: 't11' },
  { id: 's6-3', semesterId: 6, name: 'Cloud Computing', code: 'CS601', teacherId: 't12' },
  { id: 's6-4', semesterId: 6, name: 'Cybersecurity', code: 'CS602', teacherId: 't9' },
  // Semester 7
  { id: 's7-1', semesterId: 7, name: 'Big Data Analytics', code: 'AI701', teacherId: 't11' },
  { id: 's7-2', semesterId: 7, name: 'Computer Vision', code: 'AI702', teacherId: 't13' },
  { id: 's7-3', semesterId: 7, name: 'IoT Systems', code: 'CS701', teacherId: 't13' },
  { id: 's7-4', semesterId: 7, name: 'Project Management', code: 'CS702', teacherId: 't12' },
  // Semester 8
  { id: 's8-1', semesterId: 8, name: 'Advanced AI', code: 'AI801', teacherId: 't11' },
  { id: 's8-2', semesterId: 8, name: 'Blockchain Technology', code: 'CS801', teacherId: 't13' },
  { id: 's8-3', semesterId: 8, name: 'Research Methodology', code: 'CS802', teacherId: 't12' },
  { id: 's8-4', semesterId: 8, name: 'Project Work', code: 'CS803', teacherId: 't14' },
];

export const initialTeachers = [
  { id: 't1', name: 'Dr. Anita Sharma', email: 'anita.sharma@college.edu', department: 'Mathematics', username: 'anita.sharma', password: 'teacher123' },
  { id: 't2', name: 'Prof. Rajesh Kumar', email: 'rajesh.kumar@college.edu', department: 'Physics', username: 'rajesh.kumar', password: 'teacher123' },
  { id: 't3', name: 'Dr. Meena Patel', email: 'meena.patel@college.edu', department: 'Mechanical', username: 'meena.patel', password: 'teacher123' },
  { id: 't4', name: 'Prof. Sunita Rao', email: 'sunita.rao@college.edu', department: 'English', username: 'sunita.rao', password: 'teacher123' },
  { id: 't5', name: 'Dr. Vinod Mishra', email: 'vinod.mishra@college.edu', department: 'Chemistry', username: 'vinod.mishra', password: 'teacher123' },
  { id: 't6', name: 'Prof. Priya Singh', email: 'priya.singh@college.edu', department: 'Electronics', username: 'priya.singh', password: 'teacher123' },
  { id: 't7', name: 'Dr. Amit Verma', email: 'amit.verma@college.edu', department: 'Computer Science', username: 'amit.verma', password: 'teacher123' },
  { id: 't8', name: 'Prof. Kavita Joshi', email: 'kavita.joshi@college.edu', department: 'Computer Science', username: 'kavita.joshi', password: 'teacher123' },
  { id: 't9', name: 'Dr. Suresh Gupta', email: 'suresh.gupta@college.edu', department: 'Computer Science', username: 'suresh.gupta', password: 'teacher123' },
  { id: 't10', name: 'Prof. Neha Agarwal', email: 'neha.agarwal@college.edu', department: 'Computer Science', username: 'neha.agarwal', password: 'teacher123' },
  { id: 't11', name: 'Dr. Ravi Shankar', email: 'ravi.shankar@college.edu', department: 'AI/ML', username: 'ravi.shankar', password: 'teacher123' },
  { id: 't12', name: 'Prof. Deepa Nair', email: 'deepa.nair@college.edu', department: 'Computer Science', username: 'deepa.nair', password: 'teacher123' },
  { id: 't13', name: 'Dr. Kiran Bhat', email: 'kiran.bhat@college.edu', department: 'AI/ML', username: 'kiran.bhat', password: 'teacher123' },
  { id: 't14', name: 'Prof. Asha Menon', email: 'asha.menon@college.edu', department: 'Computer Science', username: 'asha.menon', password: 'teacher123' },
  { id: 't15', name: 'Harsh', email: 'harsh@college.edu', department: 'Computer Science', username: 'Harsh7388', password: '7388' },
];

export const defaultFeedbackQuestions = [
  { id: 'q1', text: 'How would you rate the teacher\'s overall teaching quality?', type: 'rating' },
  { id: 'q2', text: 'How clearly does the teacher explain concepts?', type: 'rating' },
  { id: 'q3', text: 'How well does the teacher engage with students?', type: 'rating' },
  { id: 'q4', text: 'How would you rate the course content and curriculum?', type: 'rating' },
  { id: 'q5', text: 'How punctual and regular is the teacher?', type: 'rating' },
  { id: 'q6', text: 'How helpful is the teacher outside of class hours?', type: 'rating' },
  { id: 'q7', text: 'How would you rate the practical/lab sessions?', type: 'rating' },
  { id: 'q8', text: 'How effective are the assignments and assessments?', type: 'rating' },
  { id: 'q9', text: 'Additional comments or suggestions:', type: 'text' },
];

export const adminCredentials = {
  username: 'Harsh@123',
  password: '7388',
  name: 'Admin',
  email: 'admin@feedsense.edu',
};

export const initialFeedbackForms = initialSubjects.map(sub => ({
  id: `form_${sub.id}`,
  subjectId: sub.id,
  teacherId: sub.teacherId,
  semester: sub.semesterId,
  title: `Feedback for ${sub.name}`,
  questions: defaultFeedbackQuestions,
  createdAt: new Date().toISOString(),
  isActive: true,
}));

