import { createBrowserRouter, Navigate, useParams } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PageLoader from '@components/ui/PageLoader'
import Layout from '@components/layout/Layout'
import ProtectedRoute from '@admin/components/ProtectedRoute'
import AdminLayout from '@admin/AdminLayout'

const HomePage = lazy(() => import('@pages/HomePage'))
const CmsPage = lazy(() => import('@pages/CmsPage'))
const BlogPage = lazy(() => import('@pages/BlogPage'))
const BlogPostPage = lazy(() => import('@pages/BlogPostPage'))
const ContactPage = lazy(() => import('@pages/ContactPage'))
const GalleryPage = lazy(() => import('@pages/GalleryPage'))
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'))

const LoginPage = lazy(() => import('@admin/LoginPage'))
const DashboardPage = lazy(() => import('@admin/DashboardPage'))
const ServicesAdminPage = lazy(() => import('@admin/ServicesAdminPage'))
const ActivitiesAdminPage = lazy(() => import('@admin/ActivitiesAdminPage'))
const UpcomingPilgrimagesAdminPage = lazy(() => import('@admin/UpcomingPilgrimagesAdminPage'))
const EventUpdatesAdminPage = lazy(() => import('@admin/EventUpdatesAdminPage'))
const ProjectsAdminPage = lazy(() => import('@admin/ProjectsAdminPage'))
const BlogAdminPage = lazy(() => import('@admin/BlogAdminPage'))
const VideosAdminPage = lazy(() => import('@admin/VideosAdminPage'))
const MassSchedulesAdminPage = lazy(() => import('@admin/MassSchedulesAdminPage'))
const TestimonialsAdminPage = lazy(() => import('@admin/TestimonialsAdminPage'))
const ShrineProjectsAdminPage = lazy(() => import('@admin/ShrineProjectsAdminPage'))
const SacredPlacesAdminPage = lazy(() => import('@admin/SacredPlacesAdminPage'))
const PilgrimageDetailPage = lazy(() => import('@pages/PilgrimageDetailPage'))
const VideosPage = lazy(() => import('@pages/VideosPage'))
const MassSchedulePage = lazy(() => import('@pages/MassSchedulePage'))
const TestimonialsPage = lazy(() => import('@pages/TestimonialsPage'))
const HotelsPage = lazy(() => import('@pages/HotelsPage'))
const HotelDetailPage = lazy(() => import('@pages/HotelDetailPage'))
const SacredPlacesPage = lazy(() => import('@pages/SacredPlacesPage'))
const SacredPlaceDetailPage = lazy(() => import('@pages/SacredPlaceDetailPage'))
const SupportProjectsPage = lazy(() => import('@pages/SupportProjectsPage'))
const SupportProjectDetailPage = lazy(() => import('@pages/SupportProjectDetailPage'))
const PastoralTeamPage = lazy(() => import('@pages/PastoralTeamPage'))
const PastoralTeamDetailPage = lazy(() => import('@pages/PastoralTeamDetailPage'))
const CommunitiesPage = lazy(() => import('@pages/CommunitiesPage'))
const CommunityDetailPage = lazy(() => import('@pages/CommunityDetailPage'))
const CalendarPage = lazy(() => import('@pages/CalendarPage'))
const SettingsAdminPage = lazy(() => import('@admin/SettingsAdminPage'))
const MenusAdminPage = lazy(() => import('@admin/MenusAdminPage'))
const SectionsAdminPage = lazy(() => import('@admin/SectionsAdminPage'))
const TranslationsAdminPage = lazy(() => import('@admin/TranslationsAdminPage'))
const EnquiriesAdminPage = lazy(() => import('@admin/EnquiriesAdminPage'))
const GalleryAdminPage = lazy(() => import('@admin/GalleryAdminPage'))
const HomeHeroAdminPage = lazy(() => import('@admin/HomeHeroAdminPage'))
const UsersAdminPage = lazy(() => import('@admin/UsersAdminPage'))
const AccountAdminPage = lazy(() => import('@admin/AccountAdminPage'))
const AuditAdminPage = lazy(() => import('@admin/AuditAdminPage'))
const BackupAdminPage = lazy(() => import('@admin/BackupAdminPage'))
const PastoralTeamAdminPage = lazy(() => import('@admin/PastoralTeamAdminPage'))
const CommunitiesAdminPage = lazy(() => import('@admin/CommunitiesAdminPage'))

const DocsLayout = lazy(() => import('../docs/DocsLayout'))
const DocsHubPage = lazy(() => import('../docs/DocsHubPage'))
const ProposedSolutionPage = lazy(() => import('../docs/ProposedSolutionPage'))
const AdminGuidePage = lazy(() => import('../docs/guide/AdminGuidePage'))
const TechDetailsPage = lazy(() => import('../docs/tech/TechDetailsPage'))

const Wrap = ({ Component, ...props }) => (
  <Suspense fallback={<PageLoader />}>
    <Component {...props} />
  </Suspense>
)

function ChurchesAdmin() {
  return <Wrap Component={SacredPlacesAdminPage} fixedType="church" />
}

function ApparitionSitesAdmin() {
  return <Wrap Component={SacredPlacesAdminPage} fixedType="apparition_site" />
}

function RedirectNewsSlug() {
  const { slug } = useParams()
  return <Navigate to={`/news/${slug}`} replace />
}

const ACTIVITY_REDIRECTS = {
  'touch-the-rock': '/shrine/apparition-sites',
  'light-a-candle': '/spirituality/prayer-intentions',
  water: '/shrine/holy-spring',
  'holy-mass': '/shrine/mass-schedule',
  'mass-readings': '/shrine/mass-schedule',
  'worship-meditation': '/shrine/eucharistic-adorations',
  'rosary-7-sorrows': '/spirituality/seven-sorrows-rosary',
  rosary: '/spirituality/rosary',
  'road-to-the-cross': '/shrine/way-of-the-cross',
}

function RedirectActivitySlug() {
  const { slug } = useParams()
  return <Navigate to={ACTIVITY_REDIRECTS[slug] || '/shrine'} replace />
}

/** Permanent CMS pages (ToR IA) — entity-driven routes are listed separately */
const cmsPaths = [
  'our-lady',
  'our-lady/apparitions',
  'our-lady/visionaries',
  'our-lady/messages',
  'our-lady/church-recognition',
  'our-lady/history',
  'our-lady/faq',
  'shrine',
  'shrine/welcome',
  'shrine/holy-spring',
  'shrine/way-of-the-cross',
  'shrine/eucharistic-adorations',
  'shrine/map',
  'pilgrimage',
  'pilgrimage/why-kibeho',
  'pilgrimage/plan',
  'pilgrimage/transportation',
  'pilgrimage/office',
  'pilgrimage/practical-information',
  'spirituality',
  'spirituality/prayer-intentions',
  'spirituality/request-a-mass',
  'spirituality/rosary',
  'spirituality/seven-sorrows-rosary',
  'spirituality/novena',
  'spirituality/official-prayers',
  'spirituality/meditations',
  'support',
  'support/vision',
  'support/master-plan',
  'support/donations',
  'support/annual-reports',
  'support/transparency',
  'support/partners',
]

const router = createBrowserRouter([
  {
    path: '/docs',
    element: <Wrap Component={DocsLayout} />,
    children: [
      { index: true, element: <Wrap Component={DocsHubPage} /> },
      { path: 'proposed-solution', element: <Wrap Component={ProposedSolutionPage} /> },
      { path: 'sitemap-and-admin-guide', element: <Wrap Component={AdminGuidePage} /> },
      { path: 'sitemap-and-admin-guide/:section', element: <Wrap Component={AdminGuidePage} /> },
      { path: 'server-requirements', element: <Wrap Component={TechDetailsPage} /> },
      { path: 'server-requirements/:section', element: <Wrap Component={TechDetailsPage} /> },
    ],
  },
  {
    path: '/admin/login',
    element: <Wrap Component={LoginPage} />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Wrap Component={DashboardPage} /> },
      { path: 'audit', element: <Wrap Component={AuditAdminPage} /> },
      { path: 'services', element: <Wrap Component={ServicesAdminPage} /> },
      { path: 'activities', element: <Wrap Component={ActivitiesAdminPage} /> },
      { path: 'upcoming-pilgrimages', element: <Wrap Component={UpcomingPilgrimagesAdminPage} /> },
      { path: 'upcoming-pilgrimages/:id/updates', element: <Wrap Component={EventUpdatesAdminPage} /> },
      { path: 'mass-schedules', element: <Wrap Component={MassSchedulesAdminPage} /> },
      { path: 'projects', element: <Wrap Component={ProjectsAdminPage} /> },
      { path: 'shrine-projects', element: <Wrap Component={ShrineProjectsAdminPage} /> },
      { path: 'churches', element: <ChurchesAdmin /> },
      { path: 'apparition-sites', element: <ApparitionSitesAdmin /> },
      { path: 'communities', element: <Wrap Component={CommunitiesAdminPage} /> },
      { path: 'pastoral-team', element: <Wrap Component={PastoralTeamAdminPage} /> },
      { path: 'testimonials', element: <Wrap Component={TestimonialsAdminPage} /> },
      { path: 'blog', element: <Wrap Component={BlogAdminPage} /> },
      { path: 'videos', element: <Wrap Component={VideosAdminPage} /> },
      { path: 'settings', element: <Wrap Component={SettingsAdminPage} /> },
      { path: 'menus', element: <Wrap Component={MenusAdminPage} /> },
      { path: 'sections', element: <Wrap Component={SectionsAdminPage} /> },
      { path: 'translations', element: <Wrap Component={TranslationsAdminPage} /> },
      { path: 'enquiries', element: <Wrap Component={EnquiriesAdminPage} /> },
      { path: 'enquiries/:id', element: <Wrap Component={EnquiriesAdminPage} /> },
      { path: 'gallery', element: <Wrap Component={GalleryAdminPage} /> },
      { path: 'headers', element: <Navigate to="/admin/sections" replace /> },
      { path: 'home-hero', element: <Wrap Component={HomeHeroAdminPage} /> },
      { path: 'users', element: <Wrap Component={UsersAdminPage} /> },
      { path: 'account', element: <Wrap Component={AccountAdminPage} /> },
      { path: 'backup', element: <Wrap Component={BackupAdminPage} /> },
    ],
  },
  {
    path: '/',
    element: <Layout hasHero={true} />,
    children: [{ index: true, element: <Wrap Component={HomePage} /> }],
  },
  {
    path: '/',
    element: <Layout hasHero={false} />,
    children: [
      ...cmsPaths.map((path) => ({
        path,
        element: <Wrap Component={CmsPage} />,
      })),
      { path: 'activities', element: <Navigate to="/shrine" replace /> },
      { path: 'activities/:slug', element: <RedirectActivitySlug /> },
      { path: 'pilgrimages', element: <Navigate to="/pilgrimage/calendar" replace /> },
      { path: 'pilgrimages/:slug', element: <Wrap Component={PilgrimageDetailPage} /> },
      { path: 'pilgrimage/calendar', element: <Wrap Component={CalendarPage} /> },
      { path: 'pilgrimage/accommodation', element: <Wrap Component={HotelsPage} /> },
      { path: 'shrine/mass-schedule', element: <Wrap Component={MassSchedulePage} /> },
      { path: 'shrine/churches', element: <Wrap Component={SacredPlacesPage} type="church" /> },
      { path: 'shrine/churches/:slug', element: <Wrap Component={SacredPlaceDetailPage} /> },
      { path: 'shrine/apparition-sites', element: <Wrap Component={SacredPlacesPage} type="apparition_site" /> },
      { path: 'shrine/apparition-sites/:slug', element: <Wrap Component={SacredPlaceDetailPage} /> },
      { path: 'our-lady/pastoral-team', element: <Wrap Component={PastoralTeamPage} /> },
      { path: 'our-lady/pastoral-team/:slug', element: <Wrap Component={PastoralTeamDetailPage} /> },
      { path: 'our-lady/communities', element: <Wrap Component={CommunitiesPage} /> },
      { path: 'our-lady/communities/:slug', element: <Wrap Component={CommunityDetailPage} /> },
      { path: 'spirituality/testimonies', element: <Wrap Component={TestimonialsPage} /> },
      { path: 'support/projects', element: <Wrap Component={SupportProjectsPage} /> },
      { path: 'support/projects/:slug', element: <Wrap Component={SupportProjectDetailPage} /> },
      { path: 'hotels', element: <Navigate to="/pilgrimage/accommodation" replace /> },
      { path: 'hotels/:slug', element: <Wrap Component={HotelDetailPage} /> },
      { path: 'faq', element: <Navigate to="/our-lady/faq" replace /> },
      { path: 'news', element: <Wrap Component={BlogPage} /> },
      { path: 'news/videos', element: <Wrap Component={VideosPage} /> },
      { path: 'news/:slug', element: <Wrap Component={BlogPostPage} /> },
      { path: 'gallery', element: <Wrap Component={GalleryPage} /> },
      { path: 'contact', element: <Wrap Component={ContactPage} /> },

      /* Legacy redirects → ToR IA */
      { path: 'blog', element: <Navigate to="/news" replace /> },
      { path: 'blog/:slug', element: <RedirectNewsSlug /> },
      { path: 'about', element: <Navigate to="/our-lady" replace /> },
      { path: 'about/kibeho-sanctuary', element: <Navigate to="/shrine/welcome" replace /> },
      { path: 'about/historical-insights', element: <Navigate to="/our-lady/history" replace /> },
      { path: 'about/mass-times', element: <Navigate to="/shrine/mass-schedule" replace /> },
      { path: 'about/water', element: <Navigate to="/shrine/holy-spring" replace /> },
      { path: 'about/accommodations', element: <Navigate to="/pilgrimage/accommodation" replace /> },
      { path: 'about/projects', element: <Navigate to="/support/projects" replace /> },
      { path: 'about/pastoral-team', element: <Navigate to="/our-lady/pastoral-team" replace /> },
      { path: 'about/communities', element: <Navigate to="/our-lady/communities" replace /> },
      { path: 'about/community-attrated', element: <Navigate to="/shrine/welcome" replace /> },
      { path: 'about/*', element: <Navigate to="/our-lady" replace /> },
      { path: 'pilgrimage/what-is-a-pilgrimage', element: <Navigate to="/pilgrimage/why-kibeho" replace /> },
      { path: 'pilgrimage/join', element: <Navigate to="/pilgrimage/plan" replace /> },
      { path: 'pilgrimage/organise', element: <Navigate to="/pilgrimage/plan" replace /> },
      { path: 'pilgrimage/pastoral-theme', element: <Navigate to="/pilgrimage" replace /> },
      { path: 'publications', element: <Navigate to="/news" replace /> },
      { path: 'publications/*', element: <Navigate to="/news" replace /> },
      { path: 'visit', element: <Navigate to="/pilgrimage/practical-information" replace /> },
      { path: 'visit/*', element: <Navigate to="/pilgrimage/practical-information" replace /> },
      { path: 'support/why-donate', element: <Navigate to="/support/donations" replace /> },
      { path: 'support/offerings', element: <Navigate to="/support/donations" replace /> },
      { path: 'support/volunteer', element: <Navigate to="/support/partners" replace /> },
      { path: 'support/friends', element: <Navigate to="/support/partners" replace /> },
      { path: 'services', element: <Navigate to="/pilgrimage" replace /> },
      { path: 'programs', element: <Navigate to="/shrine" replace /> },
      { path: 'projects', element: <Navigate to="/support/projects" replace /> },
      { path: 'careers', element: <Navigate to="/support/partners" replace /> },
    ],
  },
  {
    path: '*',
    element: <Wrap Component={NotFoundPage} />,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
})

export default router
