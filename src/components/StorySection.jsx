import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import TrustedBy from './TrustedBy.jsx'
import VideoPlayer from './VideoPlayer.jsx'
import { thumbFor } from '../lib/video.js'

const slide = {
  enter: (d) => ({ opacity: 0, x: d * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d * -60 })
}

// One clean frame. The arrows switch to the previous / next video.
export default function StorySection({ data, videos, clients }) {
  const list = videos.slice(0, 4)
  const [[idx, dir], setPage] = useState([0, 0])
  const [playingId, setPlayingId] = useState(null)
  if (!list.length) return null

  const go = (step) => { setPlayingId(null); setPage(([i]) => [(i + step + list.length) % list.length, step]) }
  const onKey = (e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }
  const v = list[idx]
  const poster = thumbFor(v)
  const arrow = 'absolute top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-lg transition hover:scale-110'

  return (
    <section id="story" className="section-y mx-auto max-w-5xl px-6">
      <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
        <div className="relative">
          <h2 className="-rotate-3 rounded-2xl bg-white px-6 py-3 text-lg font-semibold text-black shadow-xl sm:text-xl">{data.title}</h2>
          <svg viewBox="0 0 70 60" className="absolute left-full top-2 ml-1 hidden h-12 w-14 text-muted sm:block" aria-hidden="true">
            <motion.path d="M4 10 C14 2 26 8 20 16 C14 24 6 14 18 10 C34 4 50 24 56 46 M49 42 L56 48 L60 38" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.4 }} />
          </svg>
        </div>
        <div className="relative sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2">
          <span className="more-ring absolute inset-0 rounded-full bg-accent/40" aria-hidden="true" />
          <a href="#/videos" className="more-btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/30 transition hover:scale-105">
            <span className="more-shine absolute inset-0" aria-hidden="true" />
            <span className="relative">{data.moreLabel}</span><ArrowRight size={16} className="arrow-nudge relative" />
          </a>
        </div>
      </div>

      <div role="region" aria-roledescription="carousel" aria-label="Featured videos" tabIndex={0} onKeyDown={onKey} className="relative mx-auto mt-10 max-w-4xl focus:outline-none">
        <div className="rounded-[2rem] p-3 shadow-md shadow-black/5 dark:shadow-xl sm:p-4" style={{ backgroundColor: 'var(--f0)' }}>
          <div className="rounded-[1.5rem] bg-white p-1.5">
            <div className="relative aspect-video overflow-hidden rounded-[1.1rem] bg-black">
              <AnimatePresence initial={false} mode="wait" custom={dir}>
                <motion.div key={v.id} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0">
                  {playingId === v.id ? (
                    <VideoPlayer video={v} poster={poster} />
                  ) : (
                    <button onClick={() => setPlayingId(v.id)} aria-label={`Play ${v.title}`} className="group absolute inset-0">
                      {poster && <img src={poster} alt="" width="1280" height="720" loading="lazy" draggable={false} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
                      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-black shadow-lg transition duration-300 group-hover:scale-110"><Play size={24} className="translate-x-0.5" fill="currentColor" /></span>
                      </span>
                      <span className="absolute inset-x-5 bottom-4 text-left text-white">
                        <span className="block text-lg font-semibold leading-snug">{v.title}</span>
                        <span className="block text-sm text-white/70">{v.category}</span>
                      </span>
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        {list.length > 1 && (<>
          <button onClick={() => go(-1)} aria-label="Previous video" className={`${arrow} -left-3 sm:-left-5`}><ChevronLeft size={20} /></button>
          <button onClick={() => go(1)} aria-label="Next video" className={`${arrow} -right-3 sm:-right-5`}><ChevronRight size={20} /></button>
        </>)}
      </div>

      <div className="mx-auto mt-16 max-w-4xl"><TrustedBy data={clients} /></div>
    </section>
  )
}
