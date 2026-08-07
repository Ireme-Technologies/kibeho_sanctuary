import { RouterProvider } from 'react-router-dom'
import router from '@router/index'
import { AuthProvider } from '@context/AuthContext'
import { ContentProvider } from '@context/ContentContext'
import { LocaleProvider } from '@context/LocaleContext'

export default function App() {
  return (
    <AuthProvider>
      <LocaleProvider>
        <ContentProvider>
          <RouterProvider router={router} />
        </ContentProvider>
      </LocaleProvider>
    </AuthProvider>
  )
}
