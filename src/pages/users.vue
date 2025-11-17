<script setup>
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const search = ref('')

const headers = [
  { title: 'Name', key: 'fullName', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Created Date', key: 'createdAt', sortable: true },
]

const usersList = computed(() => {
  return auth.users.map(user => ({
    id: user.id,
    fullName: `${user.firstName} ${user.lastName}`,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
    rawCreatedAt: user.createdAt,
  }))
})

const filteredUsers = computed(() => {
  if (!search.value) return usersList.value

  const searchLower = search.value.toLowerCase()
  return usersList.value.filter(user =>
    user.fullName.toLowerCase().includes(searchLower) ||
    user.email.toLowerCase().includes(searchLower) ||
    user.firstName.toLowerCase().includes(searchLower) ||
    user.lastName.toLowerCase().includes(searchLower),
  )
})
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex align-center justify-space-between">
      <span class="text-h5">Users</span>
      <VTextField
        v-model="search"
        placeholder="Search users..."
        prepend-inner-icon="ri-search-line"
        style="max-width: 300px;"
        density="compact"
        variant="outlined"
        hide-details
        clearable
      />
    </VCardTitle>

    <VCardText>
      <VDataTable
        :headers="headers"
        :items="filteredUsers"
        class="text-no-wrap"
        :items-per-page="10"
      >
        <template #item.fullName="{ item }">
          <div class="d-flex align-center gap-3">
            <VAvatar
              color="primary"
              size="32"
              variant="tonal"
            >
              <span class="text-sm font-weight-medium">
                {{ item.firstName.charAt(0) }}{{ item.lastName.charAt(0) }}
              </span>
            </VAvatar>
            <span class="font-weight-medium">{{ item.fullName }}</span>
          </div>
        </template>

        <template #item.email="{ item }">
          <span>{{ item.email }}</span>
        </template>

        <template #item.createdAt="{ item }">
          <span>{{ item.createdAt }}</span>
        </template>

        <template #no-data>
          <div class="text-center py-8">
            <VIcon
              size="64"
              icon="ri-user-search-line"
              class="mb-4"
            />
            <p class="text-body-1">
              {{ search ? 'No users found matching your search' : 'No users registered yet' }}
            </p>
          </div>
        </template>
      </VDataTable>
    </VCardText>
  </VCard>
</template>


