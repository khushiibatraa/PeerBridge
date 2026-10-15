export const INITIAL_MISSIONS = [
  {
    id: 'm-dbms-1',
    title: 'DBMS Revision Session',
    category: 'Study',
    description: 'Revise joins, subqueries, and aggregate functions together for tomorrow\'s midterm exam.',
    subject: 'DBMS / SQL',
    availability: 'Today, 7 PM',
    availabilityKey: 'today_evening',
    groupSize: 4,
    commitment: 'Focused',
    createdBy: {
      id: 'user-aanya',
      name: 'Aanya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      year: '3rd Year, CS & Eng'
    },
    members: [
      {
        id: 'user-aanya',
        name: 'Aanya Sharma',
        role: 'Host',
        year: '3rd Year CS',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        joinedAt: 'Today, 2:15 PM'
      },
      {
        id: 'user-kabir',
        name: 'Kabir Joshi',
        role: 'Member',
        year: '3rd Year CS',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        joinedAt: 'Today, 3:30 PM'
      },
      {
        id: 'user-priya',
        name: 'Priya Nair',
        role: 'Member',
        year: '3rd Year IT',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        joinedAt: 'Today, 4:05 PM'
      }
    ],
    status: 'Active',
    createdAt: '2026-10-14T10:00:00Z',
    checklist: [
      { id: 't-1', text: 'Revise joins (Inner, Left, Right, Full Outer)', completed: true },
      { id: 't-2', text: 'Practise correlated and nested subqueries', completed: false },
      { id: 't-3', text: 'Solve 5 challenging SQL exam questions', completed: false },
      { id: 't-4', text: 'Review query execution plans and mistakes together', completed: false }
    ]
  },
  {
    id: 'm-hack-1',
    title: 'HackSprint: Campus Ride-Share MVP',
    category: 'Hackathon',
    description: 'Build a real-time carpool & campus commute web app in 36 hours for the Smart Campus Hackathon.',
    subject: 'React & Node.js',
    availability: 'This Weekend',
    availabilityKey: 'this_weekend',
    groupSize: 4,
    commitment: 'Focused',
    createdBy: {
      id: 'user-rohan',
      name: 'Rohan Verma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      year: '2nd Year, Software Eng'
    },
    members: [
      {
        id: 'user-rohan',
        name: 'Rohan Verma',
        role: 'Host',
        year: '2nd Year SE',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        joinedAt: 'Yesterday'
      },
      {
        id: 'user-sara',
        name: 'Sara Al-Mansoor',
        role: 'Member',
        year: '3rd Year Design',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        joinedAt: 'Yesterday'
      }
    ],
    status: 'Active',
    createdAt: '2026-10-13T14:00:00Z',
    checklist: [
      { id: 't-201', text: 'Finalize user stories and high-fidelity Figma flow', completed: true },
      { id: 't-202', text: 'Scaffold Vite + Express mono-repo and Prisma DB', completed: true },
      { id: 't-203', text: 'Implement live campus route matching prototype', completed: false },
      { id: 't-204', text: 'Prepare 3-minute pitch deck and demo script', completed: false }
    ]
  },
  {
    id: 'm-interview-1',
    title: 'System Design & Behavioral Mock Interviews',
    category: 'Career',
    description: 'Bi-weekly peer mock interview rounds focusing on URL shortener, rate limiters, and STAR behavioral answers.',
    subject: 'System Design & SDE Prep',
    availability: 'Weekdays 6 PM',
    availabilityKey: 'weekday_evenings',
    groupSize: 3,
    commitment: 'Regular',
    createdBy: {
      id: 'user-mehak',
      name: 'Mehak Patel',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      year: '4th Year, Information Tech'
    },
    members: [
      {
        id: 'user-mehak',
        name: 'Mehak Patel',
        role: 'Host',
        year: '4th Year IT',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2 days ago'
      },
      {
        id: 'user-arjun',
        name: 'Arjun Mehta',
        role: 'Member',
        year: '4th Year CS',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        joinedAt: '1 day ago'
      }
    ],
    status: 'Active',
    createdAt: '2026-10-12T16:00:00Z',
    checklist: [
      { id: 't-301', text: 'Study latency, throughput, and CAP theorem tradeoffs', completed: true },
      { id: 't-302', text: 'Mock 1: Design URL shortener with Redis caching', completed: false },
      { id: 't-303', text: 'Mock 2: Distributed rate limiter (Token Bucket)', completed: false },
      { id: 't-304', text: 'Peer feedback on leadership & conflict STAR answers', completed: false }
    ]
  },
  {
    id: 'm-os-1',
    title: 'OS Concurrency & Semaphore Workshop',
    category: 'Study',
    description: 'Deep dive into Dining Philosophers, Producer-Consumer, and deadlock avoidance algorithms before quiz.',
    subject: 'Operating Systems',
    availability: 'Today, 7 PM',
    availabilityKey: 'today_evening',
    groupSize: 3,
    commitment: 'Focused',
    createdBy: {
      id: 'user-tanvi',
      name: 'Tanvi Rao',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      year: '3rd Year, Computer Eng'
    },
    members: [
      {
        id: 'user-tanvi',
        name: 'Tanvi Rao',
        role: 'Host',
        year: '3rd Year CE',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        joinedAt: 'Yesterday'
      },
      {
        id: 'user-nikhil',
        name: 'Nikhil Gupta',
        role: 'Member',
        year: '3rd Year CS',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        joinedAt: 'Yesterday'
      },
      {
        id: 'user-vikram',
        name: 'Vikram Seth',
        role: 'Member',
        year: '3rd Year CE',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        joinedAt: 'Today'
      }
    ],
    status: 'Active',
    createdAt: '2026-10-14T08:00:00Z',
    checklist: [
      { id: 't-401', text: 'Review binary vs counting semaphores', completed: true },
      { id: 't-402', text: 'Implement mutex locks in C pthread', completed: true },
      { id: 't-403', text: 'Trace Banker\'s Deadlock Avoidance algorithm', completed: false }
    ]
  },
  {
    id: 'm-ai-1',
    title: 'AI Paper Reading Circle: Attention Is All You Need',
    category: 'Projects',
    description: 'Reading Transformer architecture paper line-by-line and implementing a toy self-attention head in PyTorch.',
    subject: 'PyTorch & NLP',
    availability: 'Flexible / Evenings',
    availabilityKey: 'flexible',
    groupSize: 5,
    commitment: 'Regular',
    createdBy: {
      id: 'user-maya',
      name: 'Maya Lin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      year: 'Research Scholar, AI Lab'
    },
    members: [
      {
        id: 'user-maya',
        name: 'Maya Lin',
        role: 'Host',
        year: 'AI Scholar',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        joinedAt: '3 days ago'
      },
      {
        id: 'user-ishan',
        name: 'Ishan Sen',
        role: 'Member',
        year: '4th Year Data Science',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2 days ago'
      }
    ],
    status: 'Active',
    createdAt: '2026-10-11T12:00:00Z',
    checklist: [
      { id: 't-501', text: 'Read Sections 1-3: Self-Attention & Multi-Head formula', completed: true },
      { id: 't-502', text: 'Code sinusoidal positional encodings in PyTorch', completed: false },
      { id: 't-503', text: 'Write single-head attention matrix multiplication test', completed: false },
      { id: 't-504', text: 'Discuss computational complexity O(n^2) bottlenecks', completed: false }
    ]
  },
  {
    id: 'm-dsa-1',
    title: 'Blind 75 LeetCode Sprint',
    category: 'Career',
    description: 'Daily practice solving 2 medium dynamic programming and tree problems with clean explanation notes.',
    subject: 'DSA & Algorithms',
    availability: 'Weekdays 6 PM',
    availabilityKey: 'weekday_evenings',
    groupSize: 4,
    commitment: 'Focused',
    createdBy: {
      id: 'user-rahul',
      name: 'Rahul Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      year: '3rd Year CS'
    },
    members: [
      {
        id: 'user-rahul',
        name: 'Rahul Kulkarni',
        role: 'Host',
        year: '3rd Year CS',
        avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
        joinedAt: 'Yesterday'
      }
    ],
    status: 'Active',
    createdAt: '2026-10-13T19:00:00Z',
    checklist: [
      { id: 't-601', text: 'Invert Binary Tree & Lowest Common Ancestor', completed: true },
      { id: 't-602', text: 'House Robber & Coin Change (1D DP)', completed: true },
      { id: 't-603', text: 'Top K Frequent Elements (Min-Heap / Bucket Sort)', completed: false },
      { id: 't-604', text: 'Tradeoff discussion on recursion vs iteration', completed: false }
    ]
  }
];
