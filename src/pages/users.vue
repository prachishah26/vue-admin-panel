<script setup>
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Status', key: 'status' },
]

const users = [
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { name: 'Carol Lee', email: 'carol@example.com', role: 'Viewer', status: 'Invited' },
  { name: 'David Kim', email: 'david@example.com', role: 'Editor', status: 'Suspended' },
]
</script>

<template>
  <VCard>
    <VCardTitle class="text-h5">
      Users
    </VCardTitle>
    <VDataTable
      :headers="headers"
      :items="users"
      class="text-no-wrap"
    />
  </VCard>
</template>


