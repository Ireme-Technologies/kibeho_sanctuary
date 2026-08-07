import AboutHero from '@sections/about/AboutHero'
import OurStory from '@sections/about/OurStory'
import MissionVision from '@sections/about/MissionVision'
import Timeline from '@sections/about/Timeline'
import AboutCTA from '@sections/about/AboutCTA'
import CoreValues from '@sections/about/CoreValues'
import GoogleReviews from '@sections/shared/GoogleReviews'

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <MissionVision />
      <CoreValues />
      <Timeline />
      <GoogleReviews />
      <AboutCTA />
    </>
  )
}
