import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import VideoModal from './VideoModal.jsx'
import { thumbFor } from '../lib/video.js'

// Clips that scroll past a fixed playhead, like a video editing timeline.
const CLIPS = [
  ['Video Editing', 230, 'bg-blue-500'], ['Color Grading', 190, 'bg-indigo-500'], ['Motion Graphics', 220, 'bg-sky-500'],
  ['Graphic Design', 200, 'bg-violet-500'], ['Branding & Identity', 240, 'bg-blue-600'], ['Social Media Design', 230, 'bg-cyan-600']
]

// Width of one group of clips: clip widths + 5 gaps of 8px + 8px trailing padding. Keep in sync with the CSS (--tw).
const TIMELINE_W = CLIPS.reduce((n, c) => n + c[1], 0) + 6 * 8

export default function Hero({ settings, videos }) {
  const { badgeName, availability, heroTitle, intro, contact } = settings
  const [active, setActive] = useState(null)
  const cards = videos.slice(0, 3)
  const mid = (cards.length - 1) / 2
  const open = (v, e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setActive({ video: v, origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } })
  }
  return (
    <section className="mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-6 pb-10 pt-28 text-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 rounded-full border border-line/15 bg-surface/70 px-4 py-1.5 text-sm text-muted backdrop-blur">
        <span className="dot-live h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
        <span className="font-medium text-ink">{badgeName}</span><span>{availability}</span>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">{heroTitle}</motion.h1>
      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{intro}</motion.p>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-7 flex flex-wrap justify-center gap-3">
        <a href="#story" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:opacity-90">View my work <ArrowRight size={16} /></a>
        <span className="relative inline-flex">
          <span className="contact-ring absolute inset-0 rounded-full border-2 border-accent/70" aria-hidden="true" />
          <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Contact me on WhatsApp (opens in a new tab)" className="relative rounded-full border-2 border-accent bg-accent/10 px-6 py-3 text-sm font-semibold text-accent shadow-[0_0_24px_rgb(var(--accent)/0.35)] transition hover:bg-accent hover:text-white">Contact me</a>
        </span>
      </motion.div>

      {cards.length > 0 && (
        <ul className="mt-10 flex items-center justify-center -space-x-4 sm:-space-x-6">
          {cards.map((v, i) => {
            const off = i - mid, y = Math.abs(off) * 16
            return (
              <motion.li key={v.id} style={{ zIndex: 10 - Math.round(Math.abs(off)), transformPerspective: 1100 }}
                initial={{ opacity: 0, y: 70, rotateY: 0 }} animate={{ opacity: 1, y, rotateY: -off * 18, scale: off === 0 ? 1 : 0.92 }} whileHover={{ y: y - 12, rotateY: 0, scale: 1.06, zIndex: 20 }}
                transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 0.4 + i * 0.1 }}>
                <button onClick={(e) => open(v, e)} aria-label={`Play ${v.title}`} className="skill-float group block" style={{ '--dur': `${5 + i * 0.7}s`, '--delay': `${-i * 1.3}s`, '--dy': '-6px', '--dx': '0px', '--rot': '0deg' }}>
                  <span className="relative block aspect-video w-[33vw] max-w-[17rem] overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] shadow-xl sm:w-60 md:w-72">
                    {thumbFor(v) && <img src={thumbFor(v)} alt="" width="1280" height="720" loading="eager" draggable={false} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />}
                    <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute inset-0 grid place-items-center"><span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-black opacity-80 transition group-hover:scale-110 group-hover:opacity-100"><Play size={16} className="translate-x-px" fill="currentColor" /></span></span>
                    <span className="absolute inset-x-3 bottom-2 hidden truncate text-left text-xs font-medium text-white sm:block">{v.title}</span>
                  </span>
                </button>
              </motion.li>
            )
          })}
        </ul>
      )}

      <div className="relative mt-10 w-screen self-center overflow-hidden border-y border-line/10 bg-surface/40 py-3 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]" aria-hidden="true">
        <div className="timeline-track flex w-max">
          {[0, 1, 2].map((k) => (
            <div key={k} className="flex shrink-0 gap-2 pr-2" style={{ width: TIMELINE_W }}>
              {CLIPS.map(([label, w, c]) => (
                <span key={label + k} className={`${c} flex h-11 shrink-0 items-center rounded-lg px-4 text-sm font-medium text-white shadow-sm`} style={{ width: w }}>{label}</span>
              ))}
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-1/2 z-10 w-px bg-red-500"><span className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[8px] border-x-transparent border-t-red-500" /></div>
      </div>
      <AnimatePresence>{active && <VideoModal key={active.video.id} video={active.video} origin={active.origin} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  )
}
