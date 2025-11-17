<script setup>
import { useAuthStore } from '@/stores/auth'
import { validatePassword } from '@/utils/passwordValidation'
import { Field, Form as VeeForm } from 'vee-validate'
import * as yup from 'yup'

const auth = useAuthStore()

const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const passwordRequirements = [
  'Minimum 6 characters long - the more, the better',
  'At least one lowercase character',
  'At least one number or symbol',
]

const schema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .test('password-requirements', function (value) {
      if (!value) return this.createError({ message: 'New password is required' })
      const validation = validatePassword(value)
      if (!validation.isValid) {
        return this.createError({ message: validation.error })
      }
      return true
    }),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
})

const form = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

function resetForm() {
  form.currentPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
  successMessage.value = ''
  errorMessage.value = ''
}

async function saveChanges(values) {
  errorMessage.value = ''
  successMessage.value = ''
  submitting.value = true

  try {
    await auth.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    })
    successMessage.value = 'Password changed successfully!'
    resetForm()
  }
  catch (e) {
    errorMessage.value = e?.message || 'Failed to change password'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard title="Change Password">
        <VeeForm
          :initial-values="form"
          :validation-schema="schema"
          @submit="saveChanges"
        >
          <VCardText>
            <!-- 👉 Success/Error Messages -->
            <VAlert
              v-if="successMessage"
              type="success"
              class="mb-4"
              density="comfortable"
              variant="tonal"
              closable
              @click:close="successMessage = ''"
            >
              {{ successMessage }}
            </VAlert>

            <VAlert
              v-if="errorMessage"
              type="error"
              class="mb-4"
              density="comfortable"
              variant="tonal"
              closable
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </VAlert>
          </VCardText>

          <VCardText>
            <!-- 👉 Current Password -->
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <Field
                  name="currentPassword"
                  v-slot="{ field, errors }"
                >
                  <VTextField
                    :type="isCurrentPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isCurrentPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                    autocomplete="on"
                    label="Current Password"
                    placeholder="············"
                    :model-value="field.value"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                    :error-messages="errors"
                    @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                  />
                </Field>
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <Field
                  name="newPassword"
                  v-slot="{ field, errors }"
                >
                  <VTextField
                    :type="isNewPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isNewPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                    label="New Password"
                    autocomplete="on"
                    placeholder="············"
                    :model-value="field.value"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                    :error-messages="errors"
                    @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                  />
                </Field>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <Field
                  name="confirmPassword"
                  v-slot="{ field, errors }"
                >
                  <VTextField
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isConfirmPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                    autocomplete="on"
                    label="Confirm New Password"
                    placeholder="············"
                    :model-value="field.value"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                    :error-messages="errors"
                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  />
                </Field>
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              Password Requirements:
            </p>

            <ul class="d-flex flex-column gap-y-3">
              <li
                v-for="item in passwordRequirements"
                :key="item"
                class="d-flex"
              >
                <div>
                  <VIcon
                    size="7"
                    icon="ri-checkbox-blank-circle-fill"
                    class="me-3"
                  />
                </div>
                <span class="font-weight-medium">{{ item }}</span>
              </li>
            </ul>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn
              type="submit"
              :loading="submitting"
            >
              Save changes
            </VBtn>

            <VBtn
              type="reset"
              color="secondary"
              variant="outlined"
              @click.prevent="resetForm"
            >
              Reset
            </VBtn>
          </VCardText>
        </VeeForm>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>
