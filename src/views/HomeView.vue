<template>
  <div class="app">
    <select-username @selectUsername="onSelectUsername" v-if="!usernameAlreadySelected" />
    <chat v-else />
  </div>
</template>

<script>
import Chat from '../components/Chat.vue'
import SelectUsername from '../components/SelectUsername.vue'
export default {
  name: 'App',
  components: { SelectUsername, Chat },
  data() {
    return { usernameAlreadySelected: false }
  },
  methods: {
    onSelectUsername(username) {
      this.usernameAlreadySelected = true
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

@font-face {
  font-family: Lato;
  src: '~/public/fonts/Lato-Regular.ttf';
}

#app {
  font-family: Lato, Arial, sans-serif;
  font-size: 14px;
}
</style>
