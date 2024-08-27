<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <ClientForm />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import ClientForm from './components/ClientForm.vue' // Import the new component

export default {
  name: 'App',
  components: {
    HelloWorld,
    ClientForm // Register the new component
  },
  async mounted() {
    const data = await window.ghl.getUserData();
    console.log("user-details", data);
  }
}
</script>

<style scoped>
/* Optional CSS to style the form */
form {
  max-width: 400px;
  margin: auto;
}

div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
