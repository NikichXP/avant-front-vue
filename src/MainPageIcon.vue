<template>
    <span v-html="content" />
</template>
<script>
import axios from './lib/axios.js'
  //'Access-Control-Allow-Origin': '*',
export default {
    props: {
        src: {
            type: String,
            required: true,
        }
    },
    data() {
        return {content: ''};
    },
    watch: {
        src: {
            immediate: true,
            handler(src) {
                axios({
                  method: 'get',
                  url: src,
                  headers: {
                    'Content-Type': 'text/plain'
                  }
                }).then((response) => this.content = response.data);
            }
        }
    },
} 
</script>
<style lang="sass">

.list-item__icon
  text-align: center
  height: 45px
  .svg svg
    width: 30px
    height: 30px
    vertical-align: middle
    margin: auto
    line-height: 42px
    margin-top: -10px
  .svg > *
    transition: 0.2s
    fill: #4e4a49
  @media screen and (max-width: 1200px) 
    padding-top: 20px

</style>