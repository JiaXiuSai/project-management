import { ProjectService } from '../services/ProjectService.js'

export class ProjectController {
  // Get all projects with filtering, search, and pagination
  static async getProjects(req, res, next) {
    try {
      const { search = '', page = 1, limit = 10, includeDates = 'false', status = '' } = req.query

      // Validate pagination parameters
      const pageNum = parseInt(page)
      const limitNum = parseInt(limit)
      const shouldIncludeDates = includeDates === 'true'

      if (pageNum < 1 || limitNum < 1) {
        return res.status(400).json({
          error: 'Invalid parameters',
          message: 'Page and limit must be positive numbers',
        })
      }

      const result = await ProjectService.getProjects({
        search,
        page: pageNum,
        limit: limitNum,
        includeDates: shouldIncludeDates,
        status,
      })

      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  // Get a specific project by ID
  static async getProjectById(req, res, next) {
    try {
      const { id } = req.params
      const project = await ProjectService.getProjectById(id)
      res.json(project.toJSON())
    } catch (error) {
      if (error.message === 'Invalid project ID') {
        return res.status(400).json({ error: error.message })
      }
      if (error.message === 'Project not found') {
        return res.status(404).json({ error: error.message })
      }
      next(error)
    }
  }

  // Create a new project
  static async createProject(req, res, next) {
    try {
      const project = await ProjectService.createProject(req.body)
      res.status(201).json(project.toJSON())
    } catch (error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({ error: error.message })
      }
      if (error.message.includes('required') || error.message.includes('Invalid')) {
        return res.status(400).json({ error: error.message })
      }
      next(error)
    }
  }

  // Update a project
  static async updateProject(req, res, next) {
    try {
      const { id } = req.params
      const project = await ProjectService.updateProject(id, req.body)
      res.json(project.toJSON())
    } catch (error) {
      if (error.message === 'Invalid project ID') {
        return res.status(400).json({ error: error.message })
      }
      if (error.message === 'Project not found') {
        return res.status(404).json({ error: error.message })
      }
      if (error.message.includes('already exists')) {
        return res.status(409).json({ error: error.message })
      }
      if (error.message.includes('required') || error.message.includes('Invalid')) {
        return res.status(400).json({ error: error.message })
      }
      next(error)
    }
  }

  // Update project status
  static async updateProjectStatus(req, res, next) {
    try {
      const { id } = req.params
      const project = await ProjectService.updateProjectStatus(id, req.body)
      res.json(project.toJSON())
    } catch (error) {
      if (error.message === 'Invalid project ID') {
        return res.status(400).json({ error: error.message })
      }
      if (error.message === 'Project not found') {
        return res.status(404).json({ error: error.message })
      }
      if (error.message.includes('required') || error.message.includes('Invalid')) {
        return res.status(400).json({ error: error.message })
      }
      next(error)
    }
  }

  // Delete a project
  static async deleteProject(req, res, next) {
    try {
      const { id } = req.params
      const result = await ProjectService.deleteProject(id)
      res.json(result)
    } catch (error) {
      if (error.message === 'Invalid project ID') {
        return res.status(400).json({ error: error.message })
      }
      if (error.message === 'Project not found') {
        return res.status(404).json({ error: error.message })
      }
      next(error)
    }
  }

  // Get available statuses
  static async getStatuses(req, res, next) {
    try {
      const statuses = await ProjectService.getStatuses()
      res.json(statuses)
    } catch (error) {
      next(error)
    }
  }
}
