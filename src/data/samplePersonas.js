export const SAMPLE_PERSONAS = [
  {
    id: 'user-aanya',
    name: 'Aanya Sharma',
    handle: '@aanya_s',
    role: 'The Student',
    year: '3rd Year, CS & Eng',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    initials: 'AS',
    bio: 'Preparing for midterm database exams. Looking for 2-3 focused peers to drill complex SQL joins and indexing.',
    goals: ['DBMS', 'SQL Joins & Indexing', 'Database Normalization'],
    primaryCategory: 'Study',
    preferredAvailability: 'Today, 7 PM',
    availabilityKey: 'today_evening', // normalized key for matching
    commitment: 'Focused',
    joinedMissions: ['m-dbms-1']
  },
  {
    id: 'user-rohan',
    name: 'Rohan Verma',
    handle: '@rohan_builds',
    role: 'The Builder',
    year: '2nd Year, Software Eng',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    initials: 'RV',
    bio: 'Passionate about React & Node. Seeking teammates to brainstorm, design, and code a project for the upcoming campus hackathon.',
    goals: ['Hackathon', 'React & Full-Stack', 'AI Tooling'],
    primaryCategory: 'Hackathon',
    preferredAvailability: 'This Weekend',
    availabilityKey: 'this_weekend',
    commitment: 'Focused',
    joinedMissions: ['m-hack-1']
  },
  {
    id: 'user-mehak',
    name: 'Mehak Patel',
    handle: '@mehak_p',
    role: 'The Career Preparer',
    year: '4th Year, Information Tech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    initials: 'MP',
    bio: 'Targeting SDE internship and placement rounds. Looking for peer mock interviews on System Design and core DSA patterns.',
    goals: ['Mock Interviews', 'System Design', 'DSA LeetCode'],
    primaryCategory: 'Career',
    preferredAvailability: 'Weekdays 6 PM',
    availabilityKey: 'weekday_evenings',
    commitment: 'Regular',
    joinedMissions: ['m-interview-1']
  },
  {
    id: 'user-dev',
    name: 'Devansh Roy',
    handle: '@dev_codes',
    role: 'The Explorer',
    year: '1st Year, Computer Science',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initials: 'DR',
    bio: 'Learning modern web development. Looking for accountability partners to build small open-source portfolio apps.',
    goals: ['Web Development', 'JavaScript & Tailwind', 'Git Collaboration'],
    primaryCategory: 'Projects',
    preferredAvailability: 'Flexible / Evenings',
    availabilityKey: 'flexible',
    commitment: 'Casual',
    joinedMissions: []
  }
];

export const DEFAULT_CURRENT_USER_ID = 'user-aanya';
