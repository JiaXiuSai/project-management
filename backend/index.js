import express from "express";
import cors from "cors";
import { projects, statuses } from "./mockData.js";
import { nextId, incrementId } from "./mockData.js";

const app = express();
app.use(cors());
app.use(express.json());

// Helper function to add delay for testing loading states
const addDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

// Validation middleware
const validateProject = (req, res, next) => {
  const { name, status, startDate, endDate } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: "Project name is required" });
  }
  
  if (name.trim().length > 100) {
    return res.status(400).json({ error: "Project name must be less than 100 characters" });
  }
  
  if (!status || !statuses.includes(status)) {
    return res.status(400).json({ error: "Valid status is required" });
  }
  
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ error: "Start date cannot be after end date" });
  }
  
  next();
};

// Search helper function
const searchProjects = (projects, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return projects;
  }

  const searchWords = searchTerm.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
  
  return projects.filter(project => {
    const projectText = [
      project.name,
      project.description,
      project.status
    ].join(' ').toLowerCase();
    
    // Check if all search words are found in the project text
    return searchWords.every(word => projectText.includes(word));
  });
};

// GET /api/projects - Get all projects with search and pagination
app.get("/api/projects", async (req, res) => {
  try {
    await addDelay();
    
    const { search = "", page = 1, limit = 10, includeDates = "false", status = "" } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const shouldIncludeDates = includeDates === "true";
    
    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ error: "Page and limit must be positive numbers" });
    }
    
    let filteredProjects = searchProjects(projects, search);
    
    if (status && status.trim() !== "") {
      filteredProjects = filteredProjects.filter(project => project.status === status);
    }
    
    const totalProjects = filteredProjects.length;
    const totalPages = Math.ceil(totalProjects / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
    
    const projectsToReturn = shouldIncludeDates 
      ? paginatedProjects 
              : paginatedProjects.map(project => ({
            id: project.id,
            name: project.name,
            status: project.status,
            description: project.description.substring(0, 100) + (project.description.length > 100 ? "..." : "")
          }));
    
    res.json({
      projects: projectsToReturn,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProjects,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id - Get a specific project
app.get("/api/projects/:id", async (req, res, next) => {
  try {
    await addDelay();
    
    const { id } = req.params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    res.json(project);
  } catch (error) {
    next(error);
  }
});

// GET /api/statuses - Get available statuses
app.get("/api/statuses", async (req, res) => {
  await addDelay();
  res.json(statuses);
});

// POST /api/projects - Create a new project
app.post("/api/projects", validateProject, async (req, res, next) => {
  try {
    await addDelay();
    
    const { name, description, status } = req.body;
    
    // Check if project with same name already exists
    const existingProject = projects.find(p => 
      p.name.toLowerCase() === name.trim().toLowerCase()
    );
    
    if (existingProject) {
      return res.status(409).json({ error: "A project with this name already exists" });
    }
    const newProject = {
      id: nextId,
      name: name.trim(),
      description: description?.trim() || "",
      status: status || "Backlog",
    };
    incrementId();
    projects.unshift(newProject);
    res.status(201).json(newProject);
  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:id - Update a project
app.put("/api/projects/:id", validateProject, async (req, res, next) => {
  try {
    await addDelay();
    
    const { id } = req.params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    const { name, description, status } = req.body;
    
    // Check if name is being changed and if it conflicts with existing project
    if (name && name.trim() !== projects[projectIndex].name) {
      const existingProject = projects.find(p => 
        p.id !== projectId && p.name.toLowerCase() === name.trim().toLowerCase()
      );
      
      if (existingProject) {
        return res.status(409).json({ error: "A project with this name already exists" });
      }
    }
    
    // Update the project
    projects[projectIndex] = {
      ...projects[projectIndex],
      name: name?.trim() || projects[projectIndex].name,
      description: description?.trim() || projects[projectIndex].description,
      status: status || projects[projectIndex].status,
    };
    
    res.json(projects[projectIndex]);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/projects/:id/status - Update only the status
app.patch("/api/projects/:id/status", async (req, res, next) => {
  try {
    await addDelay();
    
    const { id } = req.params;
    const { status } = req.body;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    
    if (!status || !statuses.includes(status)) {
      return res.status(400).json({ error: "Valid status is required" });
    }
    
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    projects[projectIndex].status = status;
    
    res.json(projects[projectIndex]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id - Delete a project
app.delete("/api/projects/:id", async (req, res, next) => {
  try {
    await addDelay();
    
    const { id } = req.params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    const deletedProject = projects.splice(projectIndex, 1)[0];
    
    res.json({ 
      message: "Project deleted successfully",
      deletedProject 
    });
  } catch (error) {
    next(error);
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
