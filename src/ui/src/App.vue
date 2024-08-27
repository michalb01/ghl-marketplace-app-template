<template>
  <div class="hello">
    <label>Client ID</label><br>
    <input type="text" id="client_id"><br>
    <label>Client Secret</label><br>
    <input type="text" id="client_secret"><br>
    <button onclick="onClick()">Submit</button>
  </div>
</template>

<script>
var data;

function onClick() {
  console.log("Started onClick");
  var d = data;
  console.log("Got user data");
  var locationId = d.activeLocation;
  console.log("Got locationId")

  var xhr = new XMLHttpRequest();
  xhr.open("POST", `https://services.leadconnectorhq.com/payments/custom-provider/connect?locationId=${locationId}`, true);
  xhr.setRequestHeader('Accept', 'application/json');
}

export default {
  name: 'App',
  components: {},
  async mounted(){
    
    data = await window.ghl.getUserData();
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
