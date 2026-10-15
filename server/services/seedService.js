import { User } from '../models/User.js';
import { Mission } from '../models/Mission.js';
import { Membership } from '../models/Membership.js';
import { ChecklistTask } from '../models/ChecklistTask.js';

export const SEED_PERSONAS = [
  {
    demoKey: 'user-aanya',
    name: 'Aanya Sharma',
    email: 'aanya@peerbridge.edu',
    password: 'Password123!',
    handle: '@aanya_s',
    role: 'The Student',
    year: '3rd Year, CS & Eng',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    initials: 'AS',
    bio: 'Preparing for midterm database exams. Looking for 2-3 focused peers to drill complex SQL joins and indexing.',
    goals: ['DBMS', 'SQL Joins & Indexing', 'Database Normalization'],
    primaryCategory: 'Study',
    preferredAvailability: 'Today, 7 PM',
    availabilityKey: 'today_evening',
    commitment: 'Focused'
  },
  {
    demoKey: 'user-rohan',
    name: 'Rohan Verma',
    email: 'rohan@peerbridge.edu',
    password: 'Password123!',
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
    commitment: 'Focused'
  },
  {
    demoKey: 'user-mehak',
    name: 'Mehak Patel',
    email: 'mehak@peerbridge.edu',
    password: 'Password123!',
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
    commitment: 'Regular'
  },
  {
    demoKey: 'user-dev',
    name: 'Devansh Roy',
    email: 'devansh@peerbridge.edu',
    password: 'Password123!',
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
    commitment: 'Casual'
  }
];

export const AUXILIARY_STUDENTS = [
  {
    demoKey: 'user-kabir',
    name: 'Kabir Joshi',
    email: 'kabir@peerbridge.edu',
    password: 'Password123!',
    role: 'Student',
    year: '3rd Year CS',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  },
  {
    demoKey: 'user-priya',
    name: 'Priya Nair',
    email: 'priya@peerbridge.edu',
    password: 'Password123!',
    role: 'Student',
    year: '3rd Year IT',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    demoKey: 'user-sara',
    name: 'Sara Al-Mansoor',
    email: 'sara@peerbridge.edu',
    password: 'Password123!',
    role: 'Student',
    year: '3rd Year Design',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    demoKey: 'user-tanya',
    name: 'Tanya Bose',
    email: 'tanya@peerbridge.edu',
    password: 'Password123!',
    role: 'Student',
    year: '4th Year CS',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    demoKey: 'user-arjun',
    name: 'Arjun Sen',
    email: 'arjun@peerbridge.edu',
    password: 'Password123!',
    role: 'Student',
    year: '3rd Year CS',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  },
  {
    demoKey: 'user-zain',
    name: 'Zainab Khan',
    email: 'zainab@peerbridge.edu',
    password: 'Password123!',
    role: 'Student',
    year: '3rd Year CS',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80'
  },
  {
    demoKey: 'user-diya',
    name: 'Diya Rao',
    email: 'diya@peerbridge.edu',
    password: 'Password123!',
    role: 'Student',
    year: '3rd Year ECE',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_MISSION_DEFINITIONS = [
  {
    title: 'DBMS Revision Session',
    category: 'Study',
    description: 'Revise joins, subqueries, and aggregate functions together for tomorrow\'s midterm exam.',
    subject: 'DBMS / SQL',
    availability: 'Today, 7 PM',
    availabilityKey: 'today_evening',
    groupSize: 4,
    commitment: 'Focused',
    hostKey: 'user-aanya',
    memberKeys: ['user-aanya', 'user-kabir', 'user-priya'],
    tasks: [
      { text: 'Revise joins (Inner, Left, Right, Full Outer)', completed: true },
      { text: 'Practise correlated and nested subqueries', completed: false },
      { text: 'Solve 5 challenging SQL exam questions', completed: false },
      { text: 'Review query execution plans and mistakes together', completed: false }
    ]
  },
  {
    title: 'HackSprint: Campus Ride-Share MVP',
    category: 'Hackathon',
    description: 'Build a real-time carpool & campus commute web app in 36 hours for the Smart Campus Hackathon.',
    subject: 'React & Node.js',
    availability: 'This Weekend',
    availabilityKey: 'this_weekend',
    groupSize: 4,
    commitment: 'Focused',
    hostKey: 'user-rohan',
    memberKeys: ['user-rohan', 'user-sara'],
    tasks: [
      { text: 'Finalize user stories and high-fidelity Figma flow', completed: true },
      { text: 'Scaffold Vite + Express mono-repo and Prisma DB', completed: true },
      { text: 'Implement live campus route matching prototype', completed: false },
      { text: 'Prepare 3-minute pitch deck and demo script', completed: false }
    ]
  },
  {
    title: 'System Design & Behavioral Mock Interviews',
    category: 'Career',
    description: 'Bi-weekly peer mock interview rounds focusing on URL shortener, rate limiters, and STAR behavioral answers.',
    subject: 'System Design',
    availability: 'Weekdays 6 PM',
    availabilityKey: 'weekday_evenings',
    groupSize: 3,
    commitment: 'Regular',
    hostKey: 'user-mehak',
    memberKeys: ['user-mehak', 'user-tanya'],
    tasks: [
      { text: 'Conduct 45-min mock interview: Design TinyURL / Rate Limiter', completed: true },
      { text: 'Exchange critical feedback on communication & bottlenecks', completed: true },
      { text: 'Rehearse 3 behavioral stories using STAR method', completed: false }
    ]
  },
  {
    title: 'OS Concurrency & Semaphore Workshop',
    category: 'Study',
    description: 'Solve classic producer-consumer and dining philosophers synchronization problems in C.',
    subject: 'Operating Systems',
    availability: 'Today, 7 PM',
    availabilityKey: 'today_evening',
    groupSize: 3,
    commitment: 'Focused',
    hostKey: 'user-arjun',
    memberKeys: ['user-arjun', 'user-zain', 'user-diya'], // Full circle (3/3)
    tasks: [
      { text: 'Trace deadlock conditions and mutual exclusion proofs', completed: true },
      { text: 'Implement producer-consumer problem using POSIX semaphores', completed: true },
      { text: 'Review textbook past paper solutions for race conditions', completed: true }
    ]
  },
  {
    title: 'Web3 & Solidity Smart Contract Audit Sprint',
    category: 'Projects',
    description: 'Review security vulnerabilities in ERC-20 staking contracts and write comprehensive unit tests with Foundry.',
    subject: 'Solidity & Foundry',
    availability: 'This Weekend',
    availabilityKey: 'this_weekend',
    groupSize: 4,
    commitment: 'Focused',
    hostKey: 'user-rohan',
    memberKeys: ['user-rohan'],
    tasks: [
      { text: 'Set up Foundry fuzzing tests for staking reentrancy', completed: false },
      { text: 'Document Slither static analysis warnings and gas fixes', completed: false },
      { text: 'Publish joint security report on GitHub repository', completed: false }
    ]
  },
  {
    title: 'Full-Stack SaaS Boilerplate with Auth',
    category: 'Projects',
    description: 'Build a production-ready starter template with Next.js, Supabase, Tailwind, and Stripe subscription webhook flow.',
    subject: 'TypeScript & Next.js',
    availability: 'Flexible / Evenings',
    availabilityKey: 'flexible',
    groupSize: 5,
    commitment: 'Casual',
    hostKey: 'user-dev',
    memberKeys: ['user-dev', 'user-sara', 'user-priya'],
    tasks: [
      { text: 'Draft folder structure, clean architecture, and ESLint configs', completed: true },
      { text: 'Implement JWT session handling and role-based route guard', completed: false },
      { text: 'Add Stripe checkout flow with test webhook verification', completed: false },
      { text: 'Write README quickstart and deployment guide for Vercel', completed: false }
    ]
  }
];

/**
 * Seed or reset database to clean initial state
 */
export async function seedDatabase(forceReset = false) {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0 && !forceReset) {
      console.log(`Database already populated (${userCount} users). Skipping seed.`);
      return;
    }

    if (forceReset) {
      console.log('Resetting all collections to clean demo state...');
      await ChecklistTask.deleteMany({});
      await Membership.deleteMany({});
      await Mission.deleteMany({});
      await User.deleteMany({});
    }

    console.log('Seeding student personas and auxiliary accounts...');
    const userMap = new Map();

    // Seed Personas
    for (const persona of [...SEED_PERSONAS, ...AUXILIARY_STUDENTS]) {
      const user = await User.create({
        name: persona.name,
        email: persona.email,
        password: persona.password,
        handle: persona.handle,
        role: persona.role,
        year: persona.year,
        avatar: persona.avatar,
        initials: persona.initials,
        bio: persona.bio || '',
        goals: persona.goals || [],
        primaryCategory: persona.primaryCategory || 'Study',
        preferredAvailability: persona.preferredAvailability || 'Today, 7 PM',
        availabilityKey: persona.availabilityKey || 'flexible',
        commitment: persona.commitment || 'Regular'
      });
      userMap.set(persona.demoKey, user);
    }

    console.log('Seeding initial campus missions, memberships, and checklists...');
    for (const def of INITIAL_MISSION_DEFINITIONS) {
      const hostUser = userMap.get(def.hostKey) || userMap.get('user-aanya');

      const mission = await Mission.create({
        title: def.title,
        category: def.category,
        description: def.description,
        subject: def.subject,
        availability: def.availability,
        availabilityKey: def.availabilityKey,
        groupSize: def.groupSize,
        commitment: def.commitment,
        createdBy: hostUser._id,
        status: 'Active'
      });

      // Seed memberships
      for (const memberKey of def.memberKeys) {
        const memberUser = userMap.get(memberKey);
        if (memberUser) {
          const isHost = memberUser._id.toString() === hostUser._id.toString();
          await Membership.create({
            user: memberUser._id,
            mission: mission._id,
            role: isHost ? 'Host' : 'Member',
            joinedAt: new Date(Date.now() - Math.floor(Math.random() * 86400000))
          });
        }
      }

      // Seed tasks
      for (let i = 0; i < def.tasks.length; i++) {
        const taskDef = def.tasks[i];
        await ChecklistTask.create({
          mission: mission._id,
          text: taskDef.text,
          completed: taskDef.completed,
          completedBy: taskDef.completed ? hostUser._id : null,
          order: i
        });
      }
    }

    console.log('✅ PeerBridge database successfully initialized with demo seed data.');
  } catch (error) {
    console.error('❌ Error during seedDatabase:', error);
    throw error;
  }
}
