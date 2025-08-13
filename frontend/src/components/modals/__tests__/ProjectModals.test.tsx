import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Project } from '../../../services/api'
import { fireEvent, render, screen } from '../../../test/utils'
import ProjectModals from '../ProjectModals'

describe('ProjectModals', () => {
  const mockProject: Project = {
    id: 1,
    name: 'Test Project',
    description: 'Test Description',
    status: 'active',
  }

  const defaultProps = {
    createModalOpen: false,
    onCreateClose: vi.fn(),
    onCreateSubmit: vi.fn(),
    creatingProject: false,
    editModalOpen: false,
    editProject: null,
    onEditClose: vi.fn(),
    onEditSubmit: vi.fn(),
    onEditDelete: vi.fn(),
    updatingProject: false,
    deleteModalOpen: false,
    deleteProjectName: '',
    onDeleteClose: vi.fn(),
    onDeleteConfirm: vi.fn(),
    deletingProject: false,
    statuses: ['active', 'completed', 'paused'],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when all modals are closed', () => {
    render(<ProjectModals {...defaultProps} />)

    expect(screen.queryByText('Create Project')).not.toBeInTheDocument()
    expect(screen.queryByText('Edit Project')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete Project')).not.toBeInTheDocument()
  })

  it('renders create modal when createModalOpen is true', () => {
    render(<ProjectModals {...defaultProps} createModalOpen={true} />)

    expect(screen.getByText('Create Project')).toBeInTheDocument()
    expect(screen.getByText('Project Name')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('renders edit modal when editModalOpen is true', () => {
    render(<ProjectModals {...defaultProps} editModalOpen={true} editProject={mockProject} />)

    expect(screen.getByText('Edit Project')).toBeInTheDocument()
    expect(screen.getByText('Project Name')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('renders delete modal when deleteModalOpen is true', () => {
    render(
      <ProjectModals {...defaultProps} deleteModalOpen={true} deleteProjectName="Test Project" />
    )

    expect(screen.getByText('Delete Project')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument()
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('shows loading state for create modal', () => {
    render(<ProjectModals {...defaultProps} createModalOpen={true} creatingProject={true} />)

    const submitButton = screen.getByRole('button', { name: /creating/i })
    expect(submitButton).toBeDisabled()
  })

  it('shows loading state for edit modal', () => {
    render(
      <ProjectModals
        {...defaultProps}
        editModalOpen={true}
        editProject={mockProject}
        updatingProject={true}
      />
    )

    const submitButton = screen.getByRole('button', { name: /saving/i })
    expect(submitButton).toBeDisabled()
  })

  it('shows loading state for delete modal', () => {
    render(
      <ProjectModals
        {...defaultProps}
        deleteModalOpen={true}
        deleteProjectName="Test Project"
        deletingProject={true}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /deleting/i })
    expect(deleteButton).toBeDisabled()
  })

  it('calls onCreateClose when create modal close button is clicked', () => {
    render(<ProjectModals {...defaultProps} createModalOpen={true} />)

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    expect(defaultProps.onCreateClose).toHaveBeenCalledTimes(1)
  })

  it('calls onEditClose when edit modal close button is clicked', () => {
    render(<ProjectModals {...defaultProps} editModalOpen={true} editProject={mockProject} />)

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    expect(defaultProps.onEditClose).toHaveBeenCalledTimes(1)
  })

  it('calls onDeleteClose when delete modal close button is clicked', () => {
    render(
      <ProjectModals {...defaultProps} deleteModalOpen={true} deleteProjectName="Test Project" />
    )

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    expect(defaultProps.onDeleteClose).toHaveBeenCalledTimes(1)
  })

  it('calls onEditDelete when edit modal delete button is clicked', () => {
    render(<ProjectModals {...defaultProps} editModalOpen={true} editProject={mockProject} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    expect(defaultProps.onEditDelete).toHaveBeenCalledTimes(1)
  })

  it('calls onDeleteConfirm when delete modal confirm button is clicked', () => {
    render(
      <ProjectModals {...defaultProps} deleteModalOpen={true} deleteProjectName="Test Project" />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    expect(defaultProps.onDeleteConfirm).toHaveBeenCalledTimes(1)
  })

  it('can render multiple modals simultaneously', () => {
    render(
      <ProjectModals
        {...defaultProps}
        createModalOpen={true}
        editModalOpen={true}
        deleteModalOpen={true}
        editProject={mockProject}
        deleteProjectName="Test Project"
      />
    )

    expect(screen.getByText('Create Project')).toBeInTheDocument()
    expect(screen.getByText('Edit Project')).toBeInTheDocument()
    expect(screen.getByText('Delete Project')).toBeInTheDocument()
  })

  it('shows correct status options in create modal', () => {
    render(<ProjectModals {...defaultProps} createModalOpen={true} />)

    const statusSelect = screen.getByRole('combobox', { name: /status/i })
    expect(statusSelect).toBeInTheDocument()

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveValue('active')
    expect(options[1]).toHaveValue('completed')
    expect(options[2]).toHaveValue('paused')
  })

  it('shows correct status options in edit modal', () => {
    render(<ProjectModals {...defaultProps} editModalOpen={true} editProject={mockProject} />)

    const statusSelect = screen.getByRole('combobox', { name: /status/i })
    expect(statusSelect).toBeInTheDocument()

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveValue('active')
    expect(options[1]).toHaveValue('completed')
    expect(options[2]).toHaveValue('paused')
  })

  it('has proper form fields in create modal', () => {
    render(<ProjectModals {...defaultProps} createModalOpen={true} />)

    expect(screen.getByRole('textbox', { name: /project name/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /status/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })

  it('has proper form fields in edit modal', () => {
    render(<ProjectModals {...defaultProps} editModalOpen={true} editProject={mockProject} />)

    expect(screen.getByRole('textbox', { name: /project name/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /status/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('shows cancel button in delete modal', () => {
    render(
      <ProjectModals {...defaultProps} deleteModalOpen={true} deleteProjectName="Test Project" />
    )

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })
})
