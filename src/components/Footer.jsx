import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const SERVICES = ['Graphic Design', 'Social Media Design', 'Branding & Visual Identity', 'Real Estate Marketing Design', 'Creative Advertising', 'Video Editing', 'Motion Graphics', 'Cinematic Color Grading']
const NAV = [['Visual Design', '#/design'], ['Motion & Film', '#/videos'], ['Process', '#process'], ['About', '#about'], ['Trusted by', '#trusted'], ['Kind Words', '#reviews']]
const CONTACTS = [['WhatsApp', 'whatsapp'], ['Email', 'email', 'mailto:'], ['Behance', 'behance'], ['LinkedIn', 'linkedin'], ['Facebook', 'facebook']]

function useDhakaTime() {
  const get = () => { try { return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Dhaka' }).format(new Date()) } catch (e) { return '' } }
  const [t, setT] = useState(get)
  useEffect(() => { const id = setInterval(() => setT(get()), 30000); return () => clearInterval(id) }, [])
  return t
}

const up = { hidden: { opacity: 0, y: 24 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }) }

export default function Footer({ name, title, contact }) {
  const time = useDhakaTime()
  const links = CONTACTS.filter(([, k]) => contact[k]).map(([label, k, prefix = '']) => [k === 'email' ? contact[k] : label, prefix + contact[k]])
  const linkCls = 'group inline-flex items-center gap-1 text-white/70 transition hover:text-white'

  return (
    <footer id="contact" className="relative overflow-hidden bg-[#020617] text-white">
      <div className="footer-glow pointer-events-none absolute left-1/2 top-0 h-80 w-[60rem] max-w-full rounded-full bg-[#3B82F6]/25 blur-[120px]" aria-hidden="true" />

      <div className="marquee relative overflow-hidden border-y border-white/10 py-3 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-hidden="true">
        <div className="marquee-track flex w-max">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {SERVICES.map((s) => (
                <span key={s + k} className="flex items-center text-lg text-white/60 sm:text-xl">
                  <span className="px-6">{s}</span><span className="text-[#3B82F6]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-6 pt-10">
        <motion.div variants={{ show: { transition: { staggerChildren: 0.1 } } }} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <motion.div variants={up}>
            <p className="text-2xl font-semibold tracking-tight">{name}</p>
            <p className="mt-2 text-white/50">{title}</p>
          </motion.div>
          <motion.nav variants={up} aria-label="Footer">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/40">Explore</p>
            <ul className="space-y-2.5">{NAV.map(([l, h]) => <li key={h}><a href={h} className={linkCls}>{l}</a></li>)}</ul>
          </motion.nav>
          <motion.div variants={up}>
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/40">Connect</p>
            <ul className="space-y-2.5">
              {links.map(([l, h]) => (
                <li key={l}><a href={h} target="_blank" rel="noopener noreferrer" className={linkCls}>{l}<ArrowUpRight size={14} className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" /></a></li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 pr-14 text-sm text-white/50 sm:pr-0">
          <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <p>Dhaka, Bangladesh{time && <span className="ml-2 tabular-nums">· {time}</span>}</p>
        </div>
      </div>
    </footer>
  )
}
