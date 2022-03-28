<template>
  <main  class="center pb-2 adminHome" >
    <h1 class="mt-2 left pb-1 mb-2 pl-2 pr-2 admin-title">
      Отзывы
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
        <img class="feed-image" :src="feedbackToUpdate.image" alt="">
      </div>

      <div class="form-group">
        <label for="name">Имя</label>
        <input type="text" v-model.trim="feedbackToUpdate.name" class="form-control " id="name">
      </div>

      <div class="form-group">
        <label for="file">Изображение</label>
        <input class="mr-1" ref="file" type="file" id="file" @change="onFileChange"/>
      </div>


      <div class="form-group">
        <label for="work">Род деятельности</label>
        <input type="text" v-model.trim="feedbackToUpdate.work" class="form-control " id="work">
      </div>


      <div class="form-group">
        <label for="message">Сообщение</label>
        <textarea class="w100" id="message" cols="30" rows="10" v-model="feedbackToUpdate.message"></textarea>
<!--        <input type="text" v-model.trim="feedbackToUpdate.message" class="form-control " id="message">-->
      </div>

      <div class="right mt-2 mr-2 admin-opts">
      <div>
        <label for="status" class="admin-status">Опубликовано</label>
        <input type="checkbox" v-model="feedbackToUpdate.status" id="status">
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
                 :data="data.feedback"
                 :toFilter="toFilter"
                 :filtering="filtering"
                 :toSearch="['name', 'work']">
      <template #thead>
        <table-head>
          <div class="flexCentered">
            <strong>Имя</strong>
            <i @click.self="filter('name', 'asc')" class="fa ml-1 fa-caret-up pointer"></i>
            <i @click.self="filter('name', 'desc')" class="fa fa-caret-down pointer"></i>
          </div>
        </table-head>
        <table-head>
          <div class="flexCentered">
            <strong>Изображение</strong>
          </div>
        </table-head>
        <table-head>
          <div class="flexCentered">
            <strong>Род деятельности</strong>
            <i @click.self="filter('work', 'asc')" class="fa ml-1 fa-caret-up pointer"></i>
            <i @click.self="filter('work', 'desc')" class="fa fa-caret-down pointer"></i>
          </div>
        </table-head>
        <table-head>
          <div class="flexCentered">
            <strong>Сообщение</strong>
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
          {{ row.name }}
        </table-body>
        <table-body>
            <img class="feed-image" v-if="row.image" :src="row.image" alt="">
        </table-body>
        <table-body>
          {{ row.work }}
        </table-body>
        <table-body>
          {{ row.message.substring(0, 30)+'...' }}
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
const selectedFile = ref(null);

definePageMeta({
  layout: 'admin'
})

useMeta({
  title: 'Панель управления - Детали'
})


const {data, error} = await useAsyncData('adminFeedback', () => $fetch('/api/admin/feedback/index'));

const filtering = ref([]);
const toFilter = ref(false);

function filter(fTerm, dir){
  filtering.value = [fTerm, dir]
  toFilter.value = true;
}

const feedbackToUpdate = ref({status: false});
const showDlg = ref(false);
const mode = ref(null);

function onFileChange(e) {
  selectedFile.value = file.value.files[0];
}

function closeModal() {
  showDlg.value = false;
  mode.value = null;
  feedbackToUpdate.value = {status: false}
  selectedFile.value = null;
}

function updateItem(feedback) {
  mode.value = 'edit';
  feedbackToUpdate.value = {...feedback}
  showDlg.value = true;
}


function addItem() {
  mode.value = 'add';
  showDlg.value = true;
  feedbackToUpdate.value.status = false;
}

async function storeItem() {


  const formData = new FormData();
  formData.append('data', JSON.stringify(feedbackToUpdate.value))

  if (selectedFile.value) {
    formData.append('file', selectedFile.value);
  }

  try {
    $showToast('Обработка...', 'info', 2000);

    if (mode.value === 'edit') {
      const {result} = await $fetch('/api/admin/feedback/edit', {
        method: 'POST',
        body: formData,
      })
      const ind = data.value.feedback.findIndex(item => item.id === result.id);
      data.value.feedback[ind] = result;
    }

    if (mode.value === 'add') {
      const {result} = await $fetch('/api/admin/feedback/add', {
        method: 'POST',
        body: formData,
      })
      data.value.feedback.unshift(result);
    }

    filter(null, null);

    closeModal();

    $showToast('Сохранено успешно', 'success', 2000);

  } catch (e) {

    if (e.response.status === 422) {

      $showToast(e.response._data.msg, 'error');

    } else if (e.response.status === 403) {

      $showToast('Доступ звапрещен', 'error');
      //$logOut();
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
     // formData.append('url', url);

      $showToast('Обработка...', 'info', 2000);

      const {id} = await $fetch('/api/admin/feedback/remove', {
        method: 'POST',
        body: formData,
      })

      data.value.feedback.splice(data.value.feedback.findIndex(item => item.id === id), 1);

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

<style lang="scss" scoped>
.feed-image{
  height: 120px
}
</style>

