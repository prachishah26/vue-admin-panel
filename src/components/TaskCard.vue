<script setup>
import { useTaskPriority } from '@/composables/useTaskPriority'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['edit', 'delete'])

const { getPriorityColor, getPriorityBorderClass } = useTaskPriority()

const formatDate = date => {
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <div class="task-card mb-3">
    <VCard
      variant="outlined"
      class="task-card-hover cursor-move"
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
              {{ formatDate(task.dueDate) }}
            </span>
          </div>
          <div class="d-flex gap-1">
            <VBtn
              icon
              size="x-small"
              variant="text"
              color="primary"
              @click.stop="emit('edit', task)"
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
              @click.stop="emit('delete', task)"
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
</template>

<style scoped>
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

.task-card {
  transition: all 0.3s ease;
}

.cursor-move {
  cursor: move;
  cursor: grab;
}

.cursor-move:active {
  cursor: grabbing;
}
</style>
