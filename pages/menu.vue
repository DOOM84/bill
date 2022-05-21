<template>
  <section class="cont pb-2">
    <h2>Меню</h2>

    <div v-if="pending || error" class="center mt-3 mb-3 loader-color">
      <i class=" fa-4x fas fa-circle-notch fa-spin"></i>
    </div>

    <TheMenu v-else :items="data.menu"/>


  </section>
</template>

<script setup>

const {data, error, pending} = await useLazyAsyncData('menu', () => $fetch('/api/menu'));

useMeta({
  title: 'Меню'
})

</script>
