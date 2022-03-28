<template>
  <section id="feedback">
    <h2>Отзывы</h2>
    <p>Наших гостей</p>
    <div class="info-content">
    <div class="mt-3">
      <vueper-slides autoplay :arrows="false" :bullets="false" fixed-height="400px"
                     :breakpoints="{
          5000: {
    bullets: true
    },
    600: {
    bullets: false
    }
        }"
      >

        <vueper-slide
            v-for="(reply, i) in feedback"
            :key="i"
        >
        <template #content>
          <div >
            <img class="avatar" :src="reply.image" alt="">
          </div>
          <div class="mt-1 feed-name">
            {{reply.name}}
          </div>
          <div>
            {{reply.work}}
          </div>
          <p class="mt-1">
            {{ reply.message }}
          </p>
        </template>
        </vueper-slide>

      </vueper-slides>

    </div>
    </div>
  </section>
</template>

<script setup>

const props = defineProps({
  feedback: {type: Object, default: {}},
})

</script>

<style scoped lang="scss">
.avatar{
  border-radius: 50%;
}

.feed-name{
  font-weight: 900;
}

</style>
