import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  MessageCircle,
  Mail,
  Globe,
  Link as LinkIcon,
  Music2,
  Send,
  Share2,
} from 'lucide-react'

const ICON_MAP = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  x: Twitter,
  twitter: Twitter,
  whatsapp: MessageCircle,
  mail: Mail,
  email: Mail,
  globe: Globe,
  website: Globe,
  link: LinkIcon,
  tiktok: Music2,
  telegram: Send,
  share: Share2,
}

/**
 * Infer a known network key from label or URL.
 */
export function inferSocialKey({ label = '', href = '', iconKey = '', iconCode = '' } = {}) {
  const code = String(iconCode || iconKey || '').toLowerCase().trim()
  if (code && ICON_MAP[code]) return code

  const hay = `${label} ${href}`.toLowerCase()
  if (hay.includes('facebook') || hay.includes('fb.com')) return 'facebook'
  if (hay.includes('instagram')) return 'instagram'
  if (hay.includes('youtube') || hay.includes('youtu.be')) return 'youtube'
  if (hay.includes('linkedin')) return 'linkedin'
  if (hay.includes('tiktok')) return 'tiktok'
  if (hay.includes('whatsapp') || hay.includes('wa.me')) return 'whatsapp'
  if (hay.includes('telegram') || hay.includes('t.me')) return 'telegram'
  if (/(^|[^a-z])x\.com|twitter/.test(hay)) return 'x'
  if (hay.includes('mailto:') || hay.includes('email')) return 'mail'
  return code || 'link'
}

export function resolveSocialIcon(social = {}) {
  const key = inferSocialKey(social)
  return ICON_MAP[key] || LinkIcon
}

/** Only socials with a non-empty URL should appear on the public site. */
export function getVisibleSocials(socials = []) {
  if (!Array.isArray(socials)) return []
  return socials.filter((item) => String(item?.href || '').trim())
}

export const SOCIAL_ICON_CODE_HINT =
  'Examples: facebook, instagram, youtube, x, linkedin, tiktok, whatsapp, telegram, mail, globe, link'
