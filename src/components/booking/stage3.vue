<template>

  <div class="col-md-6 col-md-offset-1 booking booking-3">
    <h2 class="booking-header">
      Ваш номер бронирования: <span class='booking-header__span'>#{{ order.id }}</span>
    </h2>

    <h4 class="booking-subheader" >
      Введите email, на который будут высланы введенные данные, статус оплаты и номер бронирования. Если что-то пойдет не так, вы всегда сможете продолжить оплату по телефону или у нас в офисе, сообщив номер бронироавния.
    </h4>

    <label for="" v-if='mailNeeded'>Ваш Email</label>
    <input type="text" placeholder='Введите ваш email' v-model='mail' v-bind:class='{"validate-fail": !mailValid}' v-if='mailNeeded'>

    <!--        <button class="booking-button__next">Оплатить аванс</button>-->
<!--    <router-link v-bind:to="'/order/' + id + '/' + dateid + '/stage-1'" class="booking-button__next">Оплатить аванс</router-link>-->
    <button class="booking-button__next" @click='addEmail'>Оплатить аванс</button>
    <div class='payment-form' v-html='order.form'>
    </div>
  </div>

</template>

<script>

//import contact from './contact'
import axios from '../../lib/axios.js'
 
  
export default {
  name: 'bookingStage3Component',
  props: {
    'id': {
      type: String,
    },
    'dateid': {
      type: String,
    },
//    'comment': {
//      type: String,
//    },
//    'date': {
//      type: Object,
//    },
//    'stage2': {
//      type: Boolean,
//    },
    'order': {
      type: Object,
    }
  },
  data () {
    return {
      mail: "",
      mailValid: true,
      mailNeeded: true,
    }
  },
//  computed: {
//    
//  },
  methods: {
    addEmail: function () {
      if (!this.mailNeeded) {
        this.$emit('payment-submit');  
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.mail)) {
        this.mailValid = false;
        return;
      }  
      let data = new FormData();
      
      data.append('orderId', this.order.id);
      data.append('mail', this.mail);
      
      let that = this;
      
      axios({
        method: 'post',
        url: '/order/setMail',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        console.log('OK'); 
        that.$emit('payment-submit');
      }).catch(function (error) {
        console.log(error);
      }); 
      
      
    }  
  },
//  components: {
////    mobileSocial: mobileSocial,
////    customFooter: zapFooter,
////    contact: contact
//  }б
  mounted: function () {
    if (this.$cookies.get("accessToken")) {
      this.mailNeeded = false
    }
      
  }
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/booking.sass" 
</style>
