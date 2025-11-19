<script setup>
import { useTasksStore } from '@/stores/tasks'
import { computed } from 'vue'

const tasksStore = useTasksStore()

const todoTasks = computed(() => tasksStore.getTasksByStatus('todo').length)
const inProgressTasks = computed(() => tasksStore.getTasksByStatus('inProgress').length)
const doneTasks = computed(() => tasksStore.getTasksByStatus('done').length)

const statistics = computed(() => [
  {
    title: 'Todo',
    stats: todoTasks.value.toString(),
    icon: 'ri-file-list-line',
    color: 'warning',
  },
  {
    title: 'In Progress',
    stats: inProgressTasks.value.toString(),
    icon: 'ri-loader-4-line',
    color: 'info',
  },
  {
    title: 'Done',
    stats: doneTasks.value.toString(),
    icon: 'ri-checkbox-circle-line',
    color: 'success',
  },
])
</script>

<template>
  <VCard class="h-100">
    <VCardText class="pa-6">
      <div class="mb-6">
        <h6 class="text-h6 mb-1 text-high-emphasis">Tasks Overview</h6>
        <p class="text-body-2 text-medium-emphasis mb-0">Task Status Breakdown</p>
      </div>

      <VRow class="ma-n2">
        <VCol
          v-for="item in statistics"
          :key="item.title"
          cols="12"
          sm="6"
          md="4"
          class="pa-2"
        >
          <div class="d-flex align-center gap-x-4 pa-4 rounded bg-surface">
            <VAvatar
              :color="item.color"
              rounded
              size="48"
              class="elevation-2 flex-shrink-0"
            >
              <VIcon
                size="26"
                :icon="item.icon"
              />
            </VAvatar>

            <div class="d-flex flex-column flex-grow-1">
              <div class="text-body-2 text-medium-emphasis mb-1">
                {{ item.title }}
              </div>
              <h4 class="text-h4 font-weight-semibold mb-0">
                {{ item.stats }}
              </h4>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
