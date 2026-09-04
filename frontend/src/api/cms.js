import { api, ensureCsrf } from './client'

function withQuery(path, params = {}) {
  const query = new URLSearchParams()
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    query.set(key, String(value))
  })
  const qs = query.toString()
  return qs ? `${path}?${qs}` : path
}

function asCollection(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  return []
}

export const fetchSettings = () => api('/api/settings')
export const fetchI18n = (locale) => api(withQuery('/api/i18n', { locale }))
export const updateI18n = (body) => api('/api/i18n', { method: 'PUT', body })
export const fetchServices = (params = {}) => api(withQuery('/api/pilgrimage-services', params))
export const fetchService = (slug, params = {}) =>
  api(withQuery(`/api/pilgrimage-services/${slug}`, params))
export const fetchProjects = (params = {}) => api(withQuery('/api/facilities', params))
export const fetchProject = (slug, params = {}) => api(withQuery(`/api/facilities/${slug}`, params))
export const fetchBlogPosts = (params = {}) => api(withQuery('/api/news', params))
export const fetchBlogPost = (slug, params = {}) => api(withQuery(`/api/news/${slug}`, params))
export const fetchActivities = (params = {}) => api(withQuery('/api/activities', params))
export const fetchActivity = (slug, params = {}) => api(withQuery(`/api/activities/${slug}`, params))
export const fetchUpcomingPilgrimages = (params = {}) =>
  api(withQuery('/api/upcoming-pilgrimages', params))
export const fetchUpcomingPilgrimage = (slug, params = {}) =>
  api(withQuery(`/api/upcoming-pilgrimages/${slug}`, params))
export const fetchPages = (params = {}) => api(withQuery('/api/pages', params))
export const fetchPage = (key, params = {}) =>
  api(withQuery(`/api/pages/${encodeURIComponent(key)}`, params))
export const fetchGallery = (params = {}) => api(withQuery('/api/gallery', params))
export const fetchVideos = (params = {}) => api(withQuery('/api/videos', params))
export const fetchVideo = (slug, params = {}) => api(withQuery(`/api/videos/${slug}`, params))

export async function createVideo(body) {
  return api('/api/videos', { method: 'POST', body })
}

export async function updateVideo(id, body) {
  return api(`/api/videos/${id}`, { method: 'PUT', body })
}

export async function deleteVideo(id) {
  return api(`/api/videos/${id}`, { method: 'DELETE' })
}

export async function reorderVideos(order) {
  return api('/api/videos/reorder', { method: 'PUT', body: { order } })
}

export async function submitContact(payload) {
  return api('/api/contact', { method: 'POST', body: payload })
}

export async function submitEnquiry(payload) {
  return api('/api/pilgrim-enquiries', { method: 'POST', body: payload })
}

export async function fetchEnquiryStats() {
  return api('/api/pilgrim-enquiries/stats')
}

export async function fetchEnquiries(params = {}) {
  const query = new URLSearchParams(params).toString()
  return api(`/api/pilgrim-enquiries${query ? `?${query}` : ''}`)
}

export async function fetchEnquiry(id) {
  return api(`/api/pilgrim-enquiries/${id}`)
}

export async function updateEnquiry(id, body) {
  return api(`/api/pilgrim-enquiries/${id}`, { method: 'PUT', body })
}

export async function deleteEnquiry(id) {
  return api(`/api/pilgrim-enquiries/${id}`, { method: 'DELETE' })
}

export async function replyEnquiry(id, body) {
  return api(`/api/pilgrim-enquiries/${id}/messages`, { method: 'POST', body })
}

export async function uploadEnquiryDocument(id, file, note = '') {
  await ensureCsrf()
  const form = new FormData()
  form.append('file', file)
  if (note) form.append('note', note)
  return api(`/api/pilgrim-enquiries/${id}/documents`, { method: 'POST', body: form })
}

export async function clientRegister(body) {
  await ensureCsrf()
  return api('/api/client/register', { method: 'POST', body })
}

export async function clientLogin(email, password) {
  await ensureCsrf()
  return api('/api/client/login', { method: 'POST', body: { email, password } })
}

export async function fetchClientEnquiries() {
  return api('/api/client/pilgrim-enquiries')
}

export async function fetchClientEnquiry(id) {
  return api(`/api/client/pilgrim-enquiries/${id}`)
}

export async function createClientEnquiry(body) {
  return api('/api/client/pilgrim-enquiries', { method: 'POST', body })
}

export async function replyClientEnquiry(id, body) {
  return api(`/api/client/pilgrim-enquiries/${id}/messages`, { method: 'POST', body })
}

export async function uploadClientEnquiryDocument(id, file, note = '') {
  await ensureCsrf()
  const form = new FormData()
  form.append('file', file)
  if (note) form.append('note', note)
  return api(`/api/client/pilgrim-enquiries/${id}/documents`, { method: 'POST', body: form })
}

export async function login(email, password) {
  await ensureCsrf()
  return api('/api/login', { method: 'POST', body: { email, password } })
}

export async function fetchAdminRegistrationStatus() {
  return api('/api/admin/registration-status')
}

export async function registerAdmin({ name, email, password, password_confirmation }) {
  await ensureCsrf()
  return api('/api/admin/register', {
    method: 'POST',
    body: { name, email, password, password_confirmation },
  })
}

export async function logout() {
  return api('/api/logout', { method: 'POST' })
}

export async function fetchUser() {
  return api('/api/user')
}

export async function updateSettings(settings) {
  return api('/api/settings', { method: 'PUT', body: { settings } })
}

export async function createService(body) {
  return api('/api/pilgrimage-services', { method: 'POST', body })
}

export async function updateService(id, body) {
  return api(`/api/pilgrimage-services/${id}`, { method: 'PUT', body })
}

export async function deleteService(id) {
  return api(`/api/pilgrimage-services/${id}`, { method: 'DELETE' })
}

export async function createProject(body) {
  return api('/api/facilities', { method: 'POST', body })
}

export async function updateProject(id, body) {
  return api(`/api/facilities/${id}`, { method: 'PUT', body })
}

export async function deleteProject(id) {
  return api(`/api/facilities/${id}`, { method: 'DELETE' })
}

export async function createBlogPost(body) {
  return api('/api/news', { method: 'POST', body })
}

export async function updateBlogPost(id, body) {
  return api(`/api/news/${id}`, { method: 'PUT', body })
}

export async function deleteBlogPost(id) {
  return api(`/api/news/${id}`, { method: 'DELETE' })
}

export async function createActivity(body) {
  return api('/api/activities', { method: 'POST', body })
}

export async function updateActivity(id, body) {
  return api(`/api/activities/${id}`, { method: 'PUT', body })
}

export async function deleteActivity(id) {
  return api(`/api/activities/${id}`, { method: 'DELETE' })
}

export async function createUpcomingPilgrimage(body) {
  return api('/api/upcoming-pilgrimages', { method: 'POST', body })
}

export async function updateUpcomingPilgrimage(id, body) {
  return api(`/api/upcoming-pilgrimages/${id}`, { method: 'PUT', body })
}

export async function updateUpcomingPilgrimageArchives(id, archives) {
  return api(`/api/upcoming-pilgrimages/${id}/archives`, {
    method: 'PUT',
    body: { archives },
  })
}

export async function deleteUpcomingPilgrimage(id) {
  return api(`/api/upcoming-pilgrimages/${id}`, { method: 'DELETE' })
}

export const fetchMassSchedules = (params = {}) => api(withQuery('/api/mass-schedules', params))
export const createMassSchedule = (body) => api('/api/mass-schedules', { method: 'POST', body })
export const updateMassSchedule = (id, body) => api(`/api/mass-schedules/${id}`, { method: 'PUT', body })
export const deleteMassSchedule = (id) => api(`/api/mass-schedules/${id}`, { method: 'DELETE' })

export const fetchTestimonials = (params = {}) => api(withQuery('/api/testimonials', params))
export const fetchTestimonial = (slug, params = {}) => api(withQuery(`/api/testimonials/${slug}`, params))
export const createTestimonial = (body) => api('/api/testimonials', { method: 'POST', body })
export const updateTestimonial = (id, body) => api(`/api/testimonials/${id}`, { method: 'PUT', body })
export const deleteTestimonial = (id) => api(`/api/testimonials/${id}`, { method: 'DELETE' })

export const fetchShrineProjects = (params = {}) => api(withQuery('/api/shrine-projects', params))
export const fetchShrineProject = (slug, params = {}) =>
  api(withQuery(`/api/shrine-projects/${slug}`, params))
export const createShrineProject = (body) => api('/api/shrine-projects', { method: 'POST', body })
export const updateShrineProject = (id, body) => api(`/api/shrine-projects/${id}`, { method: 'PUT', body })
export const deleteShrineProject = (id) => api(`/api/shrine-projects/${id}`, { method: 'DELETE' })

export const fetchSacredPlaces = (params = {}) => api(withQuery('/api/sacred-places', params))
export const fetchSacredPlace = (slug, params = {}) =>
  api(withQuery(`/api/sacred-places/${slug}`, params))
export const createSacredPlace = (body) => api('/api/sacred-places', { method: 'POST', body })
export const updateSacredPlace = (id, body) => api(`/api/sacred-places/${id}`, { method: 'PUT', body })
export const deleteSacredPlace = (id) => api(`/api/sacred-places/${id}`, { method: 'DELETE' })

export const fetchPastoralTeam = (params = {}) => api(withQuery('/api/pastoral-team', params))
export const fetchPastoralTeamMember = (slug, params = {}) =>
  api(withQuery(`/api/pastoral-team/${slug}`, params))
export const createPastoralTeamMember = (body) => api('/api/pastoral-team', { method: 'POST', body })
export const updatePastoralTeamMember = (id, body) => api(`/api/pastoral-team/${id}`, { method: 'PUT', body })
export const deletePastoralTeamMember = (id) => api(`/api/pastoral-team/${id}`, { method: 'DELETE' })

export const fetchCommunities = (params = {}) => api(withQuery('/api/communities', params))
export const fetchCommunity = (slug, params = {}) => api(withQuery(`/api/communities/${slug}`, params))
export const createCommunity = (body) => api('/api/communities', { method: 'POST', body })
export const updateCommunity = (id, body) => api(`/api/communities/${id}`, { method: 'PUT', body })
export const deleteCommunity = (id) => api(`/api/communities/${id}`, { method: 'DELETE' })

export const fetchLodging = (params = {}) => api(withQuery('/api/facilities', { lodging: 1, ...params }))

export const fetchVisionaries = (params = {}) =>
  api(withQuery('/api/visionaries', params)).then(asCollection)
export const fetchVisionary = (slug, params = {}) => api(withQuery(`/api/visionaries/${slug}`, params))
export const createVisionary = (body) => api('/api/visionaries', { method: 'POST', body })
export const updateVisionary = (id, body) => api(`/api/visionaries/${id}`, { method: 'PUT', body })
export const deleteVisionary = (id) => api(`/api/visionaries/${id}`, { method: 'DELETE' })

export const fetchMaryMessages = (params = {}) =>
  api(withQuery('/api/mary-messages', params)).then(asCollection)
export const fetchMaryMessage = (id, params = {}) => api(withQuery(`/api/mary-messages/${id}`, params))
export const createMaryMessage = (body) => api('/api/mary-messages', { method: 'POST', body })
export const updateMaryMessage = (id, body) => api(`/api/mary-messages/${id}`, { method: 'PUT', body })
export const deleteMaryMessage = (id) => api(`/api/mary-messages/${id}`, { method: 'DELETE' })

export const fetchTravelRoutes = (params = {}) =>
  api(withQuery('/api/travel-routes', params)).then(asCollection)
export const createTravelRoute = (body) => api('/api/travel-routes', { method: 'POST', body })
export const updateTravelRoute = (id, body) => api(`/api/travel-routes/${id}`, { method: 'PUT', body })
export const deleteTravelRoute = (id) => api(`/api/travel-routes/${id}`, { method: 'DELETE' })

export const fetchOfficialPrayers = (params = {}) => api(withQuery('/api/official-prayers', params))
export const createOfficialPrayer = (body) => api('/api/official-prayers', { method: 'POST', body })
export const updateOfficialPrayer = (id, body) => api(`/api/official-prayers/${id}`, { method: 'PUT', body })
export const deleteOfficialPrayer = (id) => api(`/api/official-prayers/${id}`, { method: 'DELETE' })

export const fetchSpiritualBooks = (params = {}) => api(withQuery('/api/spiritual-books', params))
export const fetchSpiritualBook = (slug, params = {}) => api(withQuery(`/api/spiritual-books/${slug}`, params))
export const createSpiritualBook = (body) => api('/api/spiritual-books', { method: 'POST', body })
export const updateSpiritualBook = (id, body) => api(`/api/spiritual-books/${id}`, { method: 'PUT', body })
export const deleteSpiritualBook = (id) => api(`/api/spiritual-books/${id}`, { method: 'DELETE' })

export const fetchAudioItems = (params = {}) => api(withQuery('/api/audio-items', params))
export const fetchAudioItem = (slug, params = {}) => api(withQuery(`/api/audio-items/${slug}`, params))
export const createAudioItem = (body) => api('/api/audio-items', { method: 'POST', body })
export const updateAudioItem = (id, body) => api(`/api/audio-items/${id}`, { method: 'PUT', body })
export const deleteAudioItem = (id) => api(`/api/audio-items/${id}`, { method: 'DELETE' })

export async function updatePageSection(key, body) {
  return api(`/api/pages/${encodeURIComponent(key)}`, { method: 'PUT', body })
}

export async function fetchContactMessages() {
  return api('/api/contact-messages')
}

export async function deleteContactMessage(id) {
  return api(`/api/contact-messages/${id}`, { method: 'DELETE' })
}

export async function fetchMedia(params = {}) {
  const query = new URLSearchParams(params).toString()
  return api(`/api/media${query ? `?${query}` : ''}`)
}

export async function fetchSiteAssets() {
  return api('/api/media/site-assets')
}

export async function fetchMediaUsage(id) {
  return api(`/api/media/${id}/usage`)
}

export async function fetchSiteAssetUsage(path) {
  const query = new URLSearchParams({ path }).toString()
  return api(`/api/media/site-assets/usage?${query}`)
}

export async function replaceSiteAsset(file, path, role = 'site') {
  await ensureCsrf()
  const form = new FormData()
  form.append('file', file)
  form.append('path', path)
  if (role) form.append('role', role)
  return api('/api/media/site-assets/replace', { method: 'POST', body: form })
}

export async function deleteSiteAsset(path) {
  await ensureCsrf()
  return api('/api/media/site-assets/delete', { method: 'POST', body: { path } })
}

export async function deleteAllSiteAssets() {
  await ensureCsrf()
  return api('/api/media/site-assets/delete-all', { method: 'POST', body: {} })
}

export async function replaceMediaFile(id, file) {
  await ensureCsrf()
  const form = new FormData()
  form.append('file', file)
  return api(`/api/media/${id}/replace`, { method: 'POST', body: form })
}

export async function uploadMedia(file, folder = 'uploads', extras = {}) {
  await ensureCsrf()
  const form = new FormData()
  form.append('file', file)
  form.append('folder', folder)
  Object.entries(extras).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, value)
  })
  return api('/api/media', { method: 'POST', body: form })
}

export async function updateMedia(id, body) {
  return api(`/api/media/${id}`, { method: 'PUT', body })
}

export async function reorderMedia(order) {
  return api('/api/media/reorder', { method: 'PUT', body: { order } })
}

export async function deleteMedia(id) {
  return api(`/api/media/${id}`, { method: 'DELETE' })
}

export async function fetchUsers() {
  return api('/api/users')
}

export async function createUser(body) {
  return api('/api/users', { method: 'POST', body })
}

export async function updateUser(id, body) {
  return api(`/api/users/${id}`, { method: 'PUT', body })
}

export async function deleteUser(id) {
  return api(`/api/users/${id}`, { method: 'DELETE' })
}

export async function changePassword(body) {
  return api('/api/password/change', { method: 'POST', body })
}

export const fetchCmsAudit = () => api('/api/cms-audit')
export const fetchBackupStatus = () => api('/api/backup/status')

export async function downloadSiteBackup() {
  await ensureCsrf()
  const API_BASE = import.meta.env.VITE_API_URL || ''
  const headers = { Accept: 'application/zip, application/json' }
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/)
  if (match) headers['X-XSRF-TOKEN'] = decodeURIComponent(match[1])

  const response = await fetch(`${API_BASE}/api/backup/export`, {
    credentials: 'include',
    headers,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || 'Backup download failed')
  }

  const blob = await response.blob()
  const disposition = response.headers.get('Content-Disposition') || ''
  const named = disposition.match(/filename="?([^"]+)"?/i)
  const filename = named?.[1] || `kibeho-backup-${new Date().toISOString().slice(0, 10)}.zip`
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export async function restoreSiteBackup(file) {
  await ensureCsrf()
  const form = new FormData()
  form.append('file', file)
  form.append('confirm', '1')
  return api('/api/backup/import', { method: 'POST', body: form })
}

export async function forgotPassword(email) {
  await ensureCsrf()
  return api('/api/password/forgot', { method: 'POST', body: { email } })
}

export async function resetPassword(body) {
  await ensureCsrf()
  return api('/api/password/reset', { method: 'POST', body })
}
