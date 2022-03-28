<template>
  <main  class="center pb-2 adminHome" >
    <h1 class="mt-2 left pb-1 mb-2 pl-2 pr-2 admin-title">
      Меню
    </h1>

    <div class="right">
      <button
          type="button"
          class="button btn-dark"

          @click.prevent="addItem">
        Добавить
      </button>
    </div>

    <AdminModalWrap @closeDlg="closeModal" mWidth="1000px" origWidth="100%" :showDlg="showDlg">

      <div v-if="mode === 'edit'" class="flexCentered">
        <img class="pic-thumb" :src="pictureToUpdate.thumbnail" alt="">
      </div>

      <div v-else class="form-group">
        <label for="file">Изображение</label>
        <input class="mr-1" ref="file" type="file" id="file" @change="onFileChange"/>
      </div>


      <div class="right mt-2 mr-2 admin-opts">
      <div>
        <label for="status" class="admin-status">Опубликовано</label>
        <input type="checkbox" v-model="pictureToUpdate.status" id="status">
      </div>

      <button
          type="button"
          class="button btn-dark"
          @click.prevent="storeItem">
        Сохранить
      </button>
      </div>
    </AdminModalWrap>
    <ClientOnly>
    <AdminDtable @endFilter="toFilter = false"
                 :data="data.menu"
                 :toFilter="toFilter"
                 :filtering="filtering"
                 :toSearch="[]">
      <template #thead>
        <table-head>
          <div class="flexCentered">
            <strong>Изображение</strong>
          </div>
        </table-head>
        <table-head>
          <div class="flexCentered">
            <strong>Опубликовано</strong>
            <i @click.self="filter('status', 'asc')" class="fa ml-1 fa-caret-up pointer"></i>
            <i @click.self="filter('status', 'desc')" class="fa fa-caret-down pointer"></i>
          </div>
        </table-head>
        <table-head/>
      </template>

      <template #rows="{row}">
        <table-body>
            <img class="pic-thumb" :src="row.thumbnail" alt="">
        </table-body>
        <table-body>
          {{ row.status ? 'Да': 'Нет' }}
        </table-body>
        <table-body>
          <button @click.prevent="updateItem(row)" class="button block btn-dark"><i class="fas fa-edit"></i></button>
          <button @click.prevent="removeItem(row.id)" class="button block btn-dark"><i class="fas fa-trash"></i></button>
        </table-body>
      </template>
    </AdminDtable>
    </ClientOnly>
  </main>
</template>
<script setup>
import {ref} from 'vue';
const {$showToast} = useNuxtApp();
import {useRouter} from 'vue-router';
const router = useRouter();
const file = ref(null);
const files = ref(null);
const selectedFile = ref(null);

definePageMeta({
  layout: 'admin'
})

useMeta({
  title: 'Панель управления - Галерея'
})


const {data, error} = await useAsyncData('adminMenu', () => $fetch('/api/admin/menu/index'));

const filtering = ref([]);
const toFilter = ref(false);

function filter(fTerm, dir){
  filtering.value = [fTerm, dir]
  toFilter.value = true;
}

const pictureToUpdate = ref({status: false});
const showDlg = ref(false);
const mode = ref(null);

function onFileChange(e) {
  selectedFile.value = file.value.files[0];
}

function closeModal() {
  showDlg.value = false;
  mode.value = null;
  pictureToUpdate.value = {status: false}
  selectedFile.value = null;
}

function updateItem(picture) {
  mode.value = 'edit';
  pictureToUpdate.value = {...picture}
  showDlg.value = true;
}


function addItem() {
  mode.value = 'add';
  showDlg.value = true;
  pictureToUpdate.value.status = false;
}

async function storeItem() {

  const formData = new FormData();
  formData.append('data', JSON.stringify(pictureToUpdate.value))

  try {
    $showToast('Обработка...', 'info', 2000);

    if (mode.value === 'edit') {
      const {result} = await $fetch('/api/admin/menu/edit', {
        method: 'POST',
        body: formData,
      })
      const ind = data.value.menu.findIndex(item => item.id === result.id);
      data.value.menu[ind] = result;
    }

    if (mode.value === 'add') {
      if (selectedFile.value) {
        formData.append('file', selectedFile.value);
      }
      const {result} = await $fetch('/api/admin/menu/add', {
        method: 'POST',
        body: formData,
      })
      data.value.menu.unshift(result);
    }

    filter(null, null);

    closeModal();

    $showToast('Сохранено успешно', 'success', 2000);

  } catch (e) {

    if (e.response.status === 422) {

      $showToast(e.response._data.msg, 'error');

    } else if (e.response.status === 403) {

      $showToast('Доступ звапрещен', 'error');

      await router.replace('/404');

    } else {

      $showToast('Ошибка', 'error', 2000);

    }

  }
}

async function removeItem(dbId) {
  if (confirm('Are you sure?')) {
    try {

      const formData = new FormData();
      formData.append('id', dbId);

      $showToast('Обработка...', 'info', 2000);

      const {id} = await $fetch('/api/admin/menu/remove', {
        method: 'POST',
        body: formData,
      })

      data.value.menu.splice(data.value.menu.findIndex(item => item.id === id), 1);

      filter(null, null);

      $showToast('Успешно удалено', 'success', 2000);

    } catch (e) {

      if (e.response.status === 403) {

        $showToast('Доступ запрешен', 'error');

        await router.replace('/404')

      }
    }
  }
}

</script>

