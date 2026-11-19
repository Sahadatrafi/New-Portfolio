// Turns any pasted link into { type, id | url } so the CMS only needs one "URL" field.
export function parseVideo(url = '') {
  const u = url.trim()
  let m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/)
  if (m) return { type: 'youtube', id: m[1] }
  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-z0-9]+))?/i)
  if (m) return { type: 'vimeo', id: m[1], hash: m[2] || '' }
  return { type: 'mp4', url: u }
}
export const thumbFor = (v) => {
  if (v.thumbnail) return v.thumbnail
  const p = parseVideo(v.url)
  return p.type === 'youtube' ? `https://img.youtube.com/vi/${p.id}/maxresdefault.jpg` : ''
}

