<template>
  <section id="gallery">
    <h2 class="mb-3">Галерея</h2>
    <lightgallery :settings="{
      mobileSettings:{controls: true, showCloseIcon: true, download: true},
      toggleThumb: true,
          allowMediaOverlap: true,
       speed: 500,
       plugins: [$lgZoom(), $lgThumbnail(), $lgFullScreen()],
       licenseKey: '12345_example'}">
      <a class="gallery-item" v-for="image in gallery" :href="image.src">
        <img class="link-image " :src="image.thumb"/>
      </a>
    </lightgallery>
  </section>
</template>

<script setup>

const props = defineProps({
  gallery: {type: Object, default: {}},
})


</script>

<style scoped lang="scss">

.link-image {

    height: 200px;
    border-radius: 0.375em;
    transition: transform 0.2s ease;

    &:hover {
      -ms-transform: scale(1.075);
      transform: scale(1.075);
    }

}

</style>
