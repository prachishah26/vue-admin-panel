<script setup>
import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const tasksStore = useTasksStore()
const { statuses, tasks } = storeToRefs(tasksStore)

// Dialog state
const isDialogOpen = ref(false)
const isEditMode = ref(false)
const editingTaskId = ref(null)
const formRef = ref(null)

// Form data
const formData = ref({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: null,
})

// Priority options
const priorityOptions = [
  { title: 'Low', value: 'low' },
  { title: 'Medium', value: 'medium' },
  { title: 'High', value: 'high' },
]

// Validation rules
const rules = {
  title: [
    v => !!v || 'Title is required',
    v => (v && v.trim().length >= 3) || 'Title must be at least 3 characters',
    v => (v && v.trim().length <= 100) || 'Title must be less than 100 characters',
  ],
  description: [
    v => !v || v.length <= 500 || 'Description must be less than 500 characters',
  ],
  status: [
    v => !!v || 'Status is required',
  ],
  priority: [
    v => !!v || 'Priority is required',
  ],
}

// Get task count for each status
const getTaskCount = (statusId) => {
  return tasks.value.filter(task => task.status === statusId).length
}

// Get tasks for a specific status
const getTasksByStatus = (statusId) => {
  return tasks.value.filter(task => task.status === statusId)
}

// Priority color mapping
const getPriorityColor = (priority) => {
  const colors = {
    low: 'success',
    medium: 'warning',
    high: 'error'
  }
  return colors[priority] || 'info'
}

// Get priority border class
const getPriorityBorderClass = (priority) => {
  return `priority-border-${priority}`
}

// Open dialog for adding new task
const openDialog = () => {
  isEditMode.value = false
  editingTaskId.value = null
  resetForm()
  isDialogOpen.value = true
}

// Open dialog for editing task
const openEditDialog = (task) => {
  isEditMode.value = true
  editingTaskId.value = task.id
  formData.value = {
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : null,
  }
  isDialogOpen.value = true
}

// Close dialog and reset form
const closeDialog = () => {
  isDialogOpen.value = false
  resetForm()
}

// Reset form
const resetForm = () => {
  isEditMode.value = false
  editingTaskId.value = null
  formData.value = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: null,
  }
  formRef.value?.resetValidation()
}

// Submit form
const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  
  if (!valid) {
    return
  }

  try {
    if (isEditMode.value && editingTaskId.value) {
      // Update existing task
      tasksStore.updateTask(editingTaskId.value, {
        title: formData.value.title,
        description: formData.value.description,
        status: formData.value.status,
        priority: formData.value.priority,
        dueDate: formData.value.dueDate,
      })
    } else {
      // Add new task
      tasksStore.addTask({
        title: formData.value.title,
        description: formData.value.description,
        status: formData.value.status,
        priority: formData.value.priority,
        dueDate: formData.value.dueDate,
      })
    }
    
    closeDialog()
  } catch (error) {
    console.error('Error saving task:', error)
  }
}

const deleteTask = (taskId) => {
  tasksStore.deleteTask(taskId)
}
</script>

<template>
  <div>
    <!-- Header -->
    <VCard class="mb-6">
      <VCardTitle class="d-flex align-center justify-space-between">
        <div>
          <h1 class="text-h5 mb-1">Tasks</h1>
          <p class="text-body-2 text-medium-emphasis">
            Manage your tasks with Kanban board
          </p>
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
        <!-- Loop through each status/column -->
        <VCol
          v-for="status in statuses"
          :key="status.id"
          cols="12"
          md="4"
        >
          <VCard
            class="d-flex flex-column"
            height="100%"
          >
            <!-- Column Header -->
            <VCardTitle class="d-flex align-center justify-space-between pb-2">
              <div class="d-flex align-center gap-2">
                <span class="text-h6">{{ status.title }}</span>
                <VChip
                  size="small"
                  color="primary"
                  variant="tonal"
                >
                  {{ getTaskCount(status.id) }}
                </VChip>
              </div>
            </VCardTitle>

            <VDivider />

            <!-- Tasks List -->
            <VCardText class="kanban-tasks-container flex-1 overflow-y-auto">
              <div
                v-if="getTasksByStatus(status.id).length === 0"
                class="text-center py-8"
              >
                <VIcon
                  size="48"
                  icon="ri-inbox-line"
                  class="mb-2 text-disabled"
                />
                <p class="text-body-2 text-disabled">
                  No tasks
                </p>
              </div>

              <!-- Task Cards -->
              <div
                v-for="task in getTasksByStatus(status.id)"
                :key="task.id"
                class="task-card mb-3"
              >
                <VCard
                  variant="outlined"
                  class="task-card-hover cursor-pointer"
                  :class="getPriorityBorderClass(task.priority)"
                >
                  <VCardText class="pa-4">
                    <!-- Task Header -->
                    <div class="d-flex align-start justify-space-between mb-2">
                      <h3 class="text-body-1 font-weight-medium">
                        {{ task.title }}
                      </h3>
                      <VChip
                        :color="getPriorityColor(task.priority)"
                        size="x-small"
                        variant="tonal"
                      >
                        {{ task.priority }}
                      </VChip>
                    </div>

                    <!-- Task Description -->
                    <p
                      v-if="task.description"
                      class="text-body-2 text-medium-emphasis mb-2"
                    >
                      {{ task.description }}
                    </p>

                    <!-- Task Meta -->
                    <div class="d-flex align-center justify-space-between mt-3">
                      <div class="d-flex align-center gap-2">
                        <VIcon
                          v-if="task.dueDate"
                          size="16"
                          icon="ri-calendar-line"
                          class="text-medium-emphasis"
                        />
                        <span
                          v-if="task.dueDate"
                          class="text-caption text-medium-emphasis"
                        >
                          {{ new Date(task.dueDate).toLocaleDateString() }}
                        </span>
                      </div>
                      <div class="d-flex gap-1">
                        <VBtn
                          icon
                          size="x-small"
                          variant="text"
                          color="primary"
                          @click="openEditDialog(task)"
                        >
                          <VIcon
                            size="18"
                            icon="ri-edit-line"
                          />
                        </VBtn>
                        <VBtn
                          icon
                          size="x-small"
                          variant="text"
                          color="error"
                          @click="deleteTask(task.id)"
                        >
                          <VIcon
                            size="18"
                            icon="ri-delete-bin-line"
                          />
                        </VBtn>
                      </div>
                    </div>
                  </VCardText>
                </VCard>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>

    <!-- Add Task Dialog -->
    <VDialog
      v-model="isDialogOpen"
      max-width="600"
      persistent
    >
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between pa-6 pb-4">
          <span class="text-h5">{{ isEditMode ? 'Edit Task' : 'Add New Task' }}</span>
          <VBtn
            icon
            variant="text"
            size="small"
            @click="closeDialog"
          >
            <VIcon icon="ri-close-line" />
          </VBtn>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VForm
            ref="formRef"
            @submit.prevent="submitForm"
          >
            <VRow>
              <!-- Title -->
              <VCol cols="12">
                <VTextField
                  v-model="formData.title"
                  label="Task Title"
                  placeholder="Enter task title"
                  :rules="rules.title"
                  required
                  prepend-inner-icon="ri-file-text-line"
                  variant="outlined"
                  density="comfortable"
                />
              </VCol>

              <!-- Description -->
              <VCol cols="12">
                <VTextarea
                  v-model="formData.description"
                  label="Description"
                  placeholder="Enter task description (optional)"
                  :rules="rules.description"
                  rows="4"
                  prepend-inner-icon="ri-file-list-3-line"
                  variant="outlined"
                  auto-grow
                />
              </VCol>

              <!-- Status -->
              <VCol cols="12">
                <VSelect
                  v-model="formData.status"
                  :items="statuses"
                  item-title="title"
                  item-value="id"
                  label="Status"
                  :rules="rules.status"
                  required
                  prepend-inner-icon="ri-stack-line"
                  variant="outlined"
                  density="comfortable"
                />
              </VCol>

              <!-- Priority -->
              <VCol cols="12">
                <VSelect
                  v-model="formData.priority"
                  :items="priorityOptions"
                  item-title="title"
                  item-value="value"
                  label="Priority"
                  :rules="rules.priority"
                  required
                  prepend-inner-icon="ri-flag-line"
                  variant="outlined"
                  density="comfortable"
                >
                  <template #item="{ props, item }">
                    <VListItem
                      v-bind="props"
                      :prepend-icon="`ri-flag-${item.raw.value === 'high' ? 'fill' : item.raw.value === 'medium' ? 'line' : '2-line'}`"
                    >
                      <VListItemTitle>{{ item.raw.title }}</VListItemTitle>
                    </VListItem>
                  </template>
                </VSelect>
              </VCol>

              <!-- Due Date -->
              <VCol cols="12">
                <VTextField
                  v-model="formData.dueDate"
                  label="Due Date"
                  type="date"
                  prepend-inner-icon="ri-calendar-line"
                  variant="outlined"
                  density="comfortable"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-6">
          <VSpacer />
          <VBtn
            variant="text"
            @click="closeDialog"
          >
            Cancel
          </VBtn>
          <VBtn
            color="primary"
            @click="submitForm"
          >
            {{ isEditMode ? 'Update Task' : 'Add Task' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.kanban-board {
  min-height: 600px;
}

.kanban-tasks-container {
  min-height: 500px;
  max-height: calc(100vh - 300px);
}

.task-card-hover {
  transition: all 0.2s ease;
}

.task-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.priority-border-low {
  border-left: 3px solid rgb(var(--v-theme-success));
}

.priority-border-medium {
  border-left: 3px solid rgb(var(--v-theme-warning));
}

.priority-border-high {
  border-left: 3px solid rgb(var(--v-theme-error));
}
</style>
