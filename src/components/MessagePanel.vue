<template>
  <div>
    <!-- // status icon here (user connected) -->

    <ul>
      <li class="message" v-for="(message, index) in user.messages" :key="index">
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
      this.$emit('textInput', this.input)
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

<style scoped>
.header {
  line-height: 40px;
  padding: 10px 20px;
  border-bottom: 1px solid #dddddd;
}

.messages {
  margin: 0;
  padding: 20px;
}

.message {
  list-style: none;
}

.sender {
  font-weight: bold;
  margin-top: 5px;
}

.form {
  padding: 10px;
}

.input {
  width: 80%;
  resize: none;
  padding: 10px;
  line-height: 1.5;
  border-radius: 5px;
  border: 1px solid #000;
}

.send-button {
  vertical-align: top;
}
</style>
