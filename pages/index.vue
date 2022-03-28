<template>
  <main>
    <template v-if="data.about">
      <TheAbout :about="data.about"/>
      <div data-aos="zoom-in"
           data-aos-anchor-placement="top-center">
        <TheInfo :info="data.info"/>
      </div>
      <ClientOnly>
        <div data-aos="fade-up">
          <TheGallery :gallery="data.gallery"/>
        </div>
      </ClientOnly>
      <ClientOnly>
        <div data-aos="zoom-in">
          <TheFeedback :feedback="data.feedback"/>
        </div>
      </ClientOnly>
    </template>
    <template v-else>
      <div class="center mt-3 mb-3 loader-color">
        <i class=" fa-4x fas fa-circle-notch fa-spin"></i>
      </div>

    </template>


  </main>
</template>

<script setup>

//const {data, error} = await useAsyncData('index', () => $fetch('/api/index'));

import {onMounted, ref} from 'vue';

const cached = useCachedinfo();
const data = ref({});

onMounted(async () => {

  const index = cached.value.findIndex((element) => element['about']);

  if (index !== -1) {

    data.value.about = cached.value[0].about;
    //data.value.contacts = cached.value[1].contacts
    data.value.info = cached.value[1].info;
    data.value.gallery = cached.value[2].gallery;
    data.value.feedback = cached.value[3].feedback;

    //data.value.menu = cached.value[4].menu
    //data.value.partners = cached.value[5].partners

  } else {

    data.value = await $fetch('/api/index');

    cached.value.push({'about': data.value.about})
    cached.value.push({'info': data.value.info})
    cached.value.push({'gallery': data.value.gallery})
    cached.value.push({'feedback': data.value.feedback})
  }

})

</script>

<style lang="scss" scoped>
.loader-color{
  color: #aaa
}
</style>
