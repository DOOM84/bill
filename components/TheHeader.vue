<template>
  <div @click="closeNav" ref="overlay" id="overlay" class="bg"></div>
  <header class="hero">
    <div ref="navbar" class="navbar top">
      <i @click="openNav" class="fas fa-bars fa-lg pointer openNav white mainHeader"></i>
      <nav ref="navigation">
        <transition name="page">
          <ul>
            <li>
              <NuxtLink to="/">Главная</NuxtLink>
            </li>
            <li>
              <a href="/#about" @click.prevent="moveToHash('#about')"> О нас</a>
            </li>
            <li>
              <a href="/#info" @click.prevent="moveToHash('#info')">Информация</a>
            </li>
            <li>
              <a href="/#products" @click.prevent="moveToHash('#gallery')">Галерея</a>
            </li>
            <li>
              <a href="/#services" @click.prevent="moveToHash('#feedback')">Отзывы</a>
            </li>
            <li>
              <NuxtLink to="/menu">Меню</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/tournaments">Турниры</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contacts">Контакты</NuxtLink>
            </li>
          </ul>
        </transition>
      </nav>
    </div>
  </header>
  <div ref="sideNav" class="sidenav">
    <span  class="closeBtn m-1" @click.prevent="closeNav">
      <i class="fas fa-lg  fa-times pointer white"></i>
    </span>

    <div>
      <NuxtLink to="/">Главная</NuxtLink>
      <a href="/#about" @click.prevent="moveToHash('#about')"> О нас</a>
      <a href="/#info" @click.prevent="moveToHash('#info')">Информация</a>
      <a href="/#products" @click.prevent="moveToHash('#gallery')">Галерея</a>
      <a href="/#services" @click.prevent="moveToHash('#feedback')">Отзывы</a>
      <NuxtLink to="/menu">Меню</NuxtLink>
      <NuxtLink to="/tournaments">Турниры</NuxtLink>
      <NuxtLink to="/contacts">Контакты</NuxtLink>
    </div>

  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
const {$scrollTo} = useNuxtApp();
const navbar = ref(null);
const sideNav = ref(null);
const overlay = ref(null);

const router = useRouter();
const route = useRoute();

onMounted(()=>{

  document.body.classList.add('loaded');

  let scrolled = false;
  window.onscroll = function () {
    if (window.pageYOffset > 100) {
      navbar.value.classList.remove('top');
      if (!scrolled) {
        navbar.value.style.transform = 'translateY(-70px)';
      }
      setTimeout(function () {
        navbar.value.style.transform = 'translateY(0)';
        scrolled = true;
      }, 200);
    } else {
      navbar.value.classList.add('top');
      scrolled = false;
    }
  };

})

function openNav() {
  sideNav.value.style.left = "0px";
  overlay.value.style.visibility = "visible";
  overlay.value.style.opacity = "0.5";

}

function closeNav() {
  sideNav.value.style.left = "-250px";
  overlay.value.style.opacity = "0";
  overlay.value.style.visibility = "hidden";

}

function moveToHash(hash){
    if(document.querySelector(hash)){
      $scrollTo(hash, 800);
    }else{
      router.push({ path: '/', hash: hash})
    }
    closeNav()
}

watch(route, () => {
  closeNav()
})
</script>



<style scoped lang="scss">

</style>
