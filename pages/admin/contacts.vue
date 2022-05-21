<template>
  <main  class="center pb-2 adminHome" >
    <h1 class="mt-2 left pb-1 mb-2 pl-2 pr-2 admin-title">Контакты</h1>

    <div class="form-group left">
      <label for="address">Адрес</label>
      <input type="text" v-model.trim="infoToUpdate.address" class="form-control " id="address">
    </div>

    <div class="form-group left">
      <label for="time">Время</label>
      <input type="text" v-model.trim="infoToUpdate.time" class="form-control " id="time">
    </div>

    <div class="form-group left">
      <label for="phone">Телефон</label>
      <input type="text" v-model.trim="infoToUpdate.phone" class="form-control " id="phone">
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
  title: 'Панель управления - Контакты'
})

const infoToUpdate = ref({});

const {data, error} = await useAsyncData('adminContacts', () => $fetch('/api/admin/contacts'));

if(data.value.info){
  infoToUpdate.value = {...data.value.info}
}

async function storeItem() {

  const formData = new FormData();
  formData.append('data', JSON.stringify(infoToUpdate.value))
  try {

    $showToast('Обработка', 'info', 2000);
      const {result} = await $fetch('/api/admin/contacts/edit', {
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