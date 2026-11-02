import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import TechStack from './components/TechStack/TechStack'
import Services from './components/Services/Services'
import Projects from './components/Projects/Projects'
import Testimonials from './components/Testimonials/Testimonials'
import Contact from './components/Contact/Contact'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { personal } from './data/personal'
import { skills } from './data/skills'
import { techStack } from './data/techStack'
import { services } from './data/services'
import { projects } from './data/projects'
import { approach } from './data/approach'

function App() {
  return (
    <>
      <Navbar />
      <Hero data={personal} />
      <About data={personal} />
      <Skills categories={skills} />
      <TechStack items={techStack} />
      <Services services={services} />
      <Projects projects={projects} />
      <Testimonials entries={approach} />
      <Contact data={personal} />
      <Footer data={personal} services={services} />
    </>
  )
}

export default App
