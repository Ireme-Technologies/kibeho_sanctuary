import { createBrowserRouter, Navigate, useParams, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PageLoader from '@components/ui/PageLoader'
import Layout from '@components/layout/Layout'
import ProtectedRoute from '@admin/components/ProtectedRoute'
import AdminLayout from '@admin/AdminLayout'
import LocaleRoute, { RedirectToLocalized } from './LocaleRoute'
import { useLocale } from '@context/LocaleContext'
import { useContent } from '@context/ContentContext'
import { parseLocalizedPathname, withLocale, localizeHref } from '@i18n/localizedPath'

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
const UpcomingPilgrimagesAdminPage = lazy(() => import('@admin/UpcomingPilgrimagesAdminPage'))
const EventUpdatesAdminPage = lazy(() => import('@admin/EventUpdatesAdminPage'))
const ProjectsAdminPage = lazy(() => import('@admin/ProjectsAdminPage'))
const BlogAdminPage = lazy(() => import('@admin/BlogAdminPage'))
const VideosAdminPage = lazy(() => import('@admin/VideosAdminPage'))
const MassSchedulesAdminPage = lazy(() => import('@admin/MassSchedulesAdminPage'))
const ShrineProjectsAdminPage = lazy(() => import('@admin/ShrineProjectsAdminPage'))
const SacredPlacesAdminPage = lazy(() => import('@admin/SacredPlacesAdminPage'))
const VisionariesAdminPage = lazy(() => import('@admin/VisionariesAdminPage'))
const MaryMessagesAdminPage = lazy(() => import('@admin/MaryMessagesAdminPage'))
const TravelRoutesAdminPage = lazy(() => import('@admin/TravelRoutesAdminPage'))
const OfficialPrayersAdminPage = lazy(() => import('@admin/OfficialPrayersAdminPage'))
const SpiritualBooksAdminPage = lazy(() => import('@admin/SpiritualBooksAdminPage'))
const AudioItemsAdminPage = lazy(() => import('@admin/AudioItemsAdminPage'))
const PilgrimageDetailPage = lazy(() => import('@pages/PilgrimageDetailPage'))
const VideosPage = lazy(() => import('@pages/VideosPage'))
const ShrineSchedulePage = lazy(() => import('@pages/ShrineSchedulePage'))
const VisionariesPage = lazy(() => import('@pages/VisionariesPage'))
const VisionaryDetailPage = lazy(() => import('@pages/VisionaryDetailPage'))
const MaryMessagesPage = lazy(() => import('@pages/MaryMessagesPage'))
const OfficialPrayersPage = lazy(() => import('@pages/OfficialPrayersPage'))
const BooksPage = lazy(() => import('@pages/BooksPage'))
const AudioCatalogPage = lazy(() => import('@pages/AudioCatalogPage'))
const HotelsPage = lazy(() => import('@pages/HotelsPage'))
const HotelDetailPage = lazy(() => import('@pages/HotelDetailPage'))
const SacredPlacesPage = lazy(() => import('@pages/SacredPlacesPage'))
const SacredPlaceDetailPage = lazy(() => import('@pages/SacredPlaceDetailPage'))
const GetInvolvedPage = lazy(() => import('@pages/GetInvolvedPage'))
const WelcomePage = lazy(() => import('@pages/WelcomePage'))
const SupportProjectsPage = lazy(() => import('@pages/SupportProjectsPage'))
const SupportProjectDetailPage = lazy(() => import('@pages/SupportProjectDetailPage'))
const PastoralTeamPage = lazy(() => import('@pages/PastoralTeamPage'))
const PastoralTeamDetailPage = lazy(() => import('@pages/PastoralTeamDetailPage'))
const CommunitiesPage = lazy(() => import('@pages/CommunitiesPage'))
const CommunityDetailPage = lazy(() => import('@pages/CommunityDetailPage'))
const CalendarPage = lazy(() => import('@pages/CalendarPage'))
const SettingsAdminPage = lazy(() => import('@admin/SettingsAdminPage'))
const MenusAdminPage = lazy(() => import('@admin/MenusAdminPage'))
const ButtonsAdminPage = lazy(() => import('@admin/ButtonsAdminPage'))
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

function MainPlacesAdmin() {
  return <Wrap Component={SacredPlacesAdminPage} fixedType="main_place" />
}

function ApparitionSitesAdmin() {
  return <Wrap Component={SacredPlacesAdminPage} fixedType="apparition_site" />
}

function AudioPage() {
  return <Wrap Component={AudioCatalogPage} type="audio" />
}

function DocumentariesPage() {
  return <Wrap Component={AudioCatalogPage} type="documentary" />
}

function BroadcastPage() {
  return <Wrap Component={AudioCatalogPage} type="broadcast" />
}

function LocalizedNavigate({ to, replace = true }) {
  const { locale, defaultLocale } = useLocale()
  const { pages } = useContent()
  return (
    <Navigate
      to={localizeHref(to, locale || defaultLocale, pages, defaultLocale)}
      replace={replace}
    />
  )
}

function RedirectNewsSlug() {
  const { slug } = useParams()
  return <LocalizedNavigate to={`/news/${slug}`} />
}

function RedirectHotelSlug() {
  const { slug } = useParams()
  return <LocalizedNavigate to={`/pilgrimage/accommodation/${slug}`} />
}

const ACTIVITY_REDIRECTS = {
  'touch-the-rock': '/shrine/apparition-sites',
  'light-a-candle': '/spirituality/light-a-candle',
  water: '/shrine/places',
  'holy-mass': '/shrine/schedule',
  'mass-readings': '/shrine/schedule',
  'worship-meditation': '/spirituality/adoration-worship',
  'rosary-7-sorrows': '/spirituality',
  rosary: '/spirituality',
  'road-to-the-cross': '/shrine/places',
}

function RedirectActivitySlug() {
  const { slug } = useParams()
  return <LocalizedNavigate to={ACTIVITY_REDIRECTS[slug] || '/shrine'} />
}

function HomeLocaleRedirect() {
  const { locale, defaultLocale, ready, publicLocales } = useLocale()
  if (!ready) return null
  const allowed = (publicLocales || []).map((item) => item.code)
  const code = allowed.includes(locale) ? locale : defaultLocale
  return <Navigate to={`/${code}`} replace />
}

function LocaleAwareLayout() {
  const location = useLocation()
  const { path } = parseLocalizedPathname(location.pathname)
  const hasHero = path === '/'
  return <LocaleRoute Layout={Layout} hasHero={hasHero} />
}

/** Entity + structural routes under /:locale/… — CMS pages use the splat. */
const localizedChildren = [
  { index: true, element: <Wrap Component={HomePage} /> },
  { path: 'activities', element: <LocalizedNavigate to="/shrine" /> },
  { path: 'activities/:slug', element: <RedirectActivitySlug /> },
  { path: 'pilgrimages', element: <LocalizedNavigate to="/pilgrimage/annual-celebrations" /> },
  { path: 'pilgrimages/:slug', element: <Wrap Component={PilgrimageDetailPage} /> },
  { path: 'pilgrimage/calendar', element: <Wrap Component={CalendarPage} /> },
  { path: 'pilgrimage/accommodation', element: <Wrap Component={HotelsPage} /> },
  { path: 'pilgrimage/accommodation/:slug', element: <Wrap Component={HotelDetailPage} /> },
  { path: 'shrine/schedule', element: <Wrap Component={ShrineSchedulePage} /> },
  { path: 'shrine/places', element: <Wrap Component={SacredPlacesPage} type="main_place" /> },
  { path: 'shrine/places/:slug', element: <Wrap Component={SacredPlaceDetailPage} /> },
  { path: 'shrine/apparition-sites', element: <Wrap Component={SacredPlacesPage} type="apparition_site" /> },
  { path: 'shrine/apparition-sites/:slug', element: <Wrap Component={SacredPlaceDetailPage} /> },
  { path: 'shrine/visionaries', element: <Wrap Component={VisionariesPage} /> },
  { path: 'shrine/visionaries/:slug', element: <Wrap Component={VisionaryDetailPage} /> },
  { path: 'shrine/messages', element: <Wrap Component={MaryMessagesPage} /> },
  { path: 'shrine/pastoral-team', element: <Wrap Component={PastoralTeamPage} /> },
  { path: 'shrine/pastoral-team/:slug', element: <Wrap Component={PastoralTeamDetailPage} /> },
  { path: 'shrine/communities', element: <Wrap Component={CommunitiesPage} /> },
  { path: 'shrine/communities/:slug', element: <Wrap Component={CommunityDetailPage} /> },
  { path: 'spirituality/official-prayers', element: <Wrap Component={OfficialPrayersPage} /> },
  { path: 'spirituality/books', element: <Wrap Component={BooksPage} /> },
  { path: 'news/audio', element: <AudioPage /> },
  { path: 'news/documentaries', element: <DocumentariesPage /> },
  { path: 'news/broadcast', element: <BroadcastPage /> },
  { path: 'broadcast', element: <BroadcastPage /> },
  { path: 'support/get-involved', element: <Wrap Component={GetInvolvedPage} /> },
  { path: 'shrine/welcome', element: <Wrap Component={WelcomePage} /> },
  { path: 'shrine/map', element: <LocalizedNavigate to="/shrine/welcome#pillar-explore" /> },
  { path: 'support/projects', element: <Wrap Component={SupportProjectsPage} /> },
  { path: 'support/projects/:slug', element: <Wrap Component={SupportProjectDetailPage} /> },
  { path: 'hotels', element: <LocalizedNavigate to="/pilgrimage/accommodation" /> },
  { path: 'hotels/:slug', element: <RedirectHotelSlug /> },
  { path: 'faq', element: <LocalizedNavigate to="/shrine/faq" /> },
  { path: 'news', element: <Wrap Component={BlogPage} /> },
  { path: 'news/videos', element: <Wrap Component={VideosPage} /> },
  { path: 'news/:slug', element: <Wrap Component={BlogPostPage} /> },
  { path: 'gallery', element: <Wrap Component={GalleryPage} /> },
  { path: 'contact', element: <Wrap Component={ContactPage} /> },

  /* Legacy redirects → 5-pillar IA */
  { path: 'blog', element: <LocalizedNavigate to="/news" /> },
  { path: 'blog/:slug', element: <RedirectNewsSlug /> },
  { path: 'our-lady', element: <LocalizedNavigate to="/shrine" /> },
  { path: 'our-lady/apparitions', element: <LocalizedNavigate to="/shrine/apparition-sites" /> },
  { path: 'our-lady/visionaries', element: <LocalizedNavigate to="/shrine/visionaries" /> },
  { path: 'our-lady/messages', element: <LocalizedNavigate to="/shrine/messages" /> },
  { path: 'our-lady/church-recognition', element: <LocalizedNavigate to="/shrine/history" /> },
  { path: 'our-lady/history', element: <LocalizedNavigate to="/shrine/history" /> },
  { path: 'our-lady/pastoral-team', element: <LocalizedNavigate to="/shrine/pastoral-team" /> },
  { path: 'our-lady/pastoral-team/:slug', element: <LocalizedNavigate to="/shrine/pastoral-team" /> },
  { path: 'our-lady/communities', element: <LocalizedNavigate to="/shrine/communities" /> },
  { path: 'our-lady/communities/:slug', element: <LocalizedNavigate to="/shrine/communities" /> },
  { path: 'our-lady/faq', element: <LocalizedNavigate to="/shrine/faq" /> },
  { path: 'our-lady/*', element: <LocalizedNavigate to="/shrine" /> },
  { path: 'shrine/mass-schedule', element: <LocalizedNavigate to="/shrine/schedule" /> },
  { path: 'shrine/churches', element: <LocalizedNavigate to="/shrine/places" /> },
  { path: 'shrine/churches/:slug', element: <LocalizedNavigate to="/shrine/places" /> },
  { path: 'spirituality/request-a-mass', element: <LocalizedNavigate to="/spirituality/mass-request" /> },
  { path: 'spirituality/testimonies', element: <LocalizedNavigate to="/spirituality/share-testimony" /> },
  { path: 'about', element: <LocalizedNavigate to="/shrine" /> },
  { path: 'about/kibeho-sanctuary', element: <LocalizedNavigate to="/shrine/welcome" /> },
  { path: 'about/historical-insights', element: <LocalizedNavigate to="/shrine/history" /> },
  { path: 'about/mass-times', element: <LocalizedNavigate to="/shrine/schedule" /> },
  { path: 'about/water', element: <LocalizedNavigate to="/shrine/holy-spring" /> },
  { path: 'about/accommodations', element: <LocalizedNavigate to="/pilgrimage/accommodation" /> },
  { path: 'about/projects', element: <LocalizedNavigate to="/support/projects" /> },
  { path: 'about/pastoral-team', element: <LocalizedNavigate to="/shrine/pastoral-team" /> },
  { path: 'about/communities', element: <LocalizedNavigate to="/shrine/communities" /> },
  { path: 'about/community-attrated', element: <LocalizedNavigate to="/shrine/welcome" /> },
  { path: 'about/*', element: <LocalizedNavigate to="/shrine" /> },
  { path: 'pilgrimage/what-is-a-pilgrimage', element: <LocalizedNavigate to="/pilgrimage/why-kibeho" /> },
  { path: 'pilgrimage/join', element: <LocalizedNavigate to="/pilgrimage/plan" /> },
  { path: 'pilgrimage/organise', element: <LocalizedNavigate to="/pilgrimage/plan" /> },
  { path: 'pilgrimage/pastoral-theme', element: <LocalizedNavigate to="/pilgrimage" /> },
  { path: 'pilgrimage/transportation', element: <LocalizedNavigate to="/pilgrimage/how-to-get-here" /> },
  { path: 'pilgrimage/practical-information', element: <LocalizedNavigate to="/pilgrimage/practical-guidelines" /> },
  { path: 'publications', element: <LocalizedNavigate to="/news" /> },
  { path: 'publications/*', element: <LocalizedNavigate to="/news" /> },
  { path: 'visit', element: <LocalizedNavigate to="/pilgrimage/practical-guidelines" /> },
  { path: 'visit/*', element: <LocalizedNavigate to="/pilgrimage/practical-guidelines" /> },
  { path: 'support/why-donate', element: <LocalizedNavigate to="/support/get-involved" /> },
  { path: 'support/offerings', element: <LocalizedNavigate to="/support/get-involved" /> },
  { path: 'support/donations', element: <LocalizedNavigate to="/support/get-involved" /> },
  { path: 'support/volunteer', element: <LocalizedNavigate to="/support" /> },
  { path: 'support/friends', element: <LocalizedNavigate to="/support" /> },
  { path: 'services', element: <LocalizedNavigate to="/pilgrimage" /> },
  { path: 'programs', element: <LocalizedNavigate to="/shrine" /> },
  { path: 'projects', element: <LocalizedNavigate to="/support/projects" /> },
  { path: 'careers', element: <LocalizedNavigate to="/support" /> },

  /* CMS information pages — English or translated paths */
  { path: '*', element: <Wrap Component={CmsPage} /> },
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
      { path: 'menus', element: <Wrap Component={MenusAdminPage} /> },
      { path: 'buttons', element: <Wrap Component={ButtonsAdminPage} /> },
      { path: 'sections', element: <Wrap Component={SectionsAdminPage} /> },
      { path: 'home-hero', element: <Wrap Component={HomeHeroAdminPage} /> },
      { path: 'translations', element: <Wrap Component={TranslationsAdminPage} /> },
      { path: 'blog', element: <Wrap Component={BlogAdminPage} /> },
      { path: 'upcoming-pilgrimages', element: <Wrap Component={UpcomingPilgrimagesAdminPage} /> },
      { path: 'upcoming-pilgrimages/:id/updates', element: <Wrap Component={EventUpdatesAdminPage} /> },
      { path: 'services', element: <Wrap Component={ServicesAdminPage} /> },
      { path: 'mass-schedules', element: <Wrap Component={MassSchedulesAdminPage} /> },
      { path: 'shrine-projects', element: <Wrap Component={ShrineProjectsAdminPage} /> },
      { path: 'apparition-sites', element: <ApparitionSitesAdmin /> },
      { path: 'main-places', element: <MainPlacesAdmin /> },
      { path: 'visionaries', element: <Wrap Component={VisionariesAdminPage} /> },
      { path: 'mary-messages', element: <Wrap Component={MaryMessagesAdminPage} /> },
      { path: 'travel-routes', element: <Wrap Component={TravelRoutesAdminPage} /> },
      { path: 'official-prayers', element: <Wrap Component={OfficialPrayersAdminPage} /> },
      { path: 'spiritual-books', element: <Wrap Component={SpiritualBooksAdminPage} /> },
      { path: 'audio-items', element: <Wrap Component={AudioItemsAdminPage} /> },
      { path: 'communities', element: <Wrap Component={CommunitiesAdminPage} /> },
      { path: 'pastoral-team', element: <Wrap Component={PastoralTeamAdminPage} /> },
      { path: 'projects', element: <Wrap Component={ProjectsAdminPage} /> },
      { path: 'gallery', element: <Wrap Component={GalleryAdminPage} /> },
      { path: 'videos', element: <Wrap Component={VideosAdminPage} /> },
      { path: 'enquiries', element: <Wrap Component={EnquiriesAdminPage} /> },
      { path: 'enquiries/:id', element: <Wrap Component={EnquiriesAdminPage} /> },
      { path: 'settings', element: <Wrap Component={SettingsAdminPage} /> },
      { path: 'headers', element: <Navigate to="/admin/sections" replace /> },
      { path: 'users', element: <Wrap Component={UsersAdminPage} /> },
      { path: 'account', element: <Wrap Component={AccountAdminPage} /> },
      { path: 'backup', element: <Wrap Component={BackupAdminPage} /> },
      { path: 'activities', element: <Navigate to="/admin/apparition-sites" replace /> },
      { path: 'churches', element: <Navigate to="/admin/main-places" replace /> },
      { path: 'testimonials', element: <Navigate to="/admin/enquiries" replace /> },
    ],
  },
  {
    path: '/',
    element: <HomeLocaleRedirect />,
  },
  {
    path: '/:locale',
    element: <LocaleAwareLayout />,
    children: localizedChildren,
  },
  {
    path: '*',
    element: <RedirectToLocalized />,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
})

export default router
