<script setup lang="ts"></script>

<template>
  <main>
    Hello world
    <select-username @input="onUsernameSelection" />
  </main>
</template>

<script lang="ts">
import SelectUsername from '../components/SelectUsername.vue'

export default {
  name: 'App',
  components: {
    SelectUsername
  },
  data() {
    return {
      usernameAlreadySelected: false
    }
  },
  methods: {
    onUsernameSelection(username: string) {
      this.usernameAlreadySelected = true
      console.log(username)
    }
  }
}
</script>
