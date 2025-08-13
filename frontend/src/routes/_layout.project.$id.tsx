import { useParams } from 'react-router-dom'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()

  return (
    <main id="main-content">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Project Details</h1>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Project ID: {id}</h2>
          <p className="text-gray-600">This is the detail page for project with ID: {id}</p>
          {/* TODO: Add actual project details component here */}
        </div>
      </div>
    </main>
  )
}
