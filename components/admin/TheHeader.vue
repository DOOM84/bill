<template>
  <div @click="closeNav" ref="overlay" id="overlay" class="bg"></div>
  <header class="white">
      <i @click="openNav" class="fas fa-bars fa-lg pointer openNav mt-1 ml-1"></i>
    <NuxtLink to="/" class="white"><span class="siteName">Бильярдный клуб</span></NuxtLink>
       <span @click="logOut"  class="mr-1 pointer">Выход</span>
  </header>
  <div ref="sideNav" class="sidenav">
    <span  class="closeBtn m-1" @click.prevent="closeNav">
      <i class="fas fa-lg  fa-times pointer white"></i>
    </span>
    <div class="center mb-2">
      <NuxtLink to="/" class="white">
        <small class="white"><strong>Бильярдный клуб</strong>
        </small>
      </NuxtLink>
    </div>

    <div>
      <NuxtLink to="/admin">Главная</NuxtLink>
      <NuxtLink to="/admin/about">О нас</NuxtLink>
      <NuxtLink to="/admin/info">Информация</NuxtLink>
      <NuxtLink to="/admin/gallery">Галерея</NuxtLink>
      <NuxtLink to="/admin/feedback">Отзывы</NuxtLink>
      <NuxtLink to="/admin/menu">Меню</NuxtLink>
      <NuxtLink to="/admin/tournaments">Турниры</NuxtLink>
      <NuxtLink to="/admin/contacts">Контакты</NuxtLink>
      <NuxtLink to="/admin/users">Пользователи</NuxtLink>
    </div>

  </div>
</template>

<script setup>
import {ref, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
const {$logOut} = useNuxtApp();
const navbar = ref(null);
const sideNav = ref(null);
const overlay = ref(null);

const router = useRouter();
const route = useRoute();

function logOut(){
  $logOut();
  router.replace('/');
}

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

watch(route, () => {
  closeNav()
})
</script>


<style scoped lang="scss">
header {

  background: #343a40;
  height: 50px; display: flex;
  justify-content: space-between;
  align-items: center;

  i  {
    align-self: baseline;
    color: #c9d3dc
  }
}

@media(max-width: 450px) {

  .siteName{
    display: none;
  }
}


</style>
