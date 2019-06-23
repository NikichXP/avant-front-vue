<template>
  <section class="container contact">
    <h2 class="contact-header contact-mobile__hide">
      ЗВОНИ / ЗАХОДИ
    </h2>
    <h2 class="contact-header__mobile">
      Не стесняйся, спрашивай:
    </h2>
    <div class="row">
      <div class="col-md-5 col-sm-12 col-md-offset-1 contact-phone">
        <vector src="../assets/img/icons/phone.svg" class="contact-icon contact-mobile__hide"></vector>
        <div class="contact-text contact-mobile__hide">
          С любыми вопросами можно обращаться с 10:00 <br> до 21:00 ежедневно по телефону:
        </div>
        <a href='tel:+38 (063) 212-55-66'>
              +38 (063) 212-55-66
          </a>
      </div>
      <div class="col-md-5 col-sm-12 contact-map">
        <vector src="../assets/img/icons/map.svg" class="contact-icon contact-mobile__hide"></vector>
        <div class="contact-text contact-mobile__hide">
          Заходите к нам в офис в Одессе, возле горсада <br> по будням 13:00 до 19:00 по адресу:
        </div>
        <a href='https://goo.gl/maps/5f2Pmg985L42'>
              Дворянская, 5
          </a>
      </div>
      <div class="contact-mobile__line col-sm-12">
        <span></span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'contact'
}

</script>

<style lang="sass" scoped>
  @import "../assets/sass/contact.sass"  
</style>
