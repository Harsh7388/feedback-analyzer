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
  
  // New Semester 7 Subjects (from Timetable)
  { id: 's7-5', semesterId: 7, name: 'Artificial Intelligence', code: 'BCS701', teacherId: 't16' },
  { id: 's7-6', semesterId: 7, name: 'Cryptography and Network Security', code: 'BCS072', teacherId: 't17' },
  { id: 's7-7', semesterId: 7, name: 'Project Management', code: 'BOE070', teacherId: 't18' },
  { id: 's7-8', semesterId: 7, name: 'Mini Project or Internship Assessment', code: 'BCS752', teacherId: 't19' },
  { id: 's7-9', semesterId: 7, name: 'Startup and Entrepreneurial Activity Assessment', code: 'BCS754', teacherId: 't20' },
  { id: 's7-10', semesterId: 7, name: 'Control of Robotic Systems', code: 'MNRB701', teacherId: 't21' },
  { id: 's7-11', semesterId: 7, name: 'Artificial Intelligence LAB', code: 'BCS751', teacherId: 't16' },
  { id: 's7-12', semesterId: 7, name: 'Project I', code: 'BCS753', teacherId: 't25' },
  { id: 's7-13', semesterId: 7, name: 'Technical Training', code: 'TT701', teacherId: 't22' },
  { id: 's7-14', semesterId: 7, name: 'Soft Skill', code: 'SS701', teacherId: 't23' },
  { id: 's7-15', semesterId: 7, name: 'Aptitude', code: 'APT701', teacherId: 't24' },
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
  { id: 't16', name: 'Mr. Pankaj Kumar', email: 'pankaj.kumar@college.edu', department: 'Computer Science', username: 'pankaj.kumar', password: 'teacher123' },
  { id: 't17', name: 'Mrs. Akanksha Singh', email: 'akanksha.singh@college.edu', department: 'Computer Science', username: 'akanksha.singh', password: 'teacher123' },
  { id: 't18', name: 'Mr. Santosh Kumar', email: 'santosh.kumar@college.edu', department: 'Computer Science', username: 'santosh.kumar', password: 'teacher123' },
  { id: 't19', name: 'Mr. Ankur Srivastava', email: 'ankur.srivastava@college.edu', department: 'Computer Science', username: 'ankur.srivastava', password: 'teacher123' },
  { id: 't20', name: 'T&P CELL', email: 'tnp@college.edu', department: 'Training & Placement', username: 'tnp.cell', password: 'teacher123' },
  { id: 't21', name: 'Prof. S.K. Sharma', email: 'sk.sharma@college.edu', department: 'Computer Science', username: 'sk.sharma', password: 'teacher123' },
  { id: 't22', name: 'Mr. Vivek Singh', email: 'vivek.singh@college.edu', department: 'Training & Placement', username: 'vivek.singh', password: 'teacher123' },
  { id: 't23', name: 'Mrs. Nisha Pandey', email: 'nisha.pandey@college.edu', department: 'Soft Skills', username: 'nisha.pandey', password: 'teacher123' },
  { id: 't24', name: 'Mr. Saurabh Srivastava', email: 'saurabh.srivastava@college.edu', department: 'Training & Placement', username: 'saurabh.srivastava', password: 'teacher123' },
  { id: 't25', name: 'All Dept. Faculty', email: 'alldept@college.edu', department: 'Computer Science', username: 'all.dept', password: 'teacher123' },
];

export const initialStudents = [
  { id: 'stu_1', name: 'Rahul Sharma', rollNo: '230101', semester: 1, password: 'password123', createdAt: new Date().toISOString() },
  { id: 'stu_2', name: 'Priya Singh', rollNo: '230102', semester: 1, password: 'password123', createdAt: new Date().toISOString() },
  { id: 'stu_3', name: 'Amit Kumar', rollNo: '220301', semester: 3, password: 'password123', createdAt: new Date().toISOString() },
  { id: 'stu_4', name: 'Neha Gupta', rollNo: '220302', semester: 3, password: 'password123', createdAt: new Date().toISOString() },
  { id: 'stu_5', name: 'Vikram Patel', rollNo: '210501', semester: 5, password: 'password123', createdAt: new Date().toISOString() },
  { id: 'stu_6', name: 'Anjali Desai', rollNo: '210502', semester: 5, password: 'password123', createdAt: new Date().toISOString() },
  { id: 'stu_7', name: 'Suresh Menon', rollNo: '200701', semester: 7, password: 'password123', createdAt: new Date().toISOString() },
  { id: 'stu_8', name: 'Kavita Joshi', rollNo: '200702', semester: 7, password: 'password123', createdAt: new Date().toISOString() },
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

export const initialFeedbacks = [];
const demoComments = [
  { text: "Great teaching, very clear concepts.", rating: 5 },
  { text: "Good class, but could use more practical examples.", rating: 3 },
  { text: "Very difficult to understand, needs improvement.", rating: 2 },
  { text: "Excellent faculty and well structured course.", rating: 5 },
  { text: "Average teaching style.", rating: 3 },
  { text: "The practicals were not well organized and boring.", rating: 2 },
  { text: "Brilliant explanations and very helpful out of class.", rating: 5 },
  { text: "Okayish, but talks too fast.", rating: 3 },
  { text: "Terrible experience, syllabus not covered.", rating: 1 },
];

initialSubjects.forEach((sub, subIdx) => {
  // Let's add 2 to 4 feedbacks per subject randomly
  const numFeedbacks = (subIdx % 3) + 2;
  const formId = `form_${sub.id}`;
  
  for (let i = 0; i < numFeedbacks; i++) {
    const stu = initialStudents[i % initialStudents.length];
    // Mix the comments up
    const review = demoComments[(subIdx * 2 + i) % demoComments.length];
    
    // Add some random variation to ratings
    const ratingVar = Math.max(1, Math.min(5, review.rating + (Math.random() > 0.5 ? 0 : -1)));
    
    initialFeedbacks.push({
      id: `fb_demo_${sub.id}_${i}`,
      studentId: stu.id,
      subjectId: sub.id,
      formId: formId,
      semester: sub.semesterId,
      answers: {
        q1: ratingVar,
        q2: ratingVar,
        q3: review.rating,
        q4: ratingVar,
        q5: review.rating,
        q6: ratingVar,
        q7: review.rating,
        q8: ratingVar,
        q9: review.text
      },
      submittedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    });
  }
});

