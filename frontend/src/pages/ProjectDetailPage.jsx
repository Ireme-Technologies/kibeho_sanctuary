import { Navigate, useParams } from 'react-router-dom'
import ProjectDetailHero from '@sections/projects/ProjectDetailHero'
import ProjectDetailContent from '@sections/projects/ProjectDetailContent'
import { useContent } from '@context/ContentContext'

export default function ProjectDetailPage() {
  const { projects } = useContent()
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  return (
    <>
      <ProjectDetailHero project={project} />
      <ProjectDetailContent project={project} />
    </>
  )
}
