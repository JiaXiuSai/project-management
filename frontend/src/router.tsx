import { createBrowserRouter } from 'react-router-dom'

import Layout from './routes/_layout'
import Home from './routes/_layout._index'
import About from './routes/_layout.about'
import ProjectDetail from './routes/_layout.project.$id'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'project/:id',
        element: <ProjectDetail />,
      },
    ],
  },
])
