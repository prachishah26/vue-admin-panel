import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTasksStore = defineStore(
  'tasks',
  () => {
    const tasks = ref([])
    const statuses = ref([
      {
        id: 'todo',
        title: 'Todo',
      },
      {
        id: 'inProgress',
        title: 'In Progress',
      },
      {
        id: 'done',
        title: 'Done',
      },
    ])

    const addTask = taskData => {
      if (!taskData.title || !taskData.status) {
        throw new Error('Title and status are required')
      }

      const statusExists = statuses.value.find(status => status.id === taskData.status)
      if (!statusExists) {
        throw new Error(`Invalid status: ${taskData.status}`)
      }

      const newTask = {
        id: crypto.randomUUID(),
        title: String(taskData.title).trim(),
        description: taskData.description ? String(taskData.description).trim() : '',
        status: taskData.status,
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
        createdAt: new Date().toISOString(),
      }
      tasks.value.push(newTask)
      return newTask
    }

    // Helper function to get tasks by status
    const getTasksByStatus = statusId => {
      return tasks.value.filter(task => task.status === statusId)
    }

    const deleteTask = taskId => {
      tasks.value = tasks.value.filter(task => task.id !== taskId)
    }

    const updateTask = (taskId, taskData) => {
      if (!taskData.title || !taskData.status) {
        throw new Error('Title and status are required')
      }

      const statusExists = statuses.value.find(status => status.id === taskData.status)
      if (!statusExists) {
        throw new Error(`Invalid status: ${taskData.status}`)
      }

      const taskIndex = tasks.value.findIndex(task => task.id === taskId)
      if (taskIndex === -1) {
        throw new Error('Task not found')
      }

      tasks.value[taskIndex] = {
        ...tasks.value[taskIndex],
        title: String(taskData.title).trim(),
        description: taskData.description ? String(taskData.description).trim() : '',
        status: taskData.status,
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
        updatedAt: new Date().toISOString(),
      }

      return tasks.value[taskIndex]
    }

    return {
      statuses,
      tasks,
      addTask,
      getTasksByStatus,
      deleteTask,
      updateTask,
    }
  },
  {
    persist: {
      key: 'tasks-store',
      storage: localStorage,
      paths: ['tasks'], // Only persist tasks, not statuses (they're static config)
    },
  },
)
