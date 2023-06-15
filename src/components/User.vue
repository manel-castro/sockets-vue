<template>
  <div :style="{ display: 'flex' }">
    <div @click="onClick">
      <div :style="{ display: 'flex' }" :class="{ selected: selected }">
        {{ user.username }}
        <div v-if="user.self">&nbsp;(yourself)</div>
      </div>
      <div><status-icon :connected="user.connected" />{{ status }}</div>
    </div>
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'red',
        height: '20px',
        width: '20px',
        borderRadius: '4px',
      }"
      v-if="user.newMessages"
    >
      !
    </div>
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

<style>
.selected {
  background: red;
}
</style>
