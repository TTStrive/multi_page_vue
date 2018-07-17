<template>
  <div id="app">
    <qk-header></qk-header>
    <h2>{{msg}}</h2>
  </div>
</template>

<script>
import qkHeader from "@/components/header.vue"
export default {
  name: 'App',
  data(){
    return {
      msg:"我是file页面"
    }
  },
  components:{
    qkHeader
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
