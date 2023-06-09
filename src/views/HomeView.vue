<script setup lang="ts"></script>

<template>
  <main>
    Hello world
    <select-username @input="onUsernameSelection" />
  </main>
</template>

<script lang="ts">
import SelectUsername from '../components/SelectUsername.vue'
import socket from '../socket'

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
      socket.auth = { username }
      socket.connect()
      socket.on('connect', () => {
        console.log('connected')
      })
      console.log(username)
    }
  },
  created() {
    console.log('component created')
    socket.on('connect_error', (err) => {
      if (err.message === 'invalid username') {
        this.usernameAlreadySelected = false
      }
    })
  },
  unmounted() {
    socket.off('connect_error')
  }
}
</script>
