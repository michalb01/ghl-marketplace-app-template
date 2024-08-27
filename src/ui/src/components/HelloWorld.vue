<template>
  <div>
    <label>Client ID</label><br>
    <input type="text" id="client_id">
    <label>Client Secret</label><br>
    <input type="text" id="client_secret">
    <button onclick="sendClient()">Submit</button>
  </div>
</template>

<script>

async function getUserData() {
    const key = await new Promise((resolve) => {
      window.parent.postMessage({ message: "REQUEST_USER_DATA" }, "*");
      window.addEventListener("message", ({ data }) => {
        if (data.message === "REQUEST_USER_DATA_RESPONSE") {
          resolve(data.payload)
        }
      });
    });
    const res = await fetch('/decrypt-sso', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({key})
      });
    const data = await res.json()
    return data
  }

async function sendClient() {
  var client_id = document.getElementById("client_id");
  var client_secret = document.getElementById("client_secret");

  var data = await getUserData();

  console.log("User data");
  console.log(data);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", `https://services.leadconnectorhq.com/payments/custom-provider/connect?locationId=${1}`)
}

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
