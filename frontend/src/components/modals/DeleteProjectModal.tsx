import { CancelButton, DeleteButton } from '../buttons'
import { Modal } from '../shared'

type DeleteProjectModalProps = {
  isOpen: boolean
  onClose: () => void
  name: string
  onDelete: () => void
  loading?: boolean
}

const DeleteProjectModal = ({
  isOpen,
  onClose,
  name,
  onDelete,
  loading = false,
}: DeleteProjectModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Delete Project">
    <div className="flex flex-col gap-4">
      <p>
        Are you sure you want to delete <span className="font-semibold">{name}</span>?
      </p>
      <div className="flex flex-col justify-end gap-2 sm:flex-row">
        <div className="flex justify-end">
          <CancelButton onClick={onClose} disabled={loading} />
        </div>
        <div className="flex justify-end">
          <DeleteButton
            onClick={onDelete}
            loading={loading}
            data-testid="delete-project-modal-button"
          />
        </div>
      </div>
    </div>
  </Modal>
)

export default DeleteProjectModal
