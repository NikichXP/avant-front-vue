<template>
  <div class="view-wrapper">
    <header class="header" :style="{height: header + 'px'}" v-if='$route.path.indexOf("events") < 0'>
      <img alt="" class='header-image' src="../assets/img/main-screen-gif-no-loop.gif"> 
    </header>
    <section class="container hot" id='hot-scroll'>
      <vector src="../assets/img/icons/hot.svg" class='hot-icon'></vector>
      <h2 class="hot-header">
        горячие события
      </h2> 

      <div class="row hot-list">
<!--        <router-link v-for="(item) in closestEventsList" v-bind:key='"closest-" + item.id + item.dateId' v-bind:to="'/' + item.id + '/' + item.dateId">-->
        <router-link v-for="(item) in closestEventsList" v-bind:key='"closest-" + item.id + item.dateId' v-bind:to="createEventLink(item)">
          <div class="col-md-4 hot-item">
            <div class="hot-img">
              <img v-bind:src="imgPath + item.headImg" alt="">  
            </div>
            <h5 class="hot-date">{{ dateWithMonthName(item.date, 2) }}</h5>
            <h4 class="hot-name">{{ item.name }}</h4>
          </div>
        </router-link> 
      </div>
    </section>
    
    <section class="container list mobile-show">
      <div class="list-section__wrapper" v-for="(month) in monthlyEventsList" v-bind:key='month.month'>
        <div class="row list-header">
          <h3 class="col-md-3 col-md-offset-1">{{ dateWithMonthName(month.month, 3) }}</h3>
        </div>
        <div class="row list-item" v-for="(event) in month.list" v-bind:key='event.month'>
<!--          <router-link v-bind:to="'/' + event.id + '/' + event.dateId">-->
          <router-link v-bind:to="createEventLink(event)">
            <div class="col-md-12">
              <div class="mobile-list-item-wrapper">
                <img v-bind:src="imgPath + event.img" alt="" class="mobile-list-photo"> 
                <div class="mobile-list-content">
                  <h4 class="mobile-list-name">{{ event.name }}</h4> 
                  <h5 class="mobile-list-date">
                    <ul>
                      <li>{{ dateWithMonthName(event.date, 2) }}</li>
                      <li>&#8226;</li>
                      <li>{{ getWeekDayName(event.date, true) }}</li>
                      <li>&#8226;</li>
                      <li>{{ getTime(event.date)}}</li>
                    </ul>
                  </h5>  
                </div>
              </div> 
            </div>
          </router-link>
        </div>
      </div>
    </section> 

    <section class="container list mobile-hide">
      <div class="list-section__wrapper" v-for="(month) in monthlyEventsList" v-bind:key='month.month'>
        <div class="row list-header">
          <h3 class="col-md-3 col-md-offset-1">{{ dateWithMonthName(month.month, 3) }}</h3>
        </div>
        <div class="row list-item" v-for="(event) in month.list" v-bind:key='event.month'>
          <router-link v-bind:to="createEventLink(event)">
            <div class="col-sm-2 col-xs-3  col-sm-offset-1 list-item__date">
              <div class="weekday">{{ getWeekDayName(event.date) }}</div>
              <div class="date">{{ getDay(event.date) }}</div>
              <div class="month">{{ dateWithMonthName(event.date, 4) }}</div>
            </div>
            <div class="col-lg-1 col-md-1 hidden-sm hidden-xs list-item__icon">
              <vector src="../assets/img/icons/event-icon-1.svg" alt="" class='svg svg-index' v-if='event.icon == null'></vector>
<!--              <img v-bind:src="imgPath + event.icon" alt="" class='svg svg-index svg-event-icon' v-else v-bind:id='"event-icon-" + event.id'>-->
              <mp-icon v-bind:src="imgPath + event.icon" alt="" class='svg svg-index svg-event-icon' v-else v-bind:id='"event-icon-" + event.id'></mp-icon>
            </div>
            <div class="col-md-7 col-sm-8 list-item__name">
              {{ event.name }}
            </div>
          </router-link>
        </div>
      </div>
    </section>
<!--    <contact></contact>-->
    <mobile-social></mobile-social>    
    <custom-footer></custom-footer>
  </div> 
</template>

<script>
import axios from '../lib/axios.js'
//import VueScrollTo from 'vue-scrollto';
 
  
import mobileSocial from './mobileSocial'
import zapFooter from './footer'
import contact from './contact'
  
import util from '../lib/util'
import event from '../lib/eventlib'
  

 
//const scrollOptions = {
//    container: 'body',
//    easing: 'ease-in',
//    offset: 0,
//    cancelable: true,
//    onStart: function(element) {
//      console.log('scroll start');
//    },
//    onDone: function(element) {
//      console.log('scroll done');
//    },
//    onCancel: function() {
//      console.log('scroll stop');
//    },
//    x: false,
//    y: true
//}
  


export default {
  name: 'eventsComponent',
  data () {
    return {
      closestEventsList: [],
      monthlyEventsList: [],
      imgPath: 'https://avant-2.herokuapp.com/api/file/get?file=',
      header: 800,
      minHeader: 650,
      maxHeader: 1000,
      lastScrollPos: 0,
      scrollActive: false,
      scroll: null,
      scrollOptions: {
        container: 'body',
        easing: 'ease-in',
        offset: 0,
        cancelable: true,
        onStart: function(element) {
          console.log('scroll start');
          
          var keys = {37: 1, 38: 1, 39: 1, 40: 1};

          function preventDefault(e) {
            e = e || window.event;
            console.log('wtf');
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;  
          }
          function preventDefaultForScrollKeys(e) {
              if (keys[e.keyCode]) {
                  preventDefault(e);
                  return false;
              }
          }
          function disableScroll () {
            console.log('scroll disabled');
            if (window.addEventListener) // older FF
              window.addEventListener('DOMMouseScroll', preventDefault, false);
            window.onwheel = preventDefault; // modern standard
            window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
            window.ontouchmove  = preventDefault; // mobile
            document.onkeydown  = preventDefaultForScrollKeys;
          }
          
          disableScroll();
        },
        onDone: function(element) {
          console.log('scroll done');
          
          function preventDefault(e) {
            e = e || window.event;
            console.log('wtf');
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;  
          }

          function enableScroll () {
            console.log('scroll enabled');
            if (window.removeEventListener)
              window.removeEventListener('DOMMouseScroll', preventDefault, false);
            window.onmousewheel = document.onmousewheel = null; 
            window.onwheel = null; 
            window.ontouchmove = null;  
            document.onkeydown = null;  
          }
          
          enableScroll();
        },
        onCancel: function() {
          console.log('scroll stop');
          
          function preventDefault(e) {
            e = e || window.event;
            console.log('wtf');
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;  
          }
          
          function enableScroll () {
            console.log('scroll enabled');
            if (window.removeEventListener)
              window.removeEventListener('DOMMouseScroll', preventDefault, false);
            window.onmousewheel = document.onmousewheel = null; 
            window.onwheel = null; 
            window.ontouchmove = null;  
            document.onkeydown = null;  
          }
          
          enableScroll();
        },
        x: false,
        y: true
      },
    }
  },
  metaInfo() {
    return {
      title: 'Авантюристы',
      meta: [
        { vmid: 'description', name: 'description', content: 'Авантюристы - не совсем туристы' }
      ]
    }
  },
  methods: {
    getClosestEvents: function (count) {
      const that = this;
      
      axios({
        method: 'get',
        url: '/event/closest',
        params: {
          count: count
        },
      })
      .then(function (response) {
        let temp = response.data.data;
//        temp.forEach(e => {
//          if (e.dates.length > 0) {
//            e.dates = e.dates.sort((a, b) => { return a.startDateTimeStamp - b.startDateTimeStamp });  
//          }  
//        }) 
        
        let list = []
        
        temp.forEach(e => {
          let a = event.createClosestList(e);
          if (a.length > 0) list = list.concat(a) 
        }) 
          
        that.closestEventsList = list.sort((a, b) => { return a.date - b.date }).slice(0, 4);
        
 
      })
      .catch(function (error) {
        console.log(error);
      });
    },  
    getMonthlyEvents: function (month) {
      const that = this;
//      let d = new Date(month);
//      d.setHours(d.getHours() - 1);
      let d = util.createTimezoneDate(month);  
      
      axios({
        method: 'get',
        url: '/event/month',
        params: {
          month: month,
          page: 0,
          pageSize: 10000
        }
      })
      .then(function (response) {
        let temp = response.data.data;
        
        if (temp.length < 1) {
          return;
        }
        
        let result = {
          month: d.getTime(),
          list: []
        }
        
        temp.forEach(e => {
          result.list = result.list.concat(event.createEventsList(e, result.month));  
        })
        
        result.list = result.list.sort((a, b) => { return a.date - b.date });
        
        that.monthlyEventsList.push(result);
        that.monthlyEventsList = that.monthlyEventsList.sort((a, b) => { return a.month - b.month });
          
      })
      .catch(function (error) {
        console.log(error);
      });  
    }, 
    getAllEvents: function () {
      const that = this;
      
      axios({
        method: 'get',
        url: '/event/list',
        params: {
          page: 0,
          pageSize: 10000
        }
      })
      .then(function (response) {
        let temp = response.data.data;
        
        if (temp.length < 1) {
          return;
        }
        
//        temp = temp.sort((a, b) => { return a.date - b.date });
//        temp = temp.filter(e => e.visible).sort((a, b) => { return a.date - b.date });
        temp = temp.filter(e => e.visible)
        console.log(temp);
        
        let allEvents = []
        
        temp.forEach(e => {
          allEvents = allEvents.concat(event.createEventsList(e))
          
        });
        
        allEvents = allEvents.sort((a, b) => { return a.date - b.date });
        
        let today = util.createTimezoneDate(new Date().getTime()); 
        
//        let firstDate = new Date(allEvents[0].date);
        let firstDate = today;
        let lastDate = new Date(allEvents[allEvents.length-1].date);
        
        let monthsArray = event.createMonthsList(firstDate, lastDate);  
        

        that.monthlyEventsList = [];
        monthsArray.forEach(e => {
//          that.getMonthlyEvents(e);  
          let result = {
            month: e,
            list: []
          }
        
          temp.forEach(a => {
            
            result.list = result.list.concat(event.createEventsList(a, result.month));  
          })
          
          console.log('month');
          console.log(result.list);
          
        
          result.list = result.list
            .filter(e => e.date >= today)
            .sort((a, b) => { return a.date - b.date });
          
          console.log('month2');
          console.log(result.list);
        
          that.monthlyEventsList.push(result);
          that.monthlyEventsList = that.monthlyEventsList
            .filter(a => a.list.length > 0)
            .sort((a, b) => { return a.month - b.month });
          
        });
        console.log('monthly list')
        console.log(that.monthlyEventsList)
          
      })
      .catch(function (error) {
        console.log(error);
      });  
    }, 
    dateWithMonthName: (date, variant) => {
      let d = new Date(date);
      
      let result = d.getDate() + ' ';
      
      if (variant == 1) result += util.getMonthNameVar1(d.getMonth() + 1);
      if (variant == 2) {
        let temp = util.getMonthNameVar2(d.getMonth() + 1)
        result += temp.substr(0,1).toUpperCase() + temp.substr(1)
      }
      if (variant == 3) return util.getMonthNameVar1(d.getMonth() + 1);
      if (variant == 4) return util.getMonthNameVar2(d.getMonth() + 1);
      
      return result;
    },
    getWeekDayName: function (date, variant) {
      let d = new Date(date);
      if (variant) return util.getDayName(d.getDay());
      return ['пн','вт','ср','чт','пт','сб','вс'][d.getDay()];
    },
    getDay: function (date) {
      let d = new Date(date);
      return d.getDate();
    },
    getTime: function (date) {      
//      let d = new Date(date);
//      d.setHours(d.getHours() - 1);
      let d = util.createTimezoneDate(date); 
      
//      console.log(d.getHours());
      
      let hours = ('' + d.getHours()).length >= 2 ? d.getHours() : '0' + d.getHours();
      let minutes = ('' + d.getMinutes()).length >= 2 ? d.getMinutes() : '0' + d.getMinutes();
      
      return hours + ':' + minutes;
    },
    getEventsByMonth: function (count) {
      let d = new Date();
      let month = d.getMonth();
      let year = d.getFullYear();
      
      for (let i = 0; i < count; i++) {
        this.getMonthlyEvents(year + '-0' + (month + 1)); 
                
//        this.monthlyEventsList = this.monthlyEventsList.sort((a, b) => { return a.month > b.month });

        
        if (month + 1 >= 12) {
          month = 0;
          year++;
        } else {
          month++;
        }
      }
    },
    headerHeight: function () {

      this.header = window.innerHeight + 50
      
      this.minHeader = this.header - 300;
      this.maxHeader = this.header + 200;
      
      console.log('header = ' + this.header);
      console.log('minHeader = ' + this.minHeader);
      console.log('maxHeader = ' + this.maxHeader);
      
    },
    handleScroll: function () {
      var hotOffsetTop = this.getElementOffset(document.querySelectorAll('.hot')[0]).top;
      
      var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      
      if (this.lastScrollPos > scrollPos && scrollPos <= 50) {
        console.log('a');
        this.header = window.innerHeight + 50
        this.lastScrollPos = scrollPos;
        return;
      }
      
      if (this.lastScrollPos != 0 && scrollPos !=0 && scrollPos < hotOffsetTop) {
        
        let h = hotOffsetTop - scrollPos
                
        let difInPercent = Math.floor((h / 1200) * 100)

        let a =  (difInPercent * (this.maxHeader - this.minHeader)) / 100

        this.header = this.minHeader + a;   
        
      }
                  
      this.lastScrollPos = scrollPos;
      
    },
    getElementOffset: function (el) {
      var _x = 0;
      var _y = 0;
      while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
              _x += el.offsetLeft - el.scrollLeft;
              _y += el.offsetTop - el.scrollTop;
              el = el.offsetParent;
      }
      return { top: _y, left: _x };
    },
    createEventLink: (item) => {    
      let result = ''
            
      if (item.urlName) result = '/' + item.urlName
      else result = '/' + item.id
        
      return result;
      
    }
    
  },
  components: {
    mobileSocial: mobileSocial,
    customFooter: zapFooter,
    contact: contact
  },
  created: function () {
    this.getClosestEvents(3);
    
    
//    this.getEventsByMonth(3);
    this.getAllEvents();
    
    this.headerHeight();
    
    
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },
//  mounted: function () {
//    this.processSVG();  
//  }
}

</script>

<style lang="sass" scoped>
  @import "../assets/sass/index.sass" 
</style>

