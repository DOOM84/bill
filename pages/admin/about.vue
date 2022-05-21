<template>
  <main  class="center pb-2 adminHome" >
    <h1 class="mt-2 left pb-1 mb-2 pl-2 pr-2 admin-title">О нас</h1>

    <div>
      <textarea class="pa-1 w100" id="text" rows="10" v-model="infoToUpdate.text"></textarea>
    </div>

    <div class="form-group left">
      <label for="pyramid">Пирамида</label>
      <input type="text" v-model.trim="infoToUpdate.pyramid.text" class="form-control " id="pyramid">
    </div>

    <div class="form-group left">
      <label for="pyramid_count">Пирамида столов</label>
      <input type="number" min="1" v-model.trim="infoToUpdate.pyramid.count" class="form-control " id="pyramid_count">
    </div>

    <div class="form-group left">
      <label for="pool">Pool</label>
      <input type="text" v-model.trim="infoToUpdate.pool.text" class="form-control " id="pool">
    </div>

    <div class="form-group left">
      <label for="pool_count">Pool столов</label>
      <input type="number" min="1" v-model.trim="infoToUpdate.pool.count" class="form-control " id="pool_count">
    </div>


    <div class="form-group left">
      <label for="halls">Залы</label>
      <input type="text" v-model.trim="infoToUpdate.halls.text" class="form-control " id="halls">
    </div>

    <div class="form-group left">
      <label for="halls_count">Залов</label>
      <input type="number" min="1" v-model.trim="infoToUpdate.halls.count" class="form-control " id="halls_count">
    </div>

    <div class="form-group left">
      <label for="other">Другое</label>
      <input type="text" v-model.trim="infoToUpdate.other" class="form-control " id="other">
    </div>


    <div class="right mt-2 mr-2 admin-opts">
      <button
          type="button"
          class="button btn-dark"
          @click.prevent="storeItem">
        Сохранить
      </button>
    </div>
  </main>
</template>

<script setup>
import {ref} from 'vue';
const {$showToast} = useNuxtApp();
const router = useRouter();

definePageMeta({
  layout: 'admin'
})

useMeta({
  title: 'Панель управления - О нас'
})

const infoToUpdate = ref({
  pyramid: {
    text: '',
    count: ''
  },
  pool: {
    text: '',
    count: ''
  },
  halls: {
    text: '',
    count: ''
  }
});

const {data, error} = await useAsyncData('adminAbout', () => $fetch('/api/admin/about'));

//const finalEdit = ref(false);


if(data.value.about){
  infoToUpdate.value = {...data.value.about}
}


async function storeItem() {

  const formData = new FormData();
  formData.append('data', JSON.stringify(infoToUpdate.value))
  try {

    $showToast('Обработка', 'info', 2000);
      const {result} = await $fetch('/api/admin/about/edit', {
        method: 'POST',
        body: formData,
      })

    $showToast('Сохранено успешно', 'success', 2000);

  } catch (e) {

    if (e.response.status === 422) {

      $showToast(e.response._data.msg, 'error');

    } else if (e.response.status === 403) {

      $showToast('Доступ запрещен', 'error');
      //$logOut();
      await router.replace('/404');

    } else {

      $showToast('Ошибка', 'error', 2000);

    }

  }
}

</script>

<style lang="scss" scoped>
.adminHome{
  margin: auto;
  z-index: 1;
}
</style>