<template>
  <section class="cont pb-2">
    <h2>Меню</h2>

    <ClientOnly>
      <TheMenu  :items="data.menu" />
    </ClientOnly>

  </section>
</template>

<script setup>

const {data, error} = await useAsyncData('menu', () => $fetch('/api/menu'));

useMeta({
  title: 'Меню'
})

</script>
