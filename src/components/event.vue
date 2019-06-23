<template>
  <div class="view-wrapper">
    <header class="container-fluid header">
      <div class="header-inner">
        <div class="header-canvas-wrapper">
          <div class="container"> 
            <div class="row">
              <div class="col-md-3 col-md-offset-2">
                <canvas id="markerColorCanvas" class='header-canvas'></canvas>  
              </div> 
            </div>  
          </div>  
        </div>
        <img alt="" class="header-bg" v-bind:src="imgPath + activeHeaderImg" v-bind:class='activeHeaderAnimation' id='header-img-1'>
        <img alt="" class="header-bg header-bg-second" v-bind:src="imgPath + secondHeaderImg" v-bind:class='secondHeaderAnimation' v-if='event.headImg.length > 1'>
        <div class="header-text">
          <h1>{{ event.title }}</h1>
          <h4>{{ event.info }}</h4>
        </div> 
        <img src="../assets/img/safari-corner.png" alt="" class="header-corner corner-1"> 
        <img src="../assets/img/safari-corner.png" alt="" class="header-corner corner-2"> 
        <img src="../assets/img/safari-corner.png" alt="" class="header-corner corner-3"> 
        <img src="../assets/img/safari-corner.png" alt="" class="header-corner corner-4"> 
      </div>
      
    </header> 
    <!--  МНОГО ДНЕЙ  -->
    <section class="container date" v-if="daysVariant == 1">
      <div class="row mobile-border">
        <div class="col-md-2 date-block date-start">
          <h4 class='date-block__text'>Старт</h4>
          <h3 class='date-block__date'>{{ getDayMonth(date.startDate) }}</h3>
          <h4 class='date-block__time'>{{ getTime(date.startDate) }}</h4>
        </div>
        <div class="col-md-8 days">
          <div class="days-container mobile-hide">
            <div class="days-full">
              <div class="day" v-for="(item, index) in dateHalves.all" v-bind:key='index + "-all"'>{{item}}</div>
            </div>
          </div>
          <!--     FLEXBOX VARIANT     -->
<!--
          <div class="days-container mobile-show">
            <div class="days-half">
              <div class="day" v-for="(item, index) in dateHalves.first" v-bind:key='index + "-first"'>{{item}}</div>
            </div>
            <div class="days-half">
              <div class="day"  v-for="(item, index) in dateHalves.second" v-bind:key='index + "-second"'>{{item}}</div>
            </div>
          </div>
-->
          <!--     BOOTSTRAP VARIANT     -->
<!--
          <div class="days-container mobile-show container-fluid">
            <div class="row">
              <div class="col-xs-2 day-container" v-for="(item, index) in dateHalves.all" v-bind:key='index + "-mobile"'>
                <div class="day">{{item}}</div>  
              </div>
            </div>
          </div>
          <div class="days-line__container">
            <div class="days-line mobile-hide" id='desktop-line'></div>
            <div class="days-line mobile-show"></div>
          </div>
-->
          
          <!--     BOOTSTRAP VARIANT 2    -->
          <div class="days-container mobile-show container-fluid">
            <div class="row">
              <div class="col-xs-2 day-container" v-for="(item, index) in dateHalves.first" v-bind:key='index + "-mobile"' :class='dateClass(dateHalves.classFirst, index)'>
                <div class="day">{{item}}</div>  
              </div>
            </div>
            <div class="row" v-if='dateHalves.second.length > 0'>
              <div class="col-xs-2 day-container" v-for="(item, index) in dateHalves.second" v-bind:key='index + "-mobile"' :class='dateClass(dateHalves.classSecond, index)'>
                <div class="day">{{item}}</div>  
              </div>
            </div>
          </div>
          <div class="days-line__container">
            <div class="days-line mobile-hide" id='desktop-line'></div>
            <div class="days-line mobile-show"></div>
          </div>

        </div>
        <div class="col-md-2 date-block date-end">
          <h4 class='date-block__text'>Финиш</h4>
          <h3 class='date-block__date'>{{ getDayMonth(date.endDate) }}</h3>
          <h4 class='date-block__time'>{{ getTime(date.endDate) }}</h4>
        </div>
      </div>
    </section>

    <section class="container main" v-bind:class='{"margin-top": daysVariant != 1}'>
      <div class="row">
        <div class="col-md-4 col-sm-12 col-md-push-8 prices mobile-hide">
          <div class="prices-wrapper">
            <h3>Цены на тур</h3>
            <vector src="../assets/img/icons/wave.svg" alt="" class="prices-wave"></vector>
            <div class="prices-text" v-html='event.priceDisclaimer'>
              
            </div>
            <div class="prices-list">
              <div class="price" v-for="(item, index) in uniqueOffers" v-bind:key='index' v-if='date.offers.length > 1'>
                <div class="price-left">{{ getShortRoomName(item.name) }}</div>
                <div class="price-right">{{ getPrice(index) + ' ' + parseCurrency(item.currency) }}</div>
              </div>
              <div class="one-price" v-else>
                <div class="one-price__top">{{ getPrice(index) }}</div>
                <div class="one-price__bottom">{{ parseCurrency(date.offers[0].currency) }}</div>
              </div> 
            </div>
<!--            <button class="prices-button">Забронировать</button>-->
            <router-link v-bind:to="'/order/' + event.id + '/' + date.id" class='prices-button' v-if='event.bookable && date.places > 0'>Забронировать</router-link>
            <button class='prices-button disabled' v-if='event.bookable && date.places <= 0'>Забронировать</button>
            <div class="prices-text no-places" v-if='event.bookable && date.places <= 0'>
              Извините, но на это событие все места разобрали, как горячие пирожки
            </div>
          </div>
        </div>
        <div class="col-md-8 col-sm-12 col-md-pull-4 content-wrapper">
          <!-- ОДИН ДЕНЬ -->
          <div class="content-days days-variation__1" v-if="daysVariant == 2">
            <div class="content-days__block">
              <h3 class='content-days__header'>{{ getTime(date.startDate) }}</h3>
              <h4 class='content-days__text'>Старт</h4>
            </div>
            <div class="content-days__line-mobile"></div>
            <div class="content-days__block">
              <h3 class='content-days__header'>{{ getDayMonth(date.startDate) }}</h3>
              <h4 class='content-days__text'>Пятница</h4>
            </div>
            <div class="content-days__line-mobile"></div>
            <div class="content-days__block">
              <h3 class='content-days__header'>{{ getTime(date.endDate) }}</h3>
              <h4 class='content-days__text'>Финиш</h4>
            </div>
            <div class="content-days__line"></div>
          </div>
          <!-- ДВА ДНЯ -->
          <div class="content-days days-variation__2" v-if="daysVariant == 3">
            <div class="content-days__block">
              <h4 class='content-days__text'>Старт</h4>
              <h3 class='content-days__header'>{{ getDayMonth(date.startDate) }}</h3>
              <h4 class='content-days__text'>{{ getTime(date.startDate) }}</h4>
            </div>
            <div class="content-days__line-mobile"></div>
            <div class="content-days__block">
              <h4 class='content-days__text'>Финиш</h4>
              <h3 class='content-days__header'>{{ getDayMonth(date.endDate) }}</h3>
              <h4 class='content-days__text'>{{ getTime(date.endDate) }}</h4>
            </div>

            <div class="content-days__line"></div>
          </div>
          <!-- ТРИ ДНЯ -->
          <div class="content-days days-variation__3" v-if="daysVariant == 4">
            <div class="content-days__block">
              <h4 class='content-days__text'>Старт</h4>
              <h3 class='content-days__header'>{{ getDayMonth(date.startDate) }}</h3>
              <h4 class='content-days__text'>{{ getTime(date.startDate) }}</h4>
            </div>
            <div class="content-days__line-mobile"></div>
            <div class="content-days__block middle-block">
              <h4 class='content-days__text'> </h4>
              <h3 class='content-days__header'>{{ getDayMonth(getNextDay(date.startDate)) }}</h3>
              <h4 class='content-days__text'>{{ getDayName(getNextDay(date.startDate)) }}</h4>
            </div>
            <div class="content-days__line-mobile"></div>
            <div class="content-days__block">
              <h4 class='content-days__text'>Финиш</h4>
              <h3 class='content-days__header'>{{ getDayMonth(date.endDate) }}</h3>
              <h4 class='content-days__text'>{{ getTime(date.endDate) }}</h4>
            </div>

            <div class="content-days__line"></div>
          </div>

          <div class="content-container">
            <div class="content-header">
              <ul class="content-header__list" id='detect-height'>
                <span class="list-item__wrapper" v-for="(item, index) in event.content" v-bind:key='index' @click='changeActiveContent(index)'>
                  <li class='list-item' v-bind:class="{ active: index == activeContent }">
                    {{item.first}}
<!--                    <vector src="../assets/img/icons/event-triangle.svg" alt="" class="list-item__marker svg"></vector>-->
                  </li>
                  <li class="divider"></li>  
                </span>
                <span class="list-item__wrapper" v-if="event.photos.length > 0" @click='changeActiveContent(event.content.length)'>
                  <li class='list-item' v-bind:class="{ active: photosPageActive }">
                    Фото
<!--                    <vector src="../assets/img/icons/event-triangle.svg" alt="" class="list-item__marker svg"></vector>-->
                  </li>
                  <li class="divider"></li>  
                </span>
              </ul>
            </div>
            <div class="content" v-if='activeContent < event.content.length' v-html="event.content[activeContent].second">
            </div>
            <div class="content content-photos" v-else>
              <div class="container-fluid">
<!--
                <div class="row">
                  <div class="col-xs-6 event-photo" v-for="(photo, index) in event.photos" v-bind:key='index'>
                    <img v-bind:src="imgPath + photo" alt="">
                  </div>
                </div>
-->
                <vue-picture-swipe :items="galImages" :galleryType='type'></vue-picture-swipe>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4 col-sm-12 col-md-push-8 prices mobile-show">
          <div class="prices-wrapper">
            <h3>Цены на тур</h3>
            <vector src="../assets/img/icons/wave.svg" alt="" class="prices-wave"></vector>
            <div class="prices-text" v-html='event.priceDisclaimer'>
<!--              В данном туре, цена зависит от того, в какой номер вы хотите заселиться. Ниже указана цена за <span>1 место</span> в номере.-->
            </div>
            <div class="prices-list">
              <div class="price" v-for="(item, index) in uniqueOffers" v-bind:key='index' v-if='date.offers.length > 1'>
                <div class="price-left">{{ getShortRoomName(item.name) }}</div>
                <div class="price-right">{{ getPrice(index) + ' ' + parseCurrency(item.currency) }}</div>
              </div>
              <div class="one-price" v-else>
                <div class="one-price__top">{{ getPrice(index) }}</div>
                <div class="one-price__bottom">{{ parseCurrency(date.offers[0].currency) }}</div>
              </div> 
            </div>
<!--            <button class="prices-button">Забронировать</button>-->
            <router-link v-bind:to="'/order/' + event.id + '/' + date.id" class='prices-button' v-if='event.bookable && date.places > 0'>Забронировать</router-link>
            <button class='prices-button disabled' v-if='event.bookable && date.places <= 0'>Забронировать</button>
            <div class="prices-text no-places" v-if='event.bookable && date.places <= 0'>
              Извините, но на это событие все места разобрали, как горячие пирожки
            </div>
          </div>
        </div>
      </div>
    </section>
    <mobile-social></mobile-social>  
    <div class="event-footer-wrapper">
      <custom-footer></custom-footer>  
      <!--    CURATOR    -->
      <div class="helper" v-if='event.curator.name.length > 0' :class='{"helper-hidden": helperHidden}'>
        <div class="helper-text" v-if='helperVisible'>
          Привет, я <span>{{event.curator.name}}</span>, звоните мне <a v-bind:href="'tel:' + event.curator.phone">{{event.curator.phone}}</a>, я запишу вас на событие и отвечу на любые вопросы.
        </div>
        <div class="close-button" v-on:click='toggleHelper(false)' v-if='helperVisible'></div>
        <vector src="../assets/img/icons/close.svg" class="svg helper-close" v-if='helperVisible'></vector>
        <vector src="../assets/img/icons/helper-triangle.svg" alt="" class="svg helper-marker" v-if='helperVisible'></vector>
        <img v-bind:src="imgPath + event.curator.photo" alt="" class="helper-avatar" @click='toggleHelper(false)'>
      </div>
    </div>
    
    <div class="helper helper-mobile" v-if='event.curator.name.length > 0' :class='{"helper-hidden": helperMobileHidden}'>
      <div class="helper-text" v-if='helperMobileVisible'>
<!--        Привет, я <span>{{event.curator.name}}</span>, -->
        Звоните мне по телефону <a v-bind:href="'tel:' + event.curator.phone">{{event.curator.phone}}</a>, я запишу вас на событие и отвечу на любые вопросы.
      </div>
      <div class="close-button" v-on:click='toggleHelper(true)' v-if='helperMobileVisible'></div>
      <vector src="../assets/img/icons/close.svg" class="svg helper-close" v-if='helperMobileVisible'></vector>
      <vector src="../assets/img/icons/helper-triangle.svg" alt="" class="svg helper-marker" v-if='helperMobileVisible'></vector>
      <img v-bind:src="imgPath + event.curator.photo" alt="" class="helper-avatar" @click='toggleHelper(true)'>
    </div>
  </div> 
</template>

<script>
import axios from '../lib/axios.js'
 
  
//import rgbaster from 'rgbaster'
//import vibrant from 'brennan-node-vibrant'
  
import mobileSocial from './mobileSocial'
import zapFooter from './footer'
  
import util from '../lib/util'
import event from '../lib/eventlib'

  


export default {
  name: 'eventPageComponent',
  props: ['id', 'dateid', 'folder1', 'folder2', 'folder3', 'folder4'],
  data () {
    return {
      event: {
        photos: [],
        content: [],
        headImg: [],
        curator: {
          name: '',
          phone: '',
          photo: ''
        },
        priceDisclaimer: ''
      },
      helperVisible: true,
      helperMobileVisible: true,
      helperHidden: true,
      helperMobileHidden: true,
      date: {
        endDate: Date.now(),
        hasFreePlaces: false,
        id: '',
        offers:[{
          offerTypes:[]
        }],
        startDate: Date.now(),
      },
      dateHalves:{
        first: [],
        second: [],
        all: [],
        classFirst: '',
        classSecond: ''
      },
      activeContent: 0,
      photosPageActive: false,
      activeHeaderImg: '',
      secondHeaderImg: '',
      activeHeaderAnimation: '',
      secondHeaderAnimation: '',
      imgPath: 'https://avant-2.herokuapp.com/api/file/get?file=',
      daysVariant: 1,
      galImages: [
        {
          src: '',
          thumbnail: '',
          w: 0,
          h: 0
        }
      ],
      type: 'event',
      safariDetected: false,
      lineWidth: 0,
      lineTimer: null,
      roomsList: []
    }
  },
  metaInfo() {
    return {
      title: this.event.title,
      meta: [
        { vmid: 'description', name: 'description', content: this.event.info }
      ]
    }
  },
  computed: {
    screenWidth: () => {
      return window.screen.width;
    },
    uniqueOffers: function () {
      let result = [];
            
      this.date.offers.forEach(e => {
        
        if (result.length > 0) {
          let res = result.filter(r => this.getShortRoomName(r.name) === this.getShortRoomName(e.name))
          
          console.log('res ', res)
          
          if (res.length <= 0) {
            result.push(e)  
          }
        } else {
          result.push(e)
        }
      })
      
      return result
    }
  },
  methods: {
    getEvent: function () {
      let that = this;
      
      let eventLink = '';
      let eventLinkArr = [];
      
      if (this.folder1) eventLinkArr.push(this.folder1);
      if (this.folder2) eventLinkArr.push(this.folder2);
      if (this.folder3) eventLinkArr.push(this.folder3);
      if (this.folder4) eventLinkArr.push(this.folder4);
      
      if (eventLinkArr.length > 0) {
        eventLinkArr.forEach(e => {
          eventLink += e + '/';  
        })  
      }

      eventLink += this.id;

      console.log(eventLink)
      axios({
        method: 'get',
        url: '/event/url',
        params: {
          name: eventLink
        }
      })
      .then(function (response) {
        console.log('get event by url ok');
        that.handleGetEvent(response.data.data)
      })
      .catch(function (error) {
        console.log(error);
        
        axios({
          method: 'get',
          url: '/event/' + that.id,
        })
        .then(function (response) {
          that.handleGetEvent(response.data.data)
        })
        .catch(function (error) {
          console.log(error);
        });  
      });   
      
//      axios({
//        method: 'get',
//        url: '/event/' + that.id,
//      })
//      .then(function (response) {
//        that.handleGetEvent(response.data.data)
//      })
//      .catch(function (error) {
//        console.log(error);
//      });      
    },
    handleGetEvent: function (data) {
      
//      if (!data.id && !data.title && !data.dates) console.log(data.headImg[0])
      
      this.event = data
      this.activeHeaderImg = this.event.headImg[0]
      if (this.event.headImg.length > 1) {
        this.initAnimation()  
      }
        
      this.date = this.event.date
//      this.date = event.findDate(this.dateid, this.event.dates)
        
      this.chooseDateVariant(this.daysBetweeen(this.date.startDate, this.date.endDate));
        
      this.galImages = [];
      
      let that = this;
        
      this.event.photos.forEach(e => {
        let img = new Image();
        let x;
        let y;
        img.onload = function() {
          x = this.height  
          y = this.width  
            
          console.log(x, y);
          that.galImages.push({
            src: that.imgPath + e,
            thumbnail: that.imgPath + e, 
            w: y,
            h: x
          });
        }
        img.src = this.imgPath + e;
          
      });
      
    },
    toggleHelper: function (mobile) {
      console.log('a');
      if (mobile) this.helperMobileVisible = !this.helperMobileVisible  
      else this.helperVisible = !this.helperVisible  
      
      console.log(this.helperMobileVisible, this.helperVisible);
    },
    changeActiveContent: function (index) {
      this.activeContent = index
      if (index >= this.event.content.length) {
        this.photosPageActive = true;  
      } else {
        this.photosPageActive = false;   
      }
    },
    daysBetweeen: function (a, b) {      
//      let date1 = new Date(a);
//      let date2 = new Date(b);
      
      let date1 = this.getStartOfTheDay(util.createTimezoneDate(a).getTime()); 
      let date2 = this.getStartOfTheDay(util.createTimezoneDate(b).getTime()); 
            
      console.log(date1);
      console.log(date2);
      
      // The number of milliseconds in one day
      var ONE_DAY = 1000 * 60 * 60 * 24

      // Convert both dates to milliseconds
      var date1_ms = date1.getTime()
      var date2_ms = date2.getTime()

      // Calculate the difference in milliseconds
      var difference_ms = Math.abs(date1_ms - date2_ms)
      
      console.log('dif=' + difference_ms);

      // Convert back to days and return
      return Math.floor(difference_ms/ONE_DAY) - 1
//      return Math.round(difference_ms/ONE_DAY) - 1
    },
    chooseDateVariant: function (daysCount) {   
      console.log('days between ' + daysCount);
      
      if (daysCount == 0) {
        
        this.daysVariant = 3  
        
      } else if (daysCount == -1) {
        
        this.daysVariant = 2 
        
      } else if (daysCount == 1) {
        
        this.daysVariant = 4  
        
      } else if (daysCount > 1) {
        
        this.daysVariant = 1  
        this.getDateHalves(daysCount)
        
      }     
    },
    getDayMonth: function (date) {      
//      let d = new Date(date);
//      d.setHours(d.getHours() - 1);
      let d = util.createTimezoneDate(date); 
      
      let day = d.getDate();
      
      let month = util.getMonthNameVar2(d.getMonth() + 1)
      
      return day + ' ' + month;
    },
    getDayName: function (date) {      
//      let d = new Date(date);
//      d.setHours(d.getHours() - 1);
      let d = util.createTimezoneDate(date); 
      
      let day = util.getDayName(d.getDay());
      
      return day;
    },
    getTime: function (date) {      
//      let d = new Date(date);
//      d.setHours(d.getHours() - 1);
      let d = util.createTimezoneDate(date); 
      
      let hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      
      return hours + ':' + minutes;
    },
    getNextDay: function (date) {      
//      let tomorrow = new Date(date);
//      tomorrow.setHours(tomorrow.getHours() - 1);
      let tomorrow = util.createTimezoneDate(date); 
      
      tomorrow.setDate(tomorrow.getDate() + 1);

      return tomorrow;
    },
    getDateHalves: function (daysCount) {  
      let start = new Date(this.date.startDate);
      let end = new Date(this.date.endDate);
      
      let date = this.getNextDay(new Date(this.date.startDate));
      
      let daysArr = [];
      
      let daysCountTemp = daysCount

      while (daysCountTemp > 0) {
        console.log(daysCountTemp);
        
        daysArr.push('' + date.getDate());    
        
        date = this.getNextDay(date);
        
        daysCountTemp--;
      } 
      
      let limit = 6;
      
      if (daysCount > 6) {   
        limit = Math.ceil(daysArr.length / 2)
        console.log('days > 6, limit = ' + limit);
      }
       
      this.dateHalves.first = daysArr.splice(0, limit)
      this.dateHalves.second = daysArr
      this.dateHalves.all = this.dateHalves.first.concat(this.dateHalves.second) 
      
      this.getDateHalvesOffsets();
      
      this.lineTimer = setInterval(this.daysLineStuff, 500);
      this.daysLineStuff()
    },
    getDateHalvesOffsets: function () {
      
      let first = 6 - this.dateHalves.first.length
      let second = 6 - this.dateHalves.second.length   
      this.dateHalves.classFirst = 'col-xs-offset-' + first
      this.dateHalves.classSecond = 'col-xs-offset-' + second
    },
    dateClass: (val, index) => {
      let result = {}
      
      result[val] = index == 0;
      
      return result;
    },
    getPrice: function (offerIndex) {
      if (this.date.id.length > 0) {
        
        let offer = this.date.offers[offerIndex]; 
        let price = offer.offerTypes.filter(e => e.type === 'Обычный')[0];

        return price.price;  
      }
      
    },
    parseCurrency: function (cur) {
      switch (cur) {
        case 'UAH': return 'грн'
        case 'USD': return 'дол.'
        case 'EUR': return 'евро'
      }  
      return 0
    },
    initAnimation: function () {
      let activeImgIndex = 0;
      let secondImgIndex = 1;
      let maxImgIndex = this.event.headImg.length - 1;
      
      
      // PRELOADING ALL IMAGES
      let imagesArray = [];
      
      this.event.headImg.forEach(e => {
        imagesArray.push(new Image())  
        imagesArray[imagesArray.length - 1].src = this.imgPath + e;
      });    
      
      let animations = [
        'animation-expand',
        'animation-move-left',
        'animation-move-right',
      ]
      
      let nextAnimation = animations[Math.floor(Math.random() * animations.length)];
      
      let that = this;
      
      this.activeHeaderAnimation = animations[0];
      
      const listenerEnd = function () {
        let currentAnimation = that.activeHeaderAnimation;
      
        if (that.activeHeaderAnimation.indexOf('animation-fade-out') >= 0) {          
          activeImgIndex++;
          secondImgIndex++;
        
          if (activeImgIndex > maxImgIndex) {
            activeImgIndex = 0;
          }
          
          if (secondImgIndex > maxImgIndex) {
            secondImgIndex = 0;
          }

          that.activeHeaderAnimation = nextAnimation;  
          that.activeHeaderImg = that.event.headImg[activeImgIndex]  
        } else {          
          while (nextAnimation == currentAnimation) {
            nextAnimation = animations[Math.floor(Math.random() * animations.length)]  
          }
          
          that.secondHeaderAnimation = nextAnimation + '-start'
          that.secondHeaderImg = that.event.headImg[secondImgIndex]  

          that.activeHeaderAnimation += '-end animation-fade-out';  
        }       
      };
      
      let element = document.getElementById("header-img-1");
      element.addEventListener("animationend", listenerEnd, false);

    },
    safariStuff: function () {
      if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
//        alert('Its Safari');
        this.safariDetected = true;
      }  
    },
    daysLineStuff: function () {
      let elements = document.querySelectorAll('.days-full .day')
      
      if (elements.length <= 0) return;
      
      let x = elements[0];
      let y = elements[elements.length - 1];

      let distX = y.offsetLeft - x.offsetLeft;
      let distY = y.offsetTop - x.offsetTop;
      
      let distance = Math.sqrt(distX*distX + distY*distY);
   
      this.lineWidth = Math.floor(distance)
      
      let a = this.lineWidth + 'px'
      console.log(a);
      
      document.getElementById('desktop-line').style.width = a;
      
      clearInterval(this.lineTimer);
      this.lineTimer = null;
    },
    getStartOfTheDay: (timestamp) => {
      let d = new Date(timestamp);
      d.setHours(0,0,0,0)
      return d;
    },
    getEndOfTheDay: (timestamp) => {
      let d = new Date(timestamp);
      
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      
      let result = new Date(year, month, day, 23, 59);
      return result
    },
    handleScroll: function () {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight / 2) {
        this.helperMobileHidden = false
      } else {
        this.helperMobileHidden = true  
      }
      
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        this.helperHidden = false
      } else {
        this.helperHidden = true  
      }
    },
    getShortRoomName: function (name) {
      let room = this.roomsList.filter(e => e.name === name)[0]  
      
      if (room) return room.alias
      
      return name

    }
  },    
  components: {
    mobileSocial: mobileSocial,
    customFooter: zapFooter
  },
  mounted: function () {
    this.getEvent(); 
    this.safariStuff()
    
    
    // canvas stuff
//    let canvas = document.getElementById('markerColorCanvas');
//    let width = canvas.style.width;
//    
//    console.log('canvas = ' + width);
//    
//    var ctx = canvas.getContext("2d");
//    
//    var imgData = ctx.getImageData(0,0,width,2);
//    
//    console.log(imgData)
    
    
    
    
  },
  created: function () {

//    this.daysLineStuff()
    window.addEventListener('scroll', this.handleScroll);
    this.roomsList = event.roomsList()
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },
  
}

</script>

<style lang="sass" scoped>
  @import "../assets/sass/event.sass" 
  @import "../assets/sass/animation.sass" 
</style>

