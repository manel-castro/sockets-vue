<template>
  <div>
    <div v-for="(message, index) in user.messages" :key="index">
      <div v-if="shouldDisplay(message, index)" :style="{ display: 'flex', fontWeight: 'bold' }">
        {{ message.self ? '(yourself)' : this.user.username }}
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
    shouldDisplay(message, index) {
      return index === 0 || this.user.messages[index - 1].from !== this.user.messages[index].from;
    },
  },
  computed: {},
};
</script>

<style></style>
