<script setup>
import KanbanColumn from '@/components/KanbanColumn.vue'
import TaskFormDialog from '@/components/TaskFormDialog.vue'
import { useTaskDialog } from '@/composables/useTaskDialog'
import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'

const tasksStore = useTasksStore()
const { statuses, tasks } = storeToRefs(tasksStore)
const { isDialogOpen, isEditMode, editingTask, openDialog, openEditDialog } = useTaskDialog()

// Get tasks grouped by status
const getTasksByStatus = statusId => {
  return tasks.value.filter(task => task.status === statusId)
}

// Handle form submission
const handleSubmit = formData => {
  try {
    if (isEditMode.value && editingTask.value) {
      tasksStore.updateTask(editingTask.value.id, formData)
    } else {
      tasksStore.addTask(formData)
    }
  } catch (error) {
    console.error('Error saving task:', error)
  }
}

// Delete task with confirmation
const deleteTask = task => {
  if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
    tasksStore.deleteTask(task.id)
  }
}

// Drag and Drop handler
const handleDragChange = (evt, newStatusId) => {
  if (evt.added) {
    const taskId = evt.added.element.id
    const task = tasks.value.find(t => t.id === taskId)

    if (task && task.status !== newStatusId) {
      tasksStore.updateTaskStatus(taskId, newStatusId)
    }
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <VCard class="mb-6">
      <VCardTitle class="d-flex align-center justify-space-between">
        <div>
          <h1 class="text-h5 mb-1">Tasks</h1>
          <p class="text-body-2 text-medium-emphasis">Manage your tasks with Kanban board</p>
        </div>
        <VBtn
          color="primary"
          prepend-icon="ri-add-line"
          @click="openDialog"
        >
          Add Task
        </VBtn>
      </VCardTitle>
    </VCard>

    <!-- Kanban Board -->
    <div class="kanban-board">
      <VRow>
        <KanbanColumn
          v-for="status in statuses"
          :key="status.id"
          :status="status"
          :tasks="getTasksByStatus(status.id)"
          @drag-change="handleDragChange"
          @edit-task="openEditDialog"
          @delete-task="deleteTask"
        />
      </VRow>
    </div>

    <!-- Task Form Dialog -->
    <TaskFormDialog
      v-model="isDialogOpen"
      :is-edit-mode="isEditMode"
      :task="editingTask"
      :statuses="statuses"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.kanban-board {
  min-height: 600px;
}
</style>
