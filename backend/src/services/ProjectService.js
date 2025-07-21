import { incrementId, nextId, projects } from '../../mockData.js'
import config from '../config/index.js'
import { AVAILABLE_STATUSES, Project } from '../models/Project.js'

export class ProjectService {
  // Get all projects with filtering, search, and pagination
  static async getProjects(query = {}) {
    const { search = '', page = 1, limit = 10, status = '' } = query

    // Add delay for development
    if (config.addDelay) {
      await this.addDelay(config.delayMs)
    }

    // Filter projects by search term
    let filteredProjects = this.searchProjects(projects, search)

    // Filter by status if provided
    if (status && status.trim() !== '') {
      filteredProjects = filteredProjects.filter((project) => project.status === status)
    }

    // Calculate pagination
    const totalProjects = filteredProjects.length
    const totalPages = Math.ceil(totalProjects / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

    // Return full project data
    const projectsToReturn = paginatedProjects.map((project) => new Project(project))

    return {
      projects: projectsToReturn,
      pagination: {
        currentPage: page,
        totalPages,
        totalProjects,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }
  }

  // Get a specific project by ID
  static async getProjectById(id) {
    if (config.addDelay) {
      await this.addDelay(500)
    }

    const projectId = parseInt(id)
    if (isNaN(projectId)) {
      throw new Error('Invalid project ID')
    }

    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      throw new Error('Project not found')
    }

    return new Project(project)
  }

  // Create a new project
  static async createProject(projectData) {
    if (config.addDelay) {
      await this.addDelay(1200)
    }

    // Validate project data
    const { error, value } = Project.validate(projectData)
    if (error) {
      throw new Error(error.details[0].message)
    }

    // Check if project with same name already exists
    if (!Project.isNameUnique(value.name, projects)) {
      throw new Error('A project with this name already exists')
    }

    const newProject = new Project({
      id: nextId,
      ...value,
    })

    incrementId()
    projects.unshift(newProject.toJSON())

    return newProject
  }

  // Update a project
  static async updateProject(id, updateData) {
    if (config.addDelay) {
      await this.addDelay(1000)
    }

    const projectId = parseInt(id)
    if (isNaN(projectId)) {
      throw new Error('Invalid project ID')
    }

    const projectIndex = projects.findIndex((p) => p.id === projectId)
    if (projectIndex === -1) {
      throw new Error('Project not found')
    }

    // Validate update data
    const { error, value } = Project.validateUpdate(updateData)
    if (error) {
      throw new Error(error.details[0].message)
    }

    // Check if name is being changed and if it conflicts with existing project
    if (value.name && value.name.trim() !== projects[projectIndex].name) {
      if (!Project.isNameUnique(value.name, projects, projectId)) {
        throw new Error('A project with this name already exists')
      }
    }

    // Update the project
    const updatedProject = new Project({
      ...projects[projectIndex],
      ...value,
    })

    projects[projectIndex] = updatedProject.toJSON()

    return updatedProject
  }

  // Update project status
  static async updateProjectStatus(id, statusData) {
    if (config.addDelay) {
      await this.addDelay(600)
    }

    const projectId = parseInt(id)
    if (isNaN(projectId)) {
      throw new Error('Invalid project ID')
    }

    // Validate status data
    const { error, value } = Project.validateStatusUpdate(statusData)
    if (error) {
      throw new Error(error.details[0].message)
    }

    const projectIndex = projects.findIndex((p) => p.id === projectId)
    if (projectIndex === -1) {
      throw new Error('Project not found')
    }

    projects[projectIndex].status = value.status

    return new Project(projects[projectIndex])
  }

  // Delete a project
  static async deleteProject(id) {
    if (config.addDelay) {
      await this.addDelay(800)
    }

    const projectId = parseInt(id)
    if (isNaN(projectId)) {
      throw new Error('Invalid project ID')
    }

    const projectIndex = projects.findIndex((p) => p.id === projectId)
    if (projectIndex === -1) {
      throw new Error('Project not found')
    }

    const deletedProject = projects.splice(projectIndex, 1)[0]

    return {
      message: 'Project deleted successfully',
      deletedProject: new Project(deletedProject),
    }
  }

  // Get available statuses
  static async getStatuses() {
    if (config.addDelay) {
      await this.addDelay(300)
    }

    return AVAILABLE_STATUSES
  }

  // Search projects helper function
  static searchProjects(projects, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return projects
    }

    const searchWords = searchTerm
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)

    return projects.filter((project) => {
      const projectText = [project.name, project.description, project.status]
        .join(' ')
        .toLowerCase()

      // Check if all search words are found in the project text
      return searchWords.every((word) => projectText.includes(word))
    })
  }

  // Helper function to add delay for testing loading states
  static addDelay(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
