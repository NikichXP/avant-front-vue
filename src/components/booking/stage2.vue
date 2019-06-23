<template>
  <div class="col-md-6 col-md-offset-1 booking booking-2">
    <h2 class="booking-header mobile-hide">
      Подтвердите введенные данные
    </h2>
    
    <h2 class="booking-header mobile-show">
      Все верно?
    </h2>

    <h4 class="booking-subheader">
      Проверьте правильность введенных данных и необходимое количество мест
    </h4>
    
    <div class="person" v-for="(person, index) in personList" v-bind:key='index'>
      <h3 class="person-header">
        {{person.name}}
      </h3>
      <h5 class="person-text">
        {{generateInfoString(person)}}
      </h5>
    </div>
    <div class="person" v-if='comment.length > 0'>
      <h3 class="person-header">
        Комментарий к заказу
      </h3>
      <h5 class="person-text">
        {{comment}}
      </h5>
    </div>

    <button @click='initStage3' class="booking-button__next">Продолжить</button>
<!--    <router-link v-bind:to="'/order/' + id + '/' + dateid + '/stage-1'" class="booking-button__back" @click='initStage1'>Редактировать</router-link>-->
    <button class="booking-button__back" @click='initStage1'>Редактировать</button>

    <!--
          <button class="booking-button__next">Продолжить</button>
          <button class="booking-button__back">Редактировать</button>
  -->
  </div>
      
</template>

<script>

//import contact from './contact'
  
export default {
  name: 'bookingStage2Component',
  props: {
    'id': {
      type: String,
    },
    'dateid': {
      type: String,
    },
    'comment': {
      type: String,
    },
    'date': {
      type: Object,
    },
    'stage2': {
      type: Boolean,
    },
    'personList': {
      type: Array,
    },
  },
  data () {
    return {
//      gifLink: ""  
    }
  },
//  computed: {
//    
//  },
  methods: {
    generateInfoString: function (person) {
      
      console.log(person);
      
      let bdate = person.bdate.day + '/' + person.bdate.month + '/' + person.bdate.year + '; '
      let phone = '+38' + person.phone.first + person.phone.second + person.phone.third + person.phone.fourth + '; ';
      
      let offer = this.date.offers[person.offerChosen].name + ': 1 место';
      
      return bdate + phone + offer;
    },
    initStage1: function () {
      this.$emit('init-stage-1')  
    },
    initStage3: function () {
      this.$emit('init-stage-3')  
    },
  },
  components: {
//    mobileSocial: mobileSocial,
//    customFooter: zapFooter,
//    contact: contact
  }
//  mounted: function () {
//    let d = new Date();
//    this.gifLink = "../assets/img/main-screen-gif-no-loop.gif?nocache" + d.getTime();
//      
//  }
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/booking.sass" 
</style>
