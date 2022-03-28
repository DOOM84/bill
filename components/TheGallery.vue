<template>
  <section id="gallery">
    <h2 class="mb-3">Галерея</h2>
    <div class="mt-3">
      <vueper-slides :breakpoints="{
          600: {
    arrows: false,
    bulletsOutside: true
    }
        }" autoplay :slideRatio="1 / 2" :dragging-distance="50">
        <vueper-slide
            v-for="(picture, i) in gallery"
            :key="i"
            :image="picture.image"
        />
      </vueper-slides>
    </div>
  </section>
</template>

<script setup>

const props = defineProps({
  gallery: {type: Object, default: {}},
})

</script>

<style scoped lang="scss">

</style>
