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
export default {
  name: 'App',
  components: {},
  async mounted(){
    const data = await window.ghl.getUserData();
    console.log("user-details", data)
  },
  methods: {
    async onClick() {
      console.log("Started onClick");
      var d = await window.ghl.getUserData();
      console.log("Got user data");
      var locationId = d.activeLocation;
      console.log("Got locationId")

      var xhr = new XMLHttpRequest();
      xhr.open("POST", `https://services.leadconnectorhq.com/payments/custom-provider/connect?locationId=${locationId}`, true);
      xhr.setRequestHeader('Accept', 'application/json');
    }
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
