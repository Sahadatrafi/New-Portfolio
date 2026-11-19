import { Play } from 'lucide-react'
import { thumbFor } from '../lib/video.js'

// One video card (same look as the Visual Design cards). Used by the home slider and the All Videos page.
// wide=true gives the 16:9 version used on the All Videos page; default is the 4:5 card used on the home page.
export default function VideoCard({ video: v, onOpen, className = '', wide = false, active = false }) {
  const t = thumbFor(v)
  return (
    <button onClick={(e) => onOpen(v, e)} draggable={false} className={`group select-none text-left ${className}`}>
      <div className={`relative ${wide ? 'aspect-video' : 'aspect-[4/5]'} overflow-hidden rounded-3xl border border-line/10 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] transition ${active ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : ''}`}>
        {t && <img src={t} alt={`${v.title} thumbnail`} width={wide ? 1280 : 800} height={wide ? 720 : 1000} loading="lazy" draggable={false}
          onError={(e) => { if (!e.currentTarget.dataset.fb) { e.currentTarget.dataset.fb = '1'; e.currentTarget.src = t.replace('maxresdefault', 'hqdefault') } }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
        {active && <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-white">Now playing</span>}
        <span className="absolute inset-0 grid place-items-center bg-black/10 transition group-hover:bg-black/30">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-black shadow-lg transition duration-300 group-hover:scale-110"><Play size={20} className="translate-x-0.5" fill="currentColor" /></span>
        </span>
      </div>
      <h3 className="mt-3 font-medium leading-snug">{v.title}</h3>
      <p className="text-sm text-muted">{v.category}</p>
    </button>
  )
}
