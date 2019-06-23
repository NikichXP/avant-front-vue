<template>
  <div class="col-md-4 info" v-bind:class='{"col-md-offset-3": this.$route.path.indexOf("stage-1") > 0, "col-md-offset-1": this.$route.path.indexOf("stage-1") <= 0}' >
    <div class="info-inner-wrapper">
      <h3 class="info-header mobile-hide">
        {{event.title}}
      </h3>
      <h5 class="info-subheader mobile-hide">
        {{ dateString }}
      </h5>
      <h3 class="info-header mobile-show" v-if='showBlock'>
        К оплате
      </h3>
      <div class="info-content">
        <h4 class="info-content__header" v-if='roomsList[0].name.length > 0'>
          Количество человек
        </h4>        
        <h5 class="info-content__text" v-for="(place, index) in roomsList" v-bind:key='index' v-if='roomsList[0].name.length > 0 && place.count > 0'>
<!--          {{ place.name + ': ' + place.count}}-->
          {{countPlaces(place.name, place.count)}}
        </h5> 
      </div>
      <div class="info-content" v-if='payment.deposit > 0'>
        <h4 class="info-content__header">
          К оплате сейчас <span v-if='payment.deposit < payment.price'>(аванс)</span>
        </h4>
        <h5 class="info-content__text">
          {{ payment.deposit + ' ' + parseCurrency(payment.currency) }}
        </h5>
      </div>
      <div class="info-content" v-if='payment.deposit != payment.price'>
        <h4 class="info-content__header">
          Доплата при встрече (остаток)
        </h4>
        <h5 class="info-content__text">
          {{ (payment.price - payment.deposit) + ' ' + parseCurrency(payment.currency) }}
        </h5>
      </div>
      <button class="booking-button__next mobile-hide" v-if='this.$route.path.indexOf("stage-1") > 0 && payment.deposit > 0' @click='initStage2()'>Продолжить</button>
      <button class="booking-button__next mobile-show" :disabled='payment.deposit <= 0' v-if='this.$route.path.indexOf("stage-1") > 0' @click='initStage2()'>Продолжить</button>  
      <div class="sidebar-error" v-if='commentValidateFail'>Если в заказе больше 2 персон, комментарий обязателен к заполнению</div>
    </div>
  </div>
</template>

<script>

import util from '../../lib/util'
import event from '../../lib/eventlib'
  
export default {
  name: 'bookingSidebarComponent',
  props: {
    'date': {
      type: Object,
    },
    'event': {
      type: Object,
    },
    'payment': {
      type: Object,
    },
    'placesList': {
      type: Array,
    },
    'placesNeeded': {
      type: Boolean, 
    },
    'commentValidateFail': {
      type: Boolean,
    },
  },
  data () {
    return {
      roomsList: [
        {
          name: '',
          count: 0  
        }
      ]
    }
  },
  computed: {
    dateString: function () {
//      console.log(this.date);
      let startDate = new Date(this.date.startDate)
      let endDate = new Date(this.date.endDate)
      
      let startMonth = util.getMonthNameVar2(startDate.getMonth() + 1);
      let endMonth = util.getMonthNameVar2(endDate.getMonth() + 1);
      
      let startDay = startDate.getDate();
      let endDay = endDate.getDate();
            
      if (startMonth == endMonth) {
        
        if (startDay == endDay) return startDay + ' ' + endMonth; 
        else  return startDay + ' — ' + endDay + ' ' + endMonth;
        
      } else {
        
        return startDay + ' ' + startMonth + ' — ' + endDay + ' ' + endMonth;  
      }
      
      return '' 
    },
    mobileView: function () {
      return window.innerWidth <= 991
    },
    showBlock: function () {
//      console.log(this.mobileView)
      if (this.mobileView) {
        
        return this.placesList[0].name.length > 0 
      } else {
        return true
      }
    },
//    roomsList: function () {
      
//      let roomList = event.roomsList()
//      let result = []
//      
//      this.placesList.forEach(e => {
//        result.push(e)
//        
//        let room = roomList.filter(r => r.name === e.name)[0]
//        
//        if (room) {
//          if (e.count > room.places) {
//            console.log('a');
//          }
//        }
////        if (e.count > )
//      })
//      return this.placesList
//    }
  },
  watch: {
    placesList: function () {
      
      let roomList = event.roomsList()
      let result = []
      
      this.placesList.forEach(e => {
        result.push(e)
        
        let room = roomList.filter(r => r.name === e.name)[0]
        
        if (room) {
          if (e.count > room.places) {

            let dif = e.count - room.places
            
            result[result.length - 1].count = room.places
            
            console.log('dif ', dif)
            
            while (dif > 0) {
              if (dif - room.places > 0) {
                result.push({
                  name: e.name,
                  count: dif - room.places
                })
              } else {
                result.push({
                  name: e.name,
                  count: dif
                })  
              }
              
              dif -= room.places
            }
            
            
          }
        }
//        if (e.count > )
      })
      this.roomsList = result
    }  
  },
  methods: {
    parseCurrency: function (cur) {
//      console.log(cur);
      switch (cur) {
        case 'UAH': return 'грн'
        case 'USD': return 'дол.'
        case 'EUR': return 'евро'
      }  
      return 0
    },
    initStage2: function () {
      this.$emit('init-stage-2')
    },
    countPlaces: function (name, count) {
      if (this.placesNeeded) return name + ': ' + count
      else return count
    }
  },
//  components: {
//    mobileSocial: mobileSocial,
//    customFooter: zapFooter,
//    contact: contact
//  }

}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/booking.sass" 
</style>
