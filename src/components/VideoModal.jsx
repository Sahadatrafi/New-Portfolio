import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import VideoPlayer from './VideoPlayer.jsx'
import { thumbFor } from '../lib/video.js'

// Opens with a circular "iris" reveal that grows from the card you clicked.
export default function VideoModal({ video, origin, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])

  const ratio = 16 / 9
  const r = Math.hypot(window.innerWidth, window.innerHeight)
  const at = `at ${origin.x}px ${origin.y}px`
  return (
    <motion.div role="dialog" aria-modal="true" aria-label={video.title}
      initial={{ clipPath: `circle(0px ${at})` }} animate={{ clipPath: `circle(${r}px ${at})` }} exit={{ clipPath: `circle(0px ${at})` }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black p-4">
      <button onClick={onClose} aria-label="Close video" className="fixed right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"><X size={20} /></button>
      <div className="w-full max-w-5xl">
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ aspectRatio: ratio, width: `min(100%, ${(76 * ratio).toFixed(2)}vh)` }}
          className="mx-auto overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
          <VideoPlayer video={video} poster={thumbFor(video)} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="mx-auto mt-5 text-white" style={{ width: `min(100%, ${Math.max(76 * ratio, 40).toFixed(2)}vh)` }}>
          <h3 className="text-2xl font-semibold tracking-tight">{video.title}</h3>
          <p className="mt-1 text-white/60">{video.category}</p>
          {video.description && <p className="mt-3 max-w-2xl leading-relaxed text-white/70">{video.description}</p>}
        </motion.div>
      </div>
    </motion.div>
  )
}
