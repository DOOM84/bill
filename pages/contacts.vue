<template>
  <section>
    <h2 class="center">Контакты</h2>
    <div class="contact-box">
      <div class="contact-item">
        <i class="fa fa-map-marker"></i> <span>{{data.contacts.address}}</span>
      </div>
      <div class="contact-item">
        <i class="fa fa-clock"></i><span>{{data.contacts.time}}</span>
      </div>
      <div class="contact-item">
        <i class="fa fa-phone"></i><span>{{data.contacts.phone}}</span>
      </div>

    </div>
    <div class="map mt-2">
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2541.927876172222!2d30.595628951683352!3d50.423815397063265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4c579188ddf63%3A0xbd4fd9f3e07630ce!2z0JTQvtC9!5e0!3m2!1sru!2sua!4v1592127644425!5m2!1sru!2sua" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
    </div>


  </section>
</template>

<script setup>

const {data, error} = await useAsyncData('contacts', () => $fetch('/api/contacts'));

</script>
