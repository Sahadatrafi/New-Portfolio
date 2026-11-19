import { useState } from 'react'

function Logo({ client }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className="mx-8 flex h-10 shrink-0 items-center">
      {client.logo && !failed
        ? <img src={client.logo} alt={client.name} loading="lazy" draggable={false} onError={() => setFailed(true)} className="max-h-full w-auto max-w-[120px] object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 dark:opacity-75 dark:brightness-0 dark:invert dark:hover:opacity-100" />
        : <span className="text-sm font-semibold text-slate-600 dark:text-white/70">{client.name}</span>}
    </span>
  )
}

// Label on the left, logos gliding right to left on the right. Sits right under the story video.
export default function TrustedBy({ data }) {
  const items = data.items || []
  if (!items.length) return null
  const group = [0, 1].flatMap((k) => items.map((c) => ({ ...c, k })))
  return (
    <div id="trusted" className="grid items-center gap-5 md:grid-cols-[13rem_1fr]">
      <p className="text-sm leading-snug text-muted">{data.title}</p>
      <div className="marquee overflow-hidden rounded-2xl border border-black/5 bg-white py-4 dark:border-white/10 dark:bg-white/5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track flex w-max" style={{ animationDuration: '32s' }}>
          {[0, 1].map((g) => (
            <div key={g} className="flex shrink-0" aria-hidden={g === 1}>
              {group.map((c) => <Logo key={`${g}-${c.k}-${c.name}`} client={c} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
