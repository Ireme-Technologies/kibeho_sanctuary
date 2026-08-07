import HomeHero from '@sections/home/HomeHero'
import HomeQuickLinks from '@sections/home/HomeQuickLinks'
import HomeWelcome from '@sections/home/HomeWelcome'
import HomeActivities from '@sections/home/HomeActivities'
import HomePilgrimStrip from '@sections/home/HomePilgrimStrip'
import HomeNewsSimple from '@sections/home/HomeNewsSimple'
import HomePartners from '@sections/home/HomePartners'

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeQuickLinks />
      <HomeWelcome />
      <HomeActivities />
      <HomePilgrimStrip />
      <HomeNewsSimple />
      <HomePartners />
    </>
  )
}
