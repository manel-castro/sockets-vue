<template>
  <div>
    <div v-for="(message, index) in user.messages" :key="index">
      <div :style="{ display: 'flex', fontWeight: 'bold' }">
        {{ this.user.username }} {{ message.self ? '(yourself)' : '' }}
      </div>

      <div>{{ message.content }}</div>
    </div>
    <form @submit.prevent="onSubmit">
      <input v-model="message" />
      <button>Send</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'MessagePanel',
  props: {
    user: Object,
  },
  data() {
    return {
      message: '',
    };
  },
  methods: {
    onSubmit() {
      this.$emit('sentMessage', this.message);
      this.message = '';
    },
  },
};
</script>

<style></style>
