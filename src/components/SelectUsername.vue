<template>
  <form @submit.prevent="onSubmit">
    <input v-model="username" placeholder="Type your username..." />
    <button :disabled="!isValid">Select</button>
  </form>
</template>

<script>
export default {
  name: 'SelectUsername',
  data() {
    return {
      username: ''
    }
  },
  computed: {
    isValid() {
      return this.username.length > 3
    }
  },
  methods: {
    onSubmit() {
      this.$emit('selectUsername', this.username)
    }
  }
}
</script>

<style></style>
