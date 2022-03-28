<template>
  <vue-picture-swipe :items="items"></vue-picture-swipe>
</template>

<script setup>

const props = defineProps({
  items: {type: Object, default: {}},
})

</script>

<style scoped lang="scss">

</style>
