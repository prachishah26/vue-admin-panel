<script setup>
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()

const totalUsers = computed(() => authStore.users.length)
</script>

<template>
  <VCard class="h-100">
    <VCardText class="pa-6">
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <h6 class="text-h6 mb-1 text-high-emphasis">Total Users</h6>
          <p class="text-body-2 text-medium-emphasis mb-0">Registered Users</p>
        </div>
        <VAvatar
          color="primary"
          rounded
          size="56"
          class="elevation-3"
        >
          <VIcon
            size="28"
            icon="ri-group-line"
          />
        </VAvatar>
      </div>

      <div class="mt-6">
        <h2 class="text-h2 font-weight-bold mb-1">
          {{ totalUsers }}
        </h2>
        <p class="text-body-2 text-medium-emphasis mb-0">Active registered users</p>
      </div>
    </VCardText>
  </VCard>
</template>
