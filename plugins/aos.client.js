import AOS from "aos";
import 'aos/dist/aos.css'

export default defineNuxtPlugin(nuxtApp => {
    //nuxtApp.vueApp.use(VueperSlides);
    //nuxtApp.vueApp.component('VueperSlides', VueperSlides)
    //nuxtApp.vueApp.component('VueperSlide', VueperSlide)
    AOS.init();


})
