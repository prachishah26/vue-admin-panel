<script setup>
import TasksOverviewCard from '@/views/dashboard/TasksOverviewCard.vue'
import TotalUsersCard from '@/views/dashboard/TotalUsersCard.vue'
</script>

<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="6"
    >
      <TotalUsersCard />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <TasksOverviewCard />
    </VCol>
  </VRow>
</template>
