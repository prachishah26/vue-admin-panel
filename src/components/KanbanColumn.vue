<script setup>
import TaskCard from '@/components/TaskCard.vue'
import { computed } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({
  status: {
    type: Object,
    required: true,
  },
  tasks: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['drag-change', 'edit-task', 'delete-task'])

const taskCount = computed(() => props.tasks.length)

const handleDragChange = evt => {
  emit('drag-change', evt, props.status.id)
}
</script>

<template>
  <VCol
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
            {{ taskCount }}
          </VChip>
        </div>
      </VCardTitle>

      <VDivider />

      <!-- Tasks List -->
      <VCardText class="kanban-tasks-container flex-1 overflow-y-auto">
        <div
          v-if="tasks.length === 0"
          class="text-center py-8 empty-state"
        >
          <VIcon
            size="48"
            icon="ri-inbox-line"
            class="mb-2 text-disabled"
          />
          <p class="text-body-2 text-disabled">No tasks</p>
          <p class="text-caption text-disabled">Drag tasks here</p>
        </div>

        <!-- Draggable Task Cards -->
        <draggable
          :model-value="tasks"
          group="tasks"
          item-key="id"
          class="draggable-list"
          :class="{ 'empty-droppable': tasks.length === 0 }"
          animation="200"
          ghost-class="ghost-card"
          drag-class="dragging-card"
          :sort="false"
          @change="handleDragChange"
        >
          <template #item="{ element: task }">
            <TaskCard
              :task="task"
              @edit="emit('edit-task', $event)"
              @delete="emit('delete-task', $event)"
            />
          </template>
        </draggable>
      </VCardText>
    </VCard>
  </VCol>
</template>

<style scoped>
.kanban-tasks-container {
  min-height: 500px;
  max-height: calc(100vh - 300px);
}

.draggable-list {
  min-height: 400px;
  position: relative;
}

.empty-droppable {
  min-height: 400px;
  border: 2px dashed rgba(var(--v-theme-primary), 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.empty-droppable:hover {
  border-color: rgba(var(--v-theme-primary), 0.4);
  background-color: rgba(var(--v-theme-primary), 0.02);
}

.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
}

/* Ghost card - shows where the item will be dropped */
.ghost-card {
  opacity: 0.4;
  background: rgba(var(--v-theme-primary), 0.1);
  border: 2px dashed rgb(var(--v-theme-primary));
}

/* Dragging card - the card being dragged */
.dragging-card {
  opacity: 0.8;
  transform: rotate(3deg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
  cursor: grabbing !important;
}

/* Hover effect on draggable areas */
.draggable-list:not(.empty-droppable) {
  transition: background-color 0.3s ease;
}
</style>
