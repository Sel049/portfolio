import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import TechStack from './components/TechStack/TechStack'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Services from './components/Services/Services'
import Testimonials from './components/Testimonials/Testimonials'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import { personal } from './data/personal'
import { techStack } from './data/techStack'
import { skills } from './data/skills'
import { projects } from './data/projects'
import { services } from './data/services'
import { approach } from './data/approach'

function App() {
  return (
    <>
      {/* 1. Navbar — reads scroll state internally, no external props */}
      <Navbar />

      {/* 2. Hero — self-wraps in <SectionWrapper id="hero"> */}
      <Hero data={personal} />

      {/* 3. About — self-wraps in <SectionWrapper id="about"> */}
      <About data={personal} />

      {/* 4. TechStack — self-wraps in <SectionWrapper id="tech-stack"> */}
      <TechStack items={techStack} />

      {/* 5. Skills — self-wraps in <SectionWrapper id="skills"> */}
      <Skills categories={skills} />

      {/* 6. Projects — self-wraps in <SectionWrapper id="projects"> */}
      <Projects projects={projects} />

      {/* 7. Services — self-wraps in <SectionWrapper id="services"> */}
      <Services services={services} />

      {/* 8. Testimonials — self-wraps in <SectionWrapper id="testimonials"> */}
      <Testimonials entries={approach} />

      {/* 9. Contact — self-wraps in <SectionWrapper id="contact"> */}
      <Contact data={personal} />

      {/* 10. Footer — no SectionWrapper (full-width footer) */}
      <Footer data={personal} services={services} />
    </>
  )
}

export default App
