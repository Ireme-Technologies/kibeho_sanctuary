import PageHeader from '@components/ui/PageHeader'
import { useContent } from '@context/ContentContext'
import { blogPostHeroTitle, blogPostHeroBackgroundImage } from '@data/blog/BlogPostHero'

export default function BlogPostHero() {
  const { resolveHeaderImage } = useContent()

  return (
    <PageHeader
      title={blogPostHeroTitle}
      backgroundImage={resolveHeaderImage(null, blogPostHeroBackgroundImage)}
    />
  )
}
