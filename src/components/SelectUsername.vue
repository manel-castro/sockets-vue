<template>
  <div>
    <form @submit.prevent="onSubmit">
      <input v-model="username" placeholder="Your username..." type="text" />
      <button :disabled="!isValid">Send</button>
    </form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SelectUsername',
  data() {
    return {
      username: ''
    }
  },
  computed: {
    isValid() {
      return this.username.length > 2
    }
  },
  methods: {
    onSubmit() {
      this.$emit('input', this.username)
    }
  }
}
</script>

<style scoped></style>
