import { useCallback, useEffect, useRef, useState } from 'react'
import { Maximize2, Pause, Play, Settings, Volume2, VolumeX } from 'lucide-react'
import { parseVideo } from '../lib/video.js'

const RATES = [0.5, 1, 1.5, 2]
const YT_LABELS = { hd2160: '2160p', hd1440: '1440p', hd1080: '1080p', hd720: '720p', large: '480p', medium: '360p', small: '240p', tiny: '144p' }
const fmt = (s = 0) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

let ytPromise
function loadYT() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (!ytPromise) ytPromise = new Promise((res) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => { prev?.(); res(window.YT) }
    const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s)
  })
  return ytPromise
}

export default function VideoPlayer({ video, poster }) {
  const media = parseVideo(video.url)
  if (media.type === 'vimeo') {
    // Vimeo's own player already includes speed, volume and quality controls.
    const h = media.hash ? `&h=${media.hash}` : ''
    return <iframe title={video.title} className="h-full w-full" allow="autoplay; fullscreen; picture-in-picture"
      src={`https://player.vimeo.com/video/${media.id}?autoplay=1&title=0&byline=0&portrait=0${h}`} />
  }
  return <CustomPlayer video={video} media={media} poster={poster} />
}

function CustomPlayer({ video, media, poster }) {
  const box = useRef(null), holder = useRef(null), vid = useRef(null), resume = useRef(null), ctl = useRef({})
  const [s, setS] = useState({ playing: false, time: 0, dur: 0, vol: 1, muted: false, rate: 1, ready: false })
  const [qualities, setQualities] = useState([])
  const [quality, setQuality] = useState('auto')
  const [menu, setMenu] = useState(null)
  const sources = media.type === 'mp4' ? (video.sources?.length ? video.sources : [{ label: 'Original', url: media.url }]) : []
  const [srcIdx, setSrcIdx] = useState(0)
  const patch = useCallback((p) => setS((o) => ({ ...o, ...p })), [])

  // YouTube (custom controls on top of the official IFrame API)
  useEffect(() => {
    if (media.type !== 'youtube') return
    let player, timer, dead = false
    const node = document.createElement('div'); holder.current.appendChild(node)
    const refreshQ = () => {
      const lv = (player.getAvailableQualityLevels?.() || []).filter((l) => YT_LABELS[l])
      setQualities(lv.map((l) => ({ id: l, label: YT_LABELS[l] })))
    }
    loadYT().then((YT) => {
      if (dead) return
      player = new YT.Player(node, {
        videoId: media.id,
        playerVars: { controls: 0, rel: 0, modestbranding: 1, playsinline: 1, autoplay: 1, disablekb: 1, iv_load_policy: 3 },
        events: {
          onReady: (e) => { patch({ ready: true, dur: e.target.getDuration() }); e.target.playVideo() },
          onStateChange: (e) => { patch({ playing: e.data === 1 }); if (e.data === 1) { patch({ dur: player.getDuration() }); refreshQ() } },
          onPlaybackQualityChange: () => setQuality(player.getPlaybackQuality())
        }
      })
      ctl.current = {
        play: () => player.playVideo(), pause: () => player.pauseVideo(), seek: (t) => player.seekTo(t, true),
        rate: (r) => player.setPlaybackRate(r), vol: (v) => player.setVolume(v * 100),
        mute: (m) => (m ? player.mute() : player.unMute()), quality: (q) => player.setPlaybackQuality(q === 'auto' ? 'default' : q)
      }
      timer = setInterval(() => player?.getCurrentTime && patch({ time: player.getCurrentTime() }), 250)
    })
    return () => { dead = true; clearInterval(timer); try { player?.destroy() } catch (e) {} node.remove() }
  }, [media.type, media.id, patch])

  // MP4 (native video; quality = switch between the listed source files)
  useEffect(() => {
    if (media.type !== 'mp4') return
    const v = vid.current
    ctl.current = {
      play: () => v.play(), pause: () => v.pause(), seek: (t) => { v.currentTime = t }, rate: (r) => { v.playbackRate = r },
      vol: (x) => { v.volume = x }, mute: (m) => { v.muted = m },
      quality: (id) => { resume.current = { t: v.currentTime, play: !v.paused }; setSrcIdx(Number(id)) }
    }
  }, [media.type])

  const onLoaded = () => {
    const v = vid.current
    patch({ ready: true, dur: v.duration })
    if (resume.current) { v.currentTime = resume.current.t; v.playbackRate = s.rate; if (resume.current.play) v.play(); resume.current = null }
  }

  const toggle = () => (s.playing ? ctl.current.pause?.() : ctl.current.play?.())
  const pick = (kind, val) => {
    if (kind === 'rate') { ctl.current.rate?.(val); patch({ rate: val }) }
    if (kind === 'quality') { ctl.current.quality?.(val); setQuality(val) }
    setMenu(null)
  }
  const qList = media.type === 'mp4' ? (sources.length > 1 ? sources.map((x, i) => ({ id: String(i), label: x.label })) : []) : qualities
  const qActive = media.type === 'mp4' ? String(srcIdx) : quality
  const qLabel = qList.find((q) => q.id === qActive)?.label || 'Auto'
  const fullscreen = () => { try { document.fullscreenElement ? document.exitFullscreen() : box.current.requestFullscreen?.() } catch (e) {} }

  const item = (active) => `block w-full rounded-lg px-3 py-1.5 text-left text-sm ${active ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'}`
  const ib = 'grid h-9 w-9 place-items-center rounded-full text-white transition hover:bg-white/15'
  return (
    <div ref={box} className="group relative h-full w-full bg-black">
      {poster && !s.ready && <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 blur-sm" />}
      {media.type === 'youtube' && <div ref={holder} className="absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full" />}
      {media.type === 'mp4' && <video ref={vid} src={sources[srcIdx].url} autoPlay playsInline preload="metadata" className="absolute inset-0 h-full w-full object-contain"
        onLoadedMetadata={onLoaded} onTimeUpdate={() => patch({ time: vid.current.currentTime })} onPlay={() => patch({ playing: true })} onPause={() => patch({ playing: false })} />}
      <button onClick={toggle} aria-label={s.playing ? 'Pause' : 'Play'} className="absolute inset-0 bottom-14 cursor-pointer" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8">
        <input type="range" min="0" max={s.dur || 0} step="0.1" value={s.time} aria-label="Seek" onChange={(e) => { ctl.current.seek?.(+e.target.value); patch({ time: +e.target.value }) }} className="h-1 w-full cursor-pointer accent-accent" />
        <div className="mt-1 flex items-center gap-1 text-white">
          <button onClick={toggle} aria-label={s.playing ? 'Pause' : 'Play'} className={ib}>{s.playing ? <Pause size={18} /> : <Play size={18} />}</button>
          <button onClick={() => { ctl.current.mute?.(!s.muted); patch({ muted: !s.muted }) }} aria-label={s.muted ? 'Unmute' : 'Mute'} className={ib}>{s.muted || s.vol === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
          <input type="range" min="0" max="1" step="0.05" value={s.muted ? 0 : s.vol} aria-label="Volume" className="hidden h-1 w-20 cursor-pointer accent-accent sm:block"
            onChange={(e) => { const v = +e.target.value; ctl.current.vol?.(v); ctl.current.mute?.(v === 0); patch({ vol: v, muted: v === 0 }) }} />
          <span className="ml-2 text-xs tabular-nums text-white/80">{fmt(s.time)} / {fmt(s.dur)}</span>
          <div className="ml-auto flex items-center gap-1">
            <div className="relative">
              <button onClick={() => setMenu(menu === 'rate' ? null : 'rate')} aria-label="Playback speed" className="h-9 rounded-full px-3 text-sm font-medium hover:bg-white/15">{s.rate}x</button>
              {menu === 'rate' && <div className="absolute bottom-11 right-0 w-24 rounded-xl bg-black/90 p-1">{RATES.map((r) => <button key={r} onClick={() => pick('rate', r)} className={item(r === s.rate)}>{r}x</button>)}</div>}
            </div>
            {qList.length > 0 && (
              <div className="relative">
                <button onClick={() => setMenu(menu === 'q' ? null : 'q')} aria-label="Quality" className="flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium hover:bg-white/15"><Settings size={16} />{qLabel}</button>
                {menu === 'q' && <div className="absolute bottom-11 right-0 w-28 rounded-xl bg-black/90 p-1">
                  {media.type === 'youtube' && <button onClick={() => pick('quality', 'auto')} className={item(qActive === 'auto')}>Auto</button>}
                  {qList.map((q) => <button key={q.id} onClick={() => pick('quality', q.id)} className={item(q.id === qActive)}>{q.label}</button>)}
                </div>}
              </div>
            )}
            <button onClick={fullscreen} aria-label="Fullscreen" className={ib}><Maximize2 size={17} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
