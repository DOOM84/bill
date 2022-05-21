<template>
  <main  class="center pb-2 adminHome" >
    <h1 class="mt-2 left pb-1 mb-2 pl-2 pr-2 admin-title">Информация</h1>


    <div class="right">
      <button
          type="button"
          class="button btn-dark"

          @click.prevent="addItem">
        Добавить
      </button>
    </div>

    <AdminModalWrap @closeDlg="closeModal" mWidth="1000px" origWidth="100%" :showDlg="showDlg">

        <div class="form-group left">
          <label for="hall"><strong>Зал</strong></label>
          <input type="text" v-model.trim="infoToUpdate.hall" class="form-control " id="hall">
        </div>

        <div v-for="(period, i) in infoToUpdate.periods">
          <div class="form-group left mt-2">
            <label :for="'period-'+i">Период</label>
            <input type="text" v-model.trim="period.time" class="form-control " :id="'period-'+i">
          </div>

          <div class="form-group left">
            <label :for="'pyramid-'+i">Пирамида</label>
            <input type="text" v-model.trim="period.pyramid" class="form-control " :id="'pyramid-'+i">
          </div>

          <div class="form-group left">
            <label :for="'pool-'+i">Pool</label>
            <input type="text" v-model.trim="period.pool" class="form-control " :id="'pool-'+i">
          </div>
        </div>



      <div class="right mt-2 mr-2 admin-opts">
        <button
            type="button"
            class="button btn-dark"
            @click.prevent="addPeriod">
          Добавить период
        </button>

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
                   :data="data.info"
                   :toFilter="toFilter"
                   :filtering="filtering"
                   :toSearch="['hall']">
        <template #thead>
          <table-head>
            <div class="flexCentered">
              <strong>Название</strong>
              <i @click.self="filter('hall', 'asc')" class="fa ml-1 fa-caret-up pointer"></i>
              <i @click.self="filter('hall', 'desc')" class="fa fa-caret-down pointer"></i>
            </div>
          </table-head>
          <table-head/>
        </template>

        <template #rows="{row}">
          <table-body>
            {{ row.hall }}
          </table-body>
          <table-body>
            <button @click.prevent="updateItem({...row})" class="button block btn-dark"><i class="fas fa-edit"></i></button>
            <button @click.prevent="removeItem(row.hall)" class="button block btn-dark"><i class="fas fa-trash"></i></button>
          </table-body>
        </template>
      </AdminDtable>
    </ClientOnly>
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
  title: 'Панель управления - Информация'
})

const {data, error} = await useAsyncData('adminInfo', () => $fetch('/api/admin/info'));

const filtering = ref([]);

const toFilter = ref(false);

function filter(fTerm, dir){
  filtering.value = [fTerm, dir]
  toFilter.value = true;
}

const infoToUpdate = ref({});
const showDlg = ref(false);
const mode = ref(null);
const hallToUpdate = ref('')


function closeModal() {

  showDlg.value = false;

 /* if(mode.value === 'edit'){
    const ind = data.value.info.findIndex(item => {
      return item.hall === infoToUpdate.value.hall
    });

    if(ind !== -1){
      data.value.info[ind].periods = data.value.info[ind].periods.filter((period)=>{
        return period.time !== '' && period.pyramid !== '' && period.pool !== ''
      })
    }
  }*/
  mode.value = null;
  infoToUpdate.value = {};

}

function updateItem(infoData) {
  mode.value = 'edit';
  hallToUpdate.value = infoData.hall;
  infoToUpdate.value = {
    hall: infoData.hall,
    periods: JSON.parse(JSON.stringify(infoData.periods))
  }
  showDlg.value = true;
}


function addItem() {
  mode.value = 'add';
  showDlg.value = true;
  infoToUpdate.value = {
    hall: '',
    periods: [
      dummyPeriod()
    ]};
}

function addPeriod(){
  infoToUpdate.value.periods.push(dummyPeriod())
}

function dummyPeriod(){
  return {
    time: '',
    pyramid: '',
    pool: '',
  }
}

async function storeItem() {

  infoToUpdate.value.periods = infoToUpdate.value.periods.filter(period =>
      period.time !== '' && period.pyramid !== '' && period.pool !== '')

  if(!infoToUpdate.value.periods.length){$showToast('Ввдеите период(ы) времени', 'error', 2000); return}

  if(mode.value === 'edit'){

    const ind = data.value.info.findIndex(item => {
      return item.hall === hallToUpdate.value
    })

    if(ind !== -1){
      data.value.info[ind] = infoToUpdate.value
    }

  }

  if(mode.value === 'add'){
    data.value.info.push(infoToUpdate.value)
  }

  const formData = new FormData();

  formData.append('data', JSON.stringify(data.value.info))

  try {

    $showToast('Обработка', 'info', 2000);
      const {result} = await $fetch('/api/admin/info/edit', {
        method: 'POST',
        body: formData,
      })

    data.value.info = result;

    filter(null, null);

    closeModal();

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

async function removeItem(hall){

  if (confirm('Are you sure?')) {
    data.value.info.splice(data.value.info.findIndex(item => item.hall === hall), 1);

    const formData = new FormData();

    formData.append('data', JSON.stringify(data.value.info));

    try {

      $showToast('Обработка', 'info', 2000);
      const {result} = await $fetch('/api/admin/info/edit', {
        method: 'POST',
        body: formData,
      })

      data.value.info = result;

      filter(null, null);

      closeModal();

      $showToast('Удалено успешно', 'success', 2000);

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
}

</script>

<style lang="scss" scoped>
.adminHome{
  margin: auto;
  z-index: 1;
}
</style>