<template>
  <section id="about">
    <p>{{about.text}}</p>
    <div class="mt-3 about-info">
      <div>
        <h1>{{about.pyramid.count}}</h1>
        <span>{{about.pyramid.text}}</span>
      </div>
      <div>
        <h1>{{about.pool.count}}</h1>
        <span>{{about.pool.text}}</span>
      </div>
      <div>
        <h1>
          {{about.halls.count}}
        </h1>
        <span>
          {{about.halls.text}}
        </span>
      </div>
      <h1>
        {{about.other}}
      </h1>
    </div>
  </section>
</template>

<script setup>

const props = defineProps({
  about: {type: Object, default: {}},
})

</script>

<style scoped lang="scss">

</style>
