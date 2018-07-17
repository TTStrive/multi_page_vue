<template>
  <div id="app">
    <qk-header></qk-header>
    <h2>{{msg}}</h2>
    <a href="file.html">跳转</a>
  </div>
</template>

<script>
import qkHeader from "@/components/header.vue"
export default {
  name: 'App',
  data(){
    return {
      msg:"我是你大爷"
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
