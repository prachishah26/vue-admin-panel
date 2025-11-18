/**
 * Composable for task priority utilities
 */
export function useTaskPriority() {
  const PRIORITY_COLORS = {
    low: 'success',
    medium: 'warning',
    high: 'error',
  }

  const getPriorityColor = priority => {
    return PRIORITY_COLORS[priority] || 'info'
  }

  const getPriorityBorderClass = priority => {
    return `priority-border-${priority}`
  }

  return {
    getPriorityColor,
    getPriorityBorderClass,
  }
}
