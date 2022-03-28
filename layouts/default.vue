<template>
  <div>
    <TheHeader />

    <ClientOnly>
      <TheShowCase :vh="$route.path === '/' ? 65 : 30">
        <template #headerTop v-if="$route.path === '/'">
          <h1 class="main-head" style="z-index: 1">
            Бильярдный клуб
          </h1>
        </template>
        <template #headerBottom v-if="$route.path === '/'">
          <h1 class="banner-text">
            Добро пожаловать!
          </h1>
        </template>
      </TheShowCase>
    </ClientOnly>
    <slot/>

    <TheFooter />

  </div>

</template>

<script setup>
const {$scrollTo} = useNuxtApp();
import {useRoute} from "vue-router";
import {onMounted, nextTick} from 'vue';
const route = useRoute();
const router = useRouter();


onMounted(()=>{

  //loaded.value = true;

  //document.body.classList.add('loaded');

  if (route.hash) {
    scrollToHash()
  }

})

function scrollToHash () {

  let hash = route.hash;

  nextTick(() => {
      $scrollTo(hash, 800)
    })
}

</script>

<style lang="scss">


</style>

