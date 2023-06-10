<template>
  <div>
    <!-- // status icon here (user connected) -->

    <ul>
      <li v-for="(message, index) in user.messages" :key="index">
        <div v-if="displaySender(message, index)">
          {{ message.fromSelf ? '(yourself)' : user.username }}
        </div>
        {{ message.content }}
      </li>
    </ul>

    <form @submit.prevent="onSubmit">
      <textarea v-model="input" placeholder="your message..."></textarea>
      <button :disabled="!isValid">Send</button>
    </form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MessagePanel',
  components: {},
  props: { user: Object },
  data() {
    return {
      input: ''
    }
  },
  methods: {
    displaySender(message, index) {
      return (
        index === 0 || this.user.messages[index - 1].fromSelf !== this.user.messages[index].fromSelf
      )
    },
    onSubmit() {
      this.$emit('input', this.input)
      this.input = ''
    }
  },
  computed: {
    isValid() {
      return this.input.length > 0
    }
  }
}
</script>

<style scoped></style>
