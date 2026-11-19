import settings from '../content/settings.json'
export const getSettings = () => settings
import experience from '../content/experience.json'
export const getExperience = () => experience.items

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const parse = (v) => { const [y, m] = v.split('-').map(Number); return { y, m } }
export const formatMonth = (v) => { const { y, m } = parse(v); return `${MONTHS[m - 1]} ${y}` }
// Inclusive month count, e.g. 2024-04 to 2024-12 = 9 months
export function duration(start, end) {
  const s = parse(start)
  const e = end ? parse(end) : { y: new Date().getFullYear(), m: new Date().getMonth() + 1 }
  const total = (e.y - s.y) * 12 + (e.m - s.m) + 1
  const y = Math.floor(total / 12), m = total % 12
  return [y ? `${y} yr${y > 1 ? 's' : ''}` : '', m ? `${m} mo${m > 1 ? 's' : ''}` : ''].filter(Boolean).join(' ')
}

const projectFiles = import.meta.glob('../content/projects/*.json', { eager: true })
export const getProjects = () =>
  Object.entries(projectFiles)
    .map(([path, m]) => ({ id: path.split('/').pop().replace('.json', ''), ...(m.default || m) }))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

const videoFiles = import.meta.glob('../content/videos/*.json', { eager: true })
export const getVideos = () =>
  Object.entries(videoFiles)
    .map(([path, m]) => ({ id: path.split('/').pop().replace('.json', ''), ...(m.default || m) }))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

import clients from '../content/clients.json'
export const getClients = () => clients

import reviews from '../content/reviews.json'
export const getReviews = () => reviews

import about from '../content/about.json'
export const getAbout = () => about

import services from '../content/services.json'
export const getServices = () => services

import story from '../content/story.json'
export const getStory = () => story

import processData from '../content/process.json'
export const getProcess = () => processData
