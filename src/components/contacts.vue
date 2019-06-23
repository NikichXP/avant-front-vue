<template>
  <div class="view-wrapper">
    <div class="logo-mobile">
      <img src="../assets/img/logo-1.png" alt="">
    </div>

    <section class="container contacts">
      <h2 class="contact-header">
        ЖДЕМ В ГОСТИ
      </h2>
      <div class="row">
        <div class="col-md-5 col-sm-6 col-md-offset-1 contact-phone">
          <vector src="../assets/img/icons/phone.svg" class="contact-icon"></vector>
          <div class="contact-text">
            С любыми вопросами можно обращаться с 10:00 <br> до 21:00 ежедневно по телефону:
          </div>
          <a href='tel:+38 (063) 212-55-66'>
            +38 (063) 212-55-66
          </a>
        </div>
        <div class="col-md-5 col-sm-6 contact-map">
          <vector src="../assets/img/icons/map.svg" class="contact-icon"></vector> 
          <div class="contact-text">
            Заходите к нам в офис в Одессе, возле горсада <br> по будням 13:00 до 19:00 по адресу:
          </div>
          <a href='https://goo.gl/maps/5f2Pmg985L42'>
            Дворянская, 5
          </a>
        </div>
      </div>
      <div class="row">
        <div class="col-md-10 col-md-offset-1 map">
<!--          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2747.0846779475837!2d30.728139115591926!3d46.486635679126394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c63195936dee9b%3A0x9d5555c8819a1fbe!2z0LLRg9C70LjRhtGPINCU0LLQvtGA0Y_QvdGB0YzQutCwLCA1LCDQntC00LXRgdCwLCDQntC00LXRgdGM0LrQsCDQvtCx0LvQsNGB0YLRjCwgNjUwMDA!5e0!3m2!1sru!2sua!4v1516895107331" frameborder="0" style="border:0" allowfullscreen></iframe>-->
        
          <GmapMap
            style="width: 100%; height: 100%;"
            :center="{lat:46.486636, lng:30.730328}"
            :zoom="16"
            map-type-id="terrain"
            v-bind:options="mapStyle"
          >
            <GmapMarker
              :position="{lat:46.486636, lng:30.730328}"
              :clickable="true"
              :draggable="true"
              @click="center={lat:46.486636, lng:30.730328}"
            />
          </GmapMap>
        </div>
      </div>
    </section>
    <mobile-social></mobile-social>
    <custom-footer></custom-footer>
  </div>
</template>

<script>
import mobileSocial from './mobileSocial'
import zapFooter from './footer'
export default {
  name: 'infoComponent',
  data () {
    return {
      mapStyle: {
        styles: [
      {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#f3f4f4"
              },
              {
                  "saturation": -84
              },
              {
                  "lightness": 59
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#ffffff"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 100
              },
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "landscape.man_made",
          "elementType": "geometry",
          "stylers": [
              {
                  "lightness": "37"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
              {
                  "saturation": "33"
              },
              {
                  "lightness": "83"
              },
              {
                  "visibility": "on"
              },
              {
                  "gamma": "0.33"
              },
              {
                  "color": "#e0f2ba"
              }
          ]
      },
      {
          "featureType": "poi.school",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#d7e4e4"
              },
              {
                  "saturation": -60
              },
              {
                  "lightness": 23
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffffff"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 100
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#bbbbbb"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 26
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffcc00"
              },
              {
                  "saturation": 100
              },
              {
                  "lightness": -22
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffcc00"
              },
              {
                  "saturation": 100
              },
              {
                  "lightness": -35
              },
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "saturation": "55"
              },
              {
                  "lightness": "-9"
              },
              {
                  "color": "#faf4d8"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#00a9ff"
              },
              {
                  "saturation": 55
              },
              {
                  "lightness": -6
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#7fc8ed"
              },
              {
                  "saturation": 55
              },
              {
                  "lightness": -6
              },
              {
                  "visibility": "off"
              }
          ]
      }
  ]
      }

    }
  },
  metaInfo() {
    return {
      title: 'Авантюристы - контакты',
      meta: [
        { vmid: 'description', name: 'description', content: 'Наши контакты' }
      ]
    }
  },
//  computed: {
//    
//  },
//  methods: {
//    
//  }
  components: {
    mobileSocial: mobileSocial,
    customFooter: zapFooter,
  },
  mounted: function () {
    
      
  }
}

</script>

<style lang="sass" scoped>
  @import "../assets/sass/contacts.sass" 
  @import "../assets/sass/nav-additional.sass"  
</style>

