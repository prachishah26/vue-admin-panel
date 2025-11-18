import { ref } from 'vue'

/**
 * Composable for managing task dialog state
 */
export function useTaskDialog() {
  const isDialogOpen = ref(false)
  const isEditMode = ref(false)
  const editingTask = ref(null)

  const openDialog = () => {
    isEditMode.value = false
    editingTask.value = null
    isDialogOpen.value = true
  }

  const openEditDialog = task => {
    isEditMode.value = true
    editingTask.value = task
    isDialogOpen.value = true
  }

  return {
    isDialogOpen,
    isEditMode,
    editingTask,
    openDialog,
    openEditDialog,
  }
}
