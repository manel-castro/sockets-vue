<template>
  <div>
    <div :style="{ display: 'flex' }">
      {{ user.username }}
      <div v-if="user.self">&nbsp;(yourself)</div>
    </div>
    <div><status-icon :connected="user.connected" />{{ status }}</div>
  </div>
</template>

<script>
import StatusIcon from './StatusIcon.vue';

export default {
  name: 'User',
  components: {
    StatusIcon,
  },
  props: {
    user: Object,
    selected: Boolean,
  },
  methods: {
    onClick() {
      this.$emit('select');
    },
  },
  computed: {
    status() {
      return this.user.connected ? 'online' : 'offline';
    },
  },
};
</script>

<style></style>
