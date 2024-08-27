<template>
  <div class="hello">
    <label>Client ID</label><br>
    <input type="text" id="client_id"><br>
    <label>Client Secret</label><br>
    <input type="text" id="client_secret"><br>
    <button onclick="">Submit</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  async mounted(){
    
    const data = await window.ghl.getUserData();
    console.log("user-details", data)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
