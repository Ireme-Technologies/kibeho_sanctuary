import { useState } from 'react'
import ProjectCard from './ProjectCard'
import ProjectFilter from './ProjectFilter'
import styles from './ProjectsGrid.module.css'
import { useContent } from '@context/ContentContext'
import { projectCategories, projectsEmptyMessage } from '@data/projects'

export default function ProjectsGrid() {
  const { projects } = useContent()
  const [activeCategory, setActiveCategory] = useState(projectCategories[0])

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === activeCategory)

  return (
    <section className={styles.section} aria-label="Projects">
      <div className={styles.container}>
        <ProjectFilter active={activeCategory} onChange={setActiveCategory} />

        {filteredProjects.length > 0 ? (
          <div className={styles.grid}>
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <p className={styles.emptyMessage}>{projectsEmptyMessage}</p>
        )}
      </div>
    </section>
  )
}