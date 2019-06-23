<template>
  <div class="view-wrapper">
    <header class="container header">
      <div class="row">
        <div class="col-md-1 logo">
          <router-link :to='createEventLink(event)'>
            <img src="../../assets/img/logo3x.png" alt="">
          </router-link>
        </div>
        <div class="col-md-11 stages">
          <ul class="stages-list">
            <li v-bind:class='{"active": activeStage == 1}'>
              1. Контактная информация
            </li>
            <li v-bind:class='{"active": activeStage == 2}'>
              2. Проверка данных
            </li>
            <li v-bind:class='{"active": activeStage == 3}'>
              3. Оплата аванса
            </li>
            <li>
              4. Оплата остатка при встрече
            </li> 
          </ul>
        </div>
      </div>
    </header>  
    
    <div class="container main">
      <div class="row">
        <div class="info info-mobile">
          <h3 class="info-header">
            {{event.title}}
          </h3>
          <h5 class="info-subheader">
            {{ dateString }}
          </h5>
          <h4 class="info-mobile__stage mobile-show" v-if='activeStage == 1'>
            Шаг 1: Контактная информация
          </h4>
          <h4 class="info-mobile__stage mobile-show" v-if='activeStage == 2'>
            Шаг 2: Проверка данных
          </h4>
          <h4 class="info-mobile__stage mobile-show" v-if='activeStage == 3'>
            Шаг 3: Оплата аванса
          </h4>
        </div>
        <router-view         
          :date='date' 
          :stage2='stage2' 
          :personList='personList'
          :comment='comment'
          :order='order'
          :personUpdate='personUpdate'
          :placesLeft='date.places' 
          :commentValidateFail='commentValidateFail'
          
          v-on:payment-changed='changePayment' 
          v-on:payment-submit='submitPayment' 
          v-on:comment-changed='changeComment' 
          v-on:init-add-person='addPerson' 
          v-on:init-stage-1='initStage1' 
          v-on:validate-fail='validateFail' 
          v-on:init-stage-3='initStage3' 
          v-on:validate-comment='validateComment' 
        ></router-view>
        <booking-sidebar 
          :event='event' 
          :date='date' 
          :payment='payment' 
          :placesList='placesList' 
          :placesNeeded='moreThanOnePrice'
          :commentValidateFail='commentValidateFail'
          
          v-on:init-stage-2='initStage2'
        ></booking-sidebar>   
      </div>
    </div>
    
  </div>
</template>

<script>
  
import axios from '../../lib/axios.js'
 
  
import util from '../../lib/util'
import event from '../../lib/eventlib'

import bookingSidebarComponent from './sidebar'
  
export default {
  name: 'bookingComponent',
  props: ['id', 'dateid'],
  data () {
    return {
      event: {
        title: ''
      },
      date: {
        offers: [
          {
            name: '',
            offerTypes: [
              {
                type: '' 
              }
            ]
          }
        ]
      },
      payment: {
        deposit: '',
        price: '',
        currency: 'UAH'
      },
      stage2: false,
      personList: [],
      comment: '',
      placesList: [ 
        {
          name: '',
          count: 0
        } 
      ],
      order: {
        id: '',
        form: ''
      },
      logged: false,
      personUpdate: false,
      moreThanOnePrice: true,
      roomsList: [],
      commentValidateFail: false
    }
  },
  metaInfo() {
    return {
      title: 'Бронирование - ' + this.event.title,
      meta: [
        { vmid: 'description', name: 'description', content: 'Авантюристы - не совсем туристы' }
      ]
    }
  },  
  computed: {
    activeStage: function () {
        if (this.$route.path.indexOf('stage-1') > 0) return 1
        else if (this.$route.path.indexOf('stage-2') > 0) return 2
        else if (this.$route.path.indexOf('stage-3') > 0) return 3  
        else return 0;
      },
    dateString: function () {
//      console.log(this.date);
      let startDate = new Date(this.date.startDateTimeStamp)
      let endDate = new Date(this.date.endDateTimeStamp)
      
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
    }        
  },
  components: {
    bookingSidebar: bookingSidebarComponent 
  },
  methods: {
    getEvent: function () {
      let that = this;
      axios({
        method: 'get',
        url: '/event/' + that.id,
      })
      .then(function (response) {
        that.event = response.data.data
        that.date = response.data.data.date
        that.placesList = [
          {
            name: '',
            count: 0
          }
        ]
        that.addPerson();
        that.isOnePrice();
      })
      .catch(function (error) {
        console.log(error);
      });      
    },  
    changePayment: function (event) {      

      this.payment = event;   
      this.fillPlacesList();
    },
    submitPayment: function (event) {
//      console.log(this.$refs);
//      this.$refs.paymentform.submit()
      document.getElementById("paymentform").submit();
    },
    changeComment: function (event) {
      this.comment = event;  
    },
    validateComment: function () {
      this.commentValidateFail = false;
      
      if (this.personList.length > 2 && this.comment.length <= 0) {
        this.commentValidateFail = true;  
      }
    },
    initStage3: function () {
      this.stage2 = false;
//      this.$router.push('/order/' + this.id + '/' + this.dateid + '/stage-3'); 
      let data = new FormData();
      let that = this;
      
      data.append('eventId', this.id);
      data.append('dateId', this.dateid);
      data.append('comment', this.comment);
      data.append('usersCount', this.personList.length);
      
      this.personList.forEach((e, index) => {
        let phone = '+38' + e.phone.first + e.phone.second + e.phone.third + e.phone.fourth;
        let bdate = e.bdate.year + '-' + e.bdate.month + '-' +  e.bdate.day;
        
        data.append('name' + index, e.name);
        data.append('phone' + index, phone);
        data.append('bday' + index, bdate);
        
        if (e.student.length > 0) data.append('document' + index, e.student);
        
        data.append('type' + index, this.date.offers[e.offerChosen].name);
        data.append('class' + index, e.variantChosen);
      });
      
      this.checkAuth(data);          
    },
    initStage2: function () {
//      console.log('a');
      this.stage2 = true;
    },
    validateFail: function () {
      this.stage2 = false;
    },
    initStage1: function () {
      this.stage2 = false;
      this.$router.push('/order/' + this.id + '/' + this.dateid + '/stage-1'); 
    },
    addPerson: function () { 
      let offerNeeded = true;
      let offerChosen = 0
      let variantChosen = ''
      
      if (this.date.offers.length == 1) {
        offerNeeded = false;
      }
      this.personList.push(
        { 
          name: '', 
          bdate: { 
            day: '', 
            month: '', 
            year: '' 
          }, 
          phone: { 
            first: '', 
            second: '', 
            third: '', 
            fourth: '', 
          }, 
          bdateValidateFail: false, 
          phoneValidateFail: false, 
          studentValidateFail: false, 
          nameValidateFail: false, 
          surnameValidateFail: false, 
          offerValidateFail: false, 
          variantValidateFail: false, 
          variant: '', 
          discount: '', 
          offerChosen: offerChosen,
          variantNeeded: true,
          offerNeeded: offerNeeded,
          variantChosen: variantChosen,
          student: '',
          payment: {
            deposit: '',
            price: '',
            currency: ''
          },
        }
      );

//      if (this.date.offers.length == 1) {
//        console.log(this.date);
//        this.$emit('updateDate', this.date);
//        
//        this.$emit('updatePerson', this.personList.length - 1);
//      }
      
    },
    fillPlacesList: function () {
      let offerList = []
      
      this.date.offers.forEach(e => {
        offerList.push({
          name: e.name,
          count: 0
        });  
      });
      
      
      offerList.forEach(e => {     
        e.count = this.personList.filter(p => {          
          return e.name == this.date.offers[p.offerChosen].name  
        }).length;
        
      });
      
      this.placesList = offerList;
      
      
    },
    
    checkAuth: function (data) {
      
      if (this.$cookies.get("accessToken")) {  
//        console.log(this.$cookies.get("accessToken"))
        
        let that = this;
        
        axios({
          method: 'get',
          url: '/auth/check',
          params: {
            token: this.$cookies.get("accessToken")
          },
        }).then(function (r) { 
          if (!r.data.expired) that.logged = true;
          else {
            that.$cookies.remove("refreshToken")
            that.$cookies.remove("accessToken")  
          }
          
//          that.createOrder(data)
          
        })
        .catch(function (error) {
          console.log(error);
          that.$cookies.remove("refreshToken")
          that.$cookies.remove("accessToken")
          
//          that.createOrder(data)
        });    
      } 
      this.createOrder(data)  
      
    },
    createOrder: function (data) {
      let that = this;
      axios({
        method: 'post',
        url: '/order/create',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        console.log('OK'); 
        
//        console.log(response.data.data[1].second)
        
        if (that.logged) {
          that.processOrderCreatedByAdmin(that.payment.price, response.data.data[1].second)
//          that.$router.push('/admin/orders/edit/' + response.data.data[1].second);   
          return;
        }
        
        that.$router.push('/order/' + that.id + '/' + that.dateid + '/stage-3'); 
        
        that.order.id = response.data.data[1].second
//        that.order.form = response.data.data[0].second
        let formText = response.data.data[0].second.substr(0, 5) + ' id="paymentform" ' + response.data.data[0].second.substr(5);
        that.order.form = formText; 
        
      }).catch(function (error) {
        console.log(error);
        that.initStage1();
      });         
    },
    processOrderCreatedByAdmin: function (cash, orderId) {
      
      if (this.logged) {
          this.$router.push('/admin/orders/edit/' + orderId);   
        }
      
//      let that = this;
//      
//      let data = new FormData();
//      
//      data.append('cash', cash);
//      data.append('id', orderId);
//      
//      axios({
//        method: 'post',
//        url: '/order/deposit',
//        data: data,
//        headers: {
//          'Content-Type': 'multipart/form-data'
//        }
//      }).then(function (response) {
//        console.log('OK'); 
//        
//        if (that.logged) {
//          that.$router.push('/admin/orders/edit/' + orderId);   
////          return;
//        }        
//      }).catch(function (error) {
//        console.log(error);
//      });  
    },
    isOnePrice: function () {
      
      if (this.date.offers.length == 1) {
        this.moreThanOnePrice = false
      } else {
        this.moreThanOnePrice = true  
      }
    },
    createEventLink: (item) => {    
      let result = ''
            
      if (item.urlName) result = '/' + item.urlName
      else result = '/' + item.id
        
      return result;
      
    }
  },
//  watch: {
//    personList: function () {
//      console.log(this.uniqueVariants);  
//    }  
//  },
  created: function () {
    this.getEvent()
    this.roomsList = event.roomsList()
//    this.addPerson();
      
  }
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/booking.sass" 
</style>
