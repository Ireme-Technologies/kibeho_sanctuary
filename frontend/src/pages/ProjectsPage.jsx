import ProjectsHero from '@sections/projects/ProjectsHero'
import ProjectsGrid from '@sections/projects/ProjectsGrid'
import ProjectsCTA from '@sections/projects/ProjectsCTA'
import GoogleReviews from '@sections/shared/GoogleReviews'

export default function ProjectsPage() {
  return (
    <>
      <ProjectsHero />
      <ProjectsGrid />
      <GoogleReviews />
      <ProjectsCTA />
    </>
  )
}
