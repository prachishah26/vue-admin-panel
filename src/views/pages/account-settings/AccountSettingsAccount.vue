<script setup>
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const userData = computed(() => auth.getCurrentUserFullData())

const accountDataLocal = ref({
  firstName: userData.value?.firstName || '',
  lastName: userData.value?.lastName || '',
  email: userData.value?.email || '',
})

// Watch for user data changes
watch(userData, (newData) => {
  if (newData) {
    accountDataLocal.value = {
      firstName: newData.firstName,
      lastName: newData.lastName,
      email: newData.email,
    }
  }
}, { immediate: true })

const resetForm = () => {
  if (userData.value) {
    accountDataLocal.value = {
      firstName: userData.value.firstName,
      lastName: userData.value.lastName,
      email: userData.value.email,
    }
  }
  successMessage.value = ''
  errorMessage.value = ''
}

async function saveChanges() {
  errorMessage.value = ''
  successMessage.value = ''
  submitting.value = true

  try {
    await auth.updateProfile({
      firstName: accountDataLocal.value.firstName,
      lastName: accountDataLocal.value.lastName,
      email: accountDataLocal.value.email,
    })
    successMessage.value = 'Profile updated successfully!'
  }
  catch (e) {
    errorMessage.value = e?.message || 'Failed to update profile'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Account Details">
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

          <!-- 👉 Form -->
          <VForm
            class="mt-6"
            @submit.prevent="saveChanges"
          >
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.firstName"
                  placeholder="John"
                  label="First Name"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.lastName"
                  placeholder="Doe"
                  label="Last Name"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.email"
                  label="E-mail"
                  placeholder="johndoe@gmail.com"
                  type="email"
                />
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn
                  type="submit"
                  :loading="submitting"
                >
                  Save changes
                </VBtn>

                <VBtn
                  color="secondary"
                  variant="outlined"
                  type="reset"
                  @click.prevent="resetForm"
                >
                  Reset
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

  </VRow>
</template>
