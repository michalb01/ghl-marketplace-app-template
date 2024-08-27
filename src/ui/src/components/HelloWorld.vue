<template>
  <div class="hello">
    <label>Client ID</label><br>
    <input type="text" id="client_id">
    <label>Client Secret</label><br>
    <input type="text" id="client_secret">
    <button onclick="">Submit</button>
  </div>
</template>

<script>
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
