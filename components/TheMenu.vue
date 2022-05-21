<template>
  <div style="min-height: 41vh">

  <lightgallery :settings="{
      mobileSettings:{controls: true, showCloseIcon: true, download: true},
      toggleThumb: true,
          allowMediaOverlap: true,
       speed: 500,
       plugins: [$lgZoom(), $lgThumbnail(), $lgFullScreen()],
       licenseKey: '12345_example'}">
    <a class="center" v-for="(image, i) in items" :href="image.src">
      <img :style="{ 'display': i === 0 ? 'static': 'none' }" :src="image.thumbnail"/>
    </a>
  </lightgallery>

  </div>

</template>

<script setup>

const props = defineProps({
  items: {type: Object, default: {}},
})

</script>


<style scoped lang="scss">
.inline-gallery-container {
  width: 100%;
  height: 500px;
  // set 60% height

  padding-bottom: 65%;
}

</style>