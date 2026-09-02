import HomeHero from '@sections/home/HomeHero'
import HomeQuickLinks from '@sections/home/HomeQuickLinks'
import HomeWelcome from '@sections/home/HomeWelcome'
import HomeActivities from '@sections/home/HomeActivities'
import HomePilgrimStrip from '@sections/home/HomePilgrimStrip'
import HomeSupportProjects from '@sections/home/HomeSupportProjects'
import HomeNewsSimple from '@sections/home/HomeNewsSimple'

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeWelcome />
      <HomeQuickLinks />
      <HomeActivities />
      <HomePilgrimStrip />
      <HomeSupportProjects />
      <HomeNewsSimple />
    </>
  )
}
