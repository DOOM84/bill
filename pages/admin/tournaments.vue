<template>
  <main  class="center pb-2 adminHome" >
    <h1 class="mt-2 left pb-1 mb-2 pl-2 pr-2 admin-title">Турниры</h1>
  </main>
</template>

<script setup>

definePageMeta({
  layout: 'admin'
})

useMeta({
  title: 'Панель управления - Турниры'
})

</script>

<style lang="scss" scoped>
.adminHome{
  margin: auto;
  z-index: 1;
}
</style>