import { Banner, ProjectList } from './components'
import { AppErrorBoundary } from './components/AppErrorBoundary'

const App = () => {
  return (
    <AppErrorBoundary>
      <a
        href="#main-content"
        className="bg-primary sr-only z-50 rounded px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <Banner />
      <main id="main-content">
        <ProjectList />
      </main>
    </AppErrorBoundary>
  )
}

export default App
