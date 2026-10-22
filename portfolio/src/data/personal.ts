import type { PersonalData } from '../types'

export const personal: PersonalData = {
  name: 'Alex Rivera',
  title: 'Full-Stack Developer',
  tagline: 'I build fast, accessible, and beautiful web experiences.',
  bio: [
    'I\'m a full-stack developer with 5+ years of experience turning ideas into polished digital products. I specialize in React, TypeScript, and Node.js, with a strong focus on performance and accessibility.',
    'I\'ve shipped production software for startups and established companies alike — from real-time dashboards to e-commerce platforms. I care deeply about clean architecture, readable code, and developer experience.',
    'When I\'m not coding, you\'ll find me contributing to open-source projects, writing technical articles, or experimenting with generative art.',
  ],
  resumeUrl: '/assets/alex-rivera-resume.pdf',
  portraitSrc: '/assets/portrait-placeholder.webp',
  email: 'hello@alexrivera.dev',
  location: 'San Francisco, CA',
  socials: [
    {
      platform: 'github',
      url: 'https://github.com/alexrivera',
      icon: 'github',
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/alexrivera',
      icon: 'linkedin',
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com/alexrivera_dev',
      icon: 'twitter',
    },
    {
      platform: 'email',
      url: 'mailto:hello@alexrivera.dev',
      icon: 'mail',
    },
  ],
  stats: [
    { value: '5+', label: 'Years Experience' },
    { value: '40+', label: 'Projects Delivered' },
    { value: '15+', label: 'Happy Clients' },
    { value: '99%', label: 'Client Satisfaction' },
  ],
}
