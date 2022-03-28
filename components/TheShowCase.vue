<template>
  <section class="showcase" :style="{ height: vh+'vh'}">
    <slot name="headerTop"></slot>
    <div class="content">
      <div>
        <img class="logo-img" src="/img/img.png" alt="">
      </div>
      <slot name="headerBottom"></slot>
    </div>
  </section>
</template>

<script setup>
import {ref, onMounted} from "vue";
const playVideo = ref(false);
  const props = defineProps({
    vh: {type: Number, default: 100},
  })

</script>



<style scoped lang="scss">
.logo-img {
  border: 4px solid #fff;
  border-radius: 50%;
}

</style>
