import VuePictureSwipe from 'vue3-picture-swipe';

import {defineNuxtPlugin} from "nuxt3/app";

export default defineNuxtPlugin(nuxtApp => {
    //nuxtApp.vueApp.use(VueperSlides);
    nuxtApp.vueApp.component('vue-picture-swipe', VuePictureSwipe)

    //nuxtApp.vueApp.use(LightGallery);
})