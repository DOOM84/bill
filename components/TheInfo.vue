<template>
  <section id="info">
    <div data-aos="zoom-in"
         data-aos-anchor-placement="top-center">
    <h2 class="mb-3">Бильярд</h2>
    <div class="info-content">
      <div v-for="hall in info.halls" class="info-card">
        <div class="pricing">
          {{hall.hall}}
        </div>
        <div v-for="period in hall.periods">
          <div class="mt-1 mb-1">
            {{period.time}}
          </div>
          <div class="mb-1 title-head">
            {{period.pyramid}}
          </div>
          <div class="mb-1 title-head">
            {{period.pool}}
          </div>
        </div>
      </div>
    </div>
    </div>

  </section>
</template>


<script setup>

const props = defineProps({
  info: {type: Object, default: {}},
})

</script>

<style scoped lang="scss">

</style>
