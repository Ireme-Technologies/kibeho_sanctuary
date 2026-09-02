import { primaryNav } from '@data/navigation'
import { missionVision, coreValues } from '@data/about'

/** Shrine submenu links shown on the welcome hub (excluding this page). */
export function defaultShrineExploreLinks() {
  const shrine = primaryNav.find((item) => item.path === '/shrine')
  const children = Array.isArray(shrine?.children) ? shrine.children : []
  return children
    .filter((item) => item.path && item.path !== '/shrine/welcome')
    .map((item) => ({ label: item.label, path: item.path }))
}

export const welcomePageDefaults = {
  mission: {
    eyebrow: missionVision.mission.eyebrow,
    title: missionVision.mission.heading,
    text: missionVision.mission.text,
  },
  vision: {
    eyebrow: missionVision.vision.eyebrow,
    title: missionVision.vision.heading,
    text: missionVision.vision.text,
  },
  values: coreValues.map(({ title, description }) => ({
    title,
    text: description,
  })),
  leadership: {
    title: 'Leadership team',
    intro:
      'Meet the priests and pastoral workers who welcome pilgrims, celebrate the liturgy, and accompany the life of the Shrine.',
  },
  map: {
    image: '/images/sanctuary/home-reference.png',
    alt: 'Plan of the Shrine of Our Lady of Kibeho',
    caption: 'Find churches, apparition sites, and prayer paths across the hillside.',
  },
  exploreLinks: defaultShrineExploreLinks(),
}
