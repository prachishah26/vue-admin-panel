<script setup>
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import * as yup from 'yup'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  task: {
    type: Object,
    default: null,
  },
  statuses: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

// Priority options
const priorityOptions = [
  { title: 'Low', value: 'low' },
  { title: 'Medium', value: 'medium' },
  { title: 'High', value: 'high' },
]

// Validation schema
const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: yup.string().max(500, 'Description must be less than 500 characters').nullable(),
  status: yup.string().required('Status is required'),
  priority: yup.string().required('Priority is required').oneOf(['low', 'medium', 'high'], 'Invalid priority'),
  dueDate: yup.string().nullable(),
})

// Initialize form with VeeValidate
const { values, errors, defineField, handleSubmit, resetForm, setValues } = useForm({
  validationSchema,
  initialValues: {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: null,
  },
})

// Define form fields
const [title, titleProps] = defineField('title')
const [description, descriptionProps] = defineField('description')
const [status, statusProps] = defineField('status')
const [priority, priorityProps] = defineField('priority')
const [dueDate, dueDateProps] = defineField('dueDate')

// Watch for task changes (when editing)
watch(
  () => props.task,
  newTask => {
    if (newTask && props.isEditMode) {
      setValues({
        title: newTask.title,
        description: newTask.description || '',
        status: newTask.status,
        priority: newTask.priority,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : null,
      })
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

// Close dialog
const closeDialog = () => {
  emit('update:modelValue', false)
  resetForm()
}

// Submit form with validation
const onSubmit = handleSubmit(formValues => {
  emit('submit', { ...formValues })
  closeDialog()
})
</script>

<template>
  <VDialog
    :model-value="modelValue"
    max-width="600"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
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
        <form @submit.prevent="onSubmit">
          <VRow>
            <!-- Title -->
            <VCol cols="12">
              <VTextField
                v-model="title"
                v-bind="titleProps"
                label="Task Title"
                placeholder="Enter task title"
                :error-messages="errors.title"
                prepend-inner-icon="ri-file-text-line"
                variant="outlined"
                density="comfortable"
              />
            </VCol>

            <!-- Description -->
            <VCol cols="12">
              <VTextarea
                v-model="description"
                v-bind="descriptionProps"
                label="Description"
                placeholder="Enter task description (optional)"
                :error-messages="errors.description"
                rows="4"
                prepend-inner-icon="ri-file-list-3-line"
                variant="outlined"
                auto-grow
              />
            </VCol>

            <!-- Status -->
            <VCol cols="12">
              <VSelect
                v-model="status"
                v-bind="statusProps"
                :items="statuses"
                item-title="title"
                item-value="id"
                label="Status"
                :error-messages="errors.status"
                prepend-inner-icon="ri-stack-line"
                variant="outlined"
                density="comfortable"
              />
            </VCol>

            <!-- Priority -->
            <VCol cols="12">
              <VSelect
                v-model="priority"
                v-bind="priorityProps"
                :items="priorityOptions"
                item-title="title"
                item-value="value"
                label="Priority"
                :error-messages="errors.priority"
                prepend-inner-icon="ri-flag-line"
                variant="outlined"
                density="comfortable"
              >
                <template #item="{ props, item }">
                  <VListItem
                    v-bind="props"
                    :prepend-icon="`ri-flag-${
                      item.raw.value === 'high' ? 'fill' : item.raw.value === 'medium' ? 'line' : '2-line'
                    }`"
                  >
                    <VListItemTitle>{{ item.raw.title }}</VListItemTitle>
                  </VListItem>
                </template>
              </VSelect>
            </VCol>

            <!-- Due Date -->
            <VCol cols="12">
              <VTextField
                v-model="dueDate"
                v-bind="dueDateProps"
                label="Due Date"
                type="date"
                :error-messages="errors.dueDate"
                prepend-inner-icon="ri-calendar-line"
                variant="outlined"
                density="comfortable"
              />
            </VCol>
          </VRow>
        </form>
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
          @click="onSubmit"
        >
          {{ isEditMode ? 'Update Task' : 'Add Task' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
