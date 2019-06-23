<template>
  <footer class="footer container-fluid">
    <div class="container footer-inner">
      <router-link to='/blog'>
        <img src="../assets/img/logo-footer.png" alt="" class="footer-logo">
      </router-link>
      <div class="footer-social">
        <span>Мы в</span>
        <a href="https://facebook.com/avanturisty.od/"><vector src="../assets/img/icons/fb.svg" class='svg'></vector></a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'zapFooter' 
}

</script> 

<style lang="sass">
  @import "../assets/sass/footer.sass" 
</style>
 