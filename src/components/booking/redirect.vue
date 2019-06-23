<template>

  <div>
    <h2>
      Идет перенаправление
    </h2>
    <div class='payment-form' v-html='form'>
    </div>
  </div>

</template>

<script>

//import contact from './contact'
import axios from '../../lib/axios.js'
 
  
export default {
  name: 'paymentRedirectComponent',
  props: {
    'id': {
      type: String,
    },
//    'dateid': {
//      type: String,
//    },
//    'comment': {
//      type: String,
//    },
//    'date': {
//      type: Object,
//    },
//    'stage2': {
//      type: Boolean,
//    },
//    'order': {
//      type: Object,
//    }
  },
  data () {
    return {
      form: ''
    }
  },
//  computed: {
//    
//  },
  methods: {
    getPaymentForm: function () {
      let that = this;
      
      axios({
        method: 'get',
        url: '/order/request',
        params: { 
          orderId: this.id
        }
      })
        .then(function (response) {
//          console.log(response.data.data[0].second); 
//          that.$emit('payment-submit');
          let formSplit = response.data.data[0].second.split('post" action');
          
          let formHTML = formSplit[0] + 'post" id="paymentform" action' + formSplit[1]
//          console.log(formHTML);
          that.form = formHTML; 
        
          
          
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          that.submitForm();
        })
    },
    submitForm() {
      document.getElementById("paymentform").submit();  
    }
    
  },
  mounted: function () {
    this.getPaymentForm()    
  }
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/booking.sass" 
</style>
