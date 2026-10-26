import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Navbar from './components/Navbar/Navbar'
import { personal } from './data/personal'

function App() {
  return (
    <>
      <Navbar />
      <Hero data={personal} />
      <About data={personal} />
    </>
  )
}

export default App
