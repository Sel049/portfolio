import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'Pulse Analytics Dashboard',
    description:
      'A real-time analytics platform with interactive charts, custom date ranges, and multi-tenant support. Built for SaaS teams that need clear insight into user behaviour and product metrics.',
    imageSrc: '/assets/projects/pulse-analytics.webp',
    tags: ['React', 'TypeScript', 'D3.js', 'Node.js', 'PostgreSQL'],
    categories: ['Web App', 'Full Stack'],
    liveUrl: 'https://pulse-demo.example.com',
    githubUrl: 'https://github.com/alexrivera/pulse-analytics',
    featured: true,
  },
  {
    id: 'project-2',
    title: 'ShopFlow E-Commerce',
    description:
      'A high-performance headless e-commerce storefront with server-side rendering, optimistic cart updates, and Stripe checkout integration. Achieves a 98 Lighthouse score.',
    imageSrc: '/assets/projects/shopflow.webp',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Stripe', 'Prisma'],
    categories: ['Web App', 'Full Stack'],
    liveUrl: 'https://shopflow-demo.example.com',
    githubUrl: 'https://github.com/alexrivera/shopflow',
    featured: true,
  },
  {
    id: 'project-3',
    title: 'Orbit Design System',
    description:
      'A fully accessible, themeable component library with 40+ components, Storybook documentation, and automated visual regression tests. Used across three internal products.',
    imageSrc: '/assets/projects/orbit-ds.webp',
    tags: ['React', 'TypeScript', 'Storybook', 'Vitest', 'Radix UI'],
    categories: ['UI Library', 'Open Source'],
    githubUrl: 'https://github.com/alexrivera/orbit-ds',
    featured: false,
  },
  {
    id: 'project-4',
    title: 'Beacon REST API',
    description:
      'A scalable REST API built with Node.js and PostgreSQL, featuring JWT authentication, role-based access control, rate limiting, and auto-generated OpenAPI documentation.',
    imageSrc: '/assets/projects/beacon-api.webp',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
    categories: ['Backend', 'Open Source'],
    githubUrl: 'https://github.com/alexrivera/beacon-api',
    featured: false,
  },
  {
    id: 'project-5',
    title: 'Nomad Travel Planner',
    description:
      'A mobile-first travel planning app with collaborative itineraries, offline support via Service Workers, and AI-powered destination suggestions.',
    imageSrc: '/assets/projects/nomad-travel.webp',
    tags: ['React', 'PWA', 'IndexedDB', 'TypeScript', 'OpenAI API'],
    categories: ['Web App', 'Mobile'],
    liveUrl: 'https://nomad-demo.example.com',
    githubUrl: 'https://github.com/alexrivera/nomad',
    featured: false,
  },
  {
    id: 'project-6',
    title: 'Relay Chat',
    description:
      'A real-time messaging application with rooms, direct messages, file uploads, and end-to-end encryption. Uses WebSockets for low-latency message delivery.',
    imageSrc: '/assets/projects/relay-chat.webp',
    tags: ['React', 'Socket.io', 'Node.js', 'Redis', 'AWS S3'],
    categories: ['Full Stack', 'Mobile'],
    liveUrl: 'https://relay-demo.example.com',
    githubUrl: 'https://github.com/alexrivera/relay-chat',
    featured: false,
  },
]
