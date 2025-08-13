import { Outlet } from 'react-router-dom'

import { Banner } from '../components'
import { AppErrorBoundary } from '../components/AppErrorBoundary'

export default function Layout() {
  return (
    <AppErrorBoundary>
      <a
        href="#main-content"
        className="bg-primary sr-only z-50 rounded px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <Banner />
      <Outlet />
    </AppErrorBoundary>
  )
}
