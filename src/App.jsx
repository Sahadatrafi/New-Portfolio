import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Experience from './components/Experience.jsx'
import DesignPage from './components/DesignPage.jsx'
import StorySection from './components/StorySection.jsx'
import Process from './components/Process.jsx'
import About from './components/About.jsx'
import Reviews from './components/Reviews.jsx'
import BackToTop from './components/BackToTop.jsx'
import Footer from './components/Footer.jsx'
import VideosPage from './components/VideosPage.jsx'
import { getSettings, getExperience, getProjects, getVideos, getClients, getReviews, getAbout, getServices, getStory, getProcess } from './lib/content.js'

// Tiny hash router: "#/videos" is the All Videos page; anything else is the home page.
function useHash() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash
}

export default function App() {
  const s = getSettings()
  const hash = useHash()
  const route = hash.startsWith('#/videos') ? 'videos' : hash.startsWith('#/design') ? 'design' : 'home'

  useEffect(() => {
    if (route !== 'home') { window.scrollTo(0, 0); return }
    requestAnimationFrame(() => {
      try { const el = hash.length > 1 && document.querySelector(hash); el ? el.scrollIntoView() : window.scrollTo(0, 0) } catch (e) {}
    })
  }, [route]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Navbar name={s.name} />
      {route === 'videos' ? (
        <VideosPage videos={getVideos()} contactHref={s.contact.whatsapp} />
      ) : route === 'design' ? (
        <DesignPage projects={getProjects()} contactHref={s.contact.whatsapp} />
      ) : (
        <main>
          <Hero settings={s} videos={getVideos()} />
          <Services data={getServices()} />
          {/* Experience is hidden for now. To bring it back, restore: <Experience items={getExperience()} /> */}
          <StorySection data={getStory()} videos={getVideos()} clients={getClients()} />
          <Process data={getProcess()} />
          <About data={getAbout()} fallbackImage={s.profileImage} name={s.name} />
          <Reviews data={getReviews()} />
        </main>
      )}
      <Footer name={s.name} title={s.title} contact={s.contact} />
      <BackToTop />
    </>
  )
}
