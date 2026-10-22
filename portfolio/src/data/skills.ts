import type { SkillCategory } from '../types'

export const skills: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: [
      { icon: 'react',       name: 'React',          proficiency: 'Expert',       level: 95 },
      { icon: 'typescript',  name: 'TypeScript',     proficiency: 'Expert',       level: 92 },
      { icon: 'tailwind',    name: 'Tailwind CSS',   proficiency: 'Expert',       level: 90 },
      { icon: 'nextjs',      name: 'Next.js',        proficiency: 'Advanced',     level: 85 },
      { icon: 'css',         name: 'CSS / SCSS',     proficiency: 'Advanced',     level: 88 },
      { icon: 'testing',     name: 'Testing Library',proficiency: 'Advanced',     level: 80 },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { icon: 'nodejs',      name: 'Node.js',        proficiency: 'Expert',       level: 90 },
      { icon: 'postgresql',  name: 'PostgreSQL',     proficiency: 'Advanced',     level: 82 },
      { icon: 'graphql',     name: 'GraphQL',        proficiency: 'Advanced',     level: 78 },
      { icon: 'redis',       name: 'Redis',          proficiency: 'Intermediate', level: 70 },
      { icon: 'prisma',      name: 'Prisma',         proficiency: 'Advanced',     level: 80 },
      { icon: 'express',     name: 'Express',        proficiency: 'Expert',       level: 88 },
    ],
  },
  {
    title: 'DevOps & Tools',
    skills: [
      { icon: 'docker',      name: 'Docker',         proficiency: 'Advanced',     level: 80 },
      { icon: 'aws',         name: 'AWS',            proficiency: 'Intermediate', level: 68 },
      { icon: 'git',         name: 'Git',            proficiency: 'Expert',       level: 95 },
      { icon: 'ci',          name: 'CI / CD',        proficiency: 'Advanced',     level: 75 },
      { icon: 'figma',       name: 'Figma',          proficiency: 'Intermediate', level: 65 },
      { icon: 'linux',       name: 'Linux',          proficiency: 'Advanced',     level: 78 },
    ],
  },
]
