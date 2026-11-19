import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'

const variants = {
  enter: (d) => ({ opacity: 0, x: d * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d * -40 })
}

export default function ProjectModal({ project, onClose }) {
  const images = project.images?.length ? project.images : [project.cover]
  const [[index, dir], setPage] = useState([0, 0])
  const viewerRef = useRef(null)
  const closeRef = useRef(null)
  const go = useCallback((step) => setPage(([i]) => [(i + step + images.length) % images.length, step]), [images.length])

  const toggleFullscreen = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen()
      else viewerRef.current?.requestFullscreen?.()
    } catch (e) {}
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [go, onClose])

  const btn = 'grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-ink shadow-md backdrop-blur transition hover:bg-surface'
  return (
    <motion.div role="dialog" aria-modal="true" aria-label={project.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }} className="fixed inset-0 z-[60] overflow-y-auto bg-bg">
      <button ref={closeRef} onClick={onClose} aria-label="Close project" className={`${btn} fixed right-4 top-4 z-10 border border-line/10`}><X size={20} /></button>
      <div className="mx-auto grid max-w-6xl gap-8 px-5 pb-10 pt-16 lg:grid-cols-[1fr_300px] lg:items-center lg:pt-20">
        <div ref={viewerRef} className="relative overflow-hidden rounded-3xl border border-line/10 bg-surface">
          <div className="grid aspect-[3/2] place-items-center overflow-hidden">
            <AnimatePresence initial={false} mode="wait" custom={dir}>
              <motion.img key={index} src={images[index]} alt={`${project.title}, image ${index + 1} of ${images.length}`} width="1200" height="800"
                custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="h-full w-full object-contain" />
            </AnimatePresence>
          </div>
          {images.length > 1 && (<>
            <button onClick={() => go(-1)} aria-label="Previous image" className={`${btn} absolute left-3 top-1/2 -translate-y-1/2`}><ChevronLeft size={20} /></button>
            <button onClick={() => go(1)} aria-label="Next image" className={`${btn} absolute right-3 top-1/2 -translate-y-1/2`}><ChevronRight size={20} /></button>
          </>)}
          <button onClick={toggleFullscreen} aria-label="Toggle fullscreen" className={`${btn} absolute right-3 top-3`}><Maximize2 size={18} /></button>
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white" aria-live="polite">{index + 1} / {images.length}</span>
        </div>
        <div>
          <p className="text-sm text-accent">{project.category}</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight">{project.title}</h3>
          <p className="mt-4 leading-relaxed text-muted">{project.description}</p>
        </div>
      </div>
    </motion.div>
  )
}
