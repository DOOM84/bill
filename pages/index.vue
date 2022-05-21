<template>
  <main>
      <div v-if="pending || error" class="center mt-3 mb-3 loader-color">
        <i class=" fa-4x fas fa-circle-notch fa-spin"></i>
      </div>
    <div v-else>
      <TheAbout :about="data.about"/>
      <div>
        <TheInfo :info="data.info"/>
      </div>
        <div data-aos="fade-right">
          <TheGallery :gallery="data.gallery"/>
        </div>
      <ClientOnly>
        <div>
          <TheFeedback :feedback="data.feedback"/>
        </div>
      </ClientOnly>
    </div>
  </main>
</template>

<script setup>

const {data, pending, error} = await useLazyAsyncData('main', () => $fetch('/api/main'));


</script>

<style lang="scss" scoped>

</style>
