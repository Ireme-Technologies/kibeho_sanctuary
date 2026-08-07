import PageHeader from '@components/ui/PageHeader'
import { useContent } from '@context/ContentContext'

export default function ProjectsHero() {
  const { section, resolveHeaderImage } = useContent()
  const hero = section('projects.hero')
  const title = hero.title || (hero.headlineLines || [])[0] || 'Projects'
  const backgroundImage = resolveHeaderImage(hero.backgroundImage)

  return <PageHeader title={title} backgroundImage={backgroundImage} />
}
