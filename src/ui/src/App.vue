<template>
  <div class="hello">
    <label>Client ID</label><br>
    <input type="text" id="client_id"><br>
    <label>Client Secret</label><br>
    <input type="text" id="client_secret"><br>
    <button @click="onClick">Submit</button>
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

      var client_id = document.getElementById("client_id").value;
      var client_secret = document.getElementById("client_secret");

      var xhr = new XMLHttpRequest();
      var params = JSON.stringify({
        "locationId": locationId,
        "client_id": client_id,
        "client_secret": client_secret
      });
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json.email + ", " + json.password);
        }
      };
      xhr.open("POST", `https://p24.onrender.com/payu-settings`, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send(params);

      console.log("POST sent!");
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
