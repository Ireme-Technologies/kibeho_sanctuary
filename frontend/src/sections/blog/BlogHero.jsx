import PageHeader from '@components/ui/PageHeader'
import { useContent } from '@context/ContentContext'
import { blogHeroTitle as fbTitle, blogHeroBackgroundImage as fbBg } from '@data/blog/BlogHero'

export default function BlogHero() {
  const { section, resolveHeaderImage } = useContent()
  const blogHero = section('blog.hero')
  const title = blogHero.title || fbTitle
  const backgroundImage = resolveHeaderImage(blogHero.backgroundImage, fbBg)

  return <PageHeader title={title} backgroundImage={backgroundImage} />
}
