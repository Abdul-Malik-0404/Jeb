export interface JobHunt {
  id: string;
  title: string;
  role: string;
  location: string;
  jobType: string;
  createdAt: string;
  activePostings: number;
  newPostings: number;
}

export interface JobPosting {
  id: string;
  huntId: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  url: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  matchScore: number;
}

export interface ResumeBlock {
  id: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
  content: any;
  order: number;
}

export interface TailoredResume {
  jobId: string;
  blocks: ResumeBlock[];
  generatedAt: string;
}

export const mockJobHunts: JobHunt[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    role: 'Frontend Developer',
    location: 'Remote',
    jobType: 'Full-time',
    createdAt: '2026-05-15',
    activePostings: 24,
    newPostings: 3
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    role: 'Full Stack Developer',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    createdAt: '2026-05-20',
    activePostings: 18,
    newPostings: 5
  },
  {
    id: '3',
    title: 'React Developer',
    role: 'React Developer',
    location: 'New York, NY',
    jobType: 'Contract',
    createdAt: '2026-05-28',
    activePostings: 12,
    newPostings: 2
  }
];

export const mockJobPostings: JobPosting[] = [
  {
    id: '1',
    huntId: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp',
    location: 'Remote',
    salary: '$140k - $180k',
    type: 'Full-time',
    postedDate: '2026-06-01',
    url: 'https://example.com/jobs/1',
    description: 'We are looking for an experienced Frontend Engineer to join our growing team. You will be responsible for building and maintaining our web applications using modern technologies.',
    requirements: [
      '5+ years of experience with React',
      'Strong TypeScript skills',
      'Experience with state management (Redux, MobX, or similar)',
      'Understanding of modern CSS and responsive design',
      'Experience with testing frameworks (Jest, React Testing Library)'
    ],
    responsibilities: [
      'Build and maintain scalable web applications',
      'Collaborate with designers and backend engineers',
      'Write clean, maintainable code',
      'Participate in code reviews',
      'Mentor junior developers'
    ],
    matchScore: 92
  },
  {
    id: '2',
    huntId: '1',
    title: 'Frontend Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$120k - $150k',
    type: 'Full-time',
    postedDate: '2026-05-30',
    url: 'https://example.com/jobs/2',
    description: 'Join our fast-paced startup as we build the next generation of productivity tools. We need a talented frontend developer who can move quickly and deliver high-quality features.',
    requirements: [
      '3+ years of React experience',
      'Proficiency in JavaScript/TypeScript',
      'Experience with modern build tools (Vite, Webpack)',
      'Knowledge of REST APIs and async programming',
      'Strong problem-solving skills'
    ],
    responsibilities: [
      'Develop new user-facing features',
      'Optimize applications for maximum speed',
      'Collaborate with product team on feature development',
      'Ensure technical feasibility of UI/UX designs',
      'Build reusable code and libraries'
    ],
    matchScore: 88
  },
  {
    id: '3',
    huntId: '1',
    title: 'Lead Frontend Engineer',
    company: 'Enterprise Solutions Inc',
    location: 'Remote',
    salary: '$160k - $200k',
    type: 'Full-time',
    postedDate: '2026-05-28',
    url: 'https://example.com/jobs/3',
    description: 'We are seeking a Lead Frontend Engineer to drive our frontend architecture and mentor our engineering team. This role requires deep technical expertise and leadership skills.',
    requirements: [
      '7+ years of frontend development experience',
      'Expert-level React and TypeScript',
      'Experience leading engineering teams',
      'Strong architecture and design skills',
      'Excellent communication skills'
    ],
    responsibilities: [
      'Define frontend architecture and best practices',
      'Lead technical design discussions',
      'Mentor and guide frontend team',
      'Drive technical excellence across the organization',
      'Collaborate with stakeholders on technical strategy'
    ],
    matchScore: 85
  }
];

export const mockUserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  website: 'johndoe.dev',
  linkedIn: 'linkedin.com/in/johndoe'
};

export const mockBaseResume: ResumeBlock[] = [
  {
    id: 'header',
    type: 'header',
    order: 0,
    content: {
      name: 'John Doe',
      title: 'Senior Frontend Developer',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'johndoe.dev',
      linkedIn: 'linkedin.com/in/johndoe'
    }
  },
  {
    id: 'summary',
    type: 'summary',
    order: 1,
    content: {
      text: 'Experienced frontend developer with 6+ years of building scalable web applications. Specialized in React, TypeScript, and modern web technologies. Passionate about creating intuitive user experiences and writing clean, maintainable code.'
    }
  },
  {
    id: 'experience',
    type: 'experience',
    order: 2,
    content: {
      positions: [
        {
          title: 'Senior Frontend Developer',
          company: 'Tech Solutions Inc',
          location: 'San Francisco, CA',
          period: '2022 - Present',
          achievements: [
            'Led frontend development for a new SaaS platform serving 50k+ users',
            'Reduced bundle size by 40% through code splitting and optimization',
            'Mentored 3 junior developers and conducted code reviews',
            'Implemented comprehensive testing strategy with 85% coverage'
          ]
        },
        {
          title: 'Frontend Developer',
          company: 'Digital Agency Co',
          location: 'Remote',
          period: '2020 - 2022',
          achievements: [
            'Built responsive web applications for 15+ clients',
            'Developed reusable component library used across projects',
            'Collaborated with designers to implement pixel-perfect UIs',
            'Improved page load times by 50% through performance optimization'
          ]
        },
        {
          title: 'Junior Frontend Developer',
          company: 'StartupHub',
          location: 'San Francisco, CA',
          period: '2018 - 2020',
          achievements: [
            'Contributed to development of e-commerce platform',
            'Implemented new features using React and Redux',
            'Participated in agile development process',
            'Fixed bugs and improved code quality'
          ]
        }
      ]
    }
  },
  {
    id: 'skills',
    type: 'skills',
    order: 3,
    content: {
      categories: [
        {
          name: 'Languages',
          items: ['JavaScript', 'TypeScript', 'HTML', 'CSS/SCSS', 'Python']
        },
        {
          name: 'Frameworks & Libraries',
          items: ['React', 'Next.js', 'Redux', 'TailwindCSS', 'Material-UI']
        },
        {
          name: 'Tools & Technologies',
          items: ['Git', 'Webpack', 'Vite', 'Jest', 'Docker', 'Figma']
        }
      ]
    }
  },
  {
    id: 'projects',
    type: 'projects',
    order: 4,
    content: {
      projects: [
        {
          name: 'E-commerce Dashboard',
          description: 'Built comprehensive admin dashboard for managing online store',
          technologies: ['React', 'TypeScript', 'Redux', 'Chart.js'],
          link: 'github.com/johndoe/ecommerce-dashboard'
        },
        {
          name: 'Social Media Analytics Tool',
          description: 'Developed analytics platform for tracking social media metrics',
          technologies: ['React', 'Next.js', 'D3.js', 'TailwindCSS'],
          link: 'github.com/johndoe/social-analytics'
        }
      ]
    }
  },
  {
    id: 'education',
    type: 'education',
    order: 5,
    content: {
      degrees: [
        {
          degree: 'Bachelor of Science in Computer Science',
          school: 'University of California',
          location: 'Berkeley, CA',
          year: '2018'
        }
      ]
    }
  }
];

export function getTailoredResume(jobId: string): TailoredResume {
  const baseBlocks = [...mockBaseResume];

  if (jobId === '1') {
    baseBlocks[1].content.text = 'Senior Frontend Developer with 6+ years of experience building scalable React applications. Expert in TypeScript, state management, and modern frontend architecture. Proven track record of leading teams and delivering high-quality web applications that serve thousands of users.';
    baseBlocks[2].content.positions[0].achievements = [
      'Architected and led development of React-based SaaS platform serving 50k+ users',
      'Implemented Redux for state management across 100+ components',
      'Reduced bundle size by 40% using code splitting and lazy loading',
      'Mentored 3 junior developers and established frontend best practices'
    ];
  } else if (jobId === '2') {
    baseBlocks[1].content.text = 'Versatile Frontend Developer with 6 years of experience building fast, responsive web applications. Proficient in React, TypeScript, and modern build tools. Thrives in fast-paced environments and excels at rapid feature development while maintaining code quality.';
  }

  return {
    jobId,
    blocks: baseBlocks,
    generatedAt: '2026-06-04T10:30:00Z'
  };
}
