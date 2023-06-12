<template>
  <div class="left-panel">
    <user
      v-for="user in users"
      :key="user.userID"
      :user="user"
      :selected="user === selectedUser"
      @select="onSelectUser(user)"
    />
  </div>
</template>

<script>
import socket from '../socket';
import User from './User.vue';
export default {
  name: 'Chat',
  props: {
    users: Object,
  },
  components: { User },
  data() {
    return {
      selectedUser: null,
    };
  },
  created() {
    console.log('created');
  },
};
</script>
<style scoped>
.left-panel {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  overflow-x: hidden;
  background-color: #3f0e40;
  color: white;
}

.right-panel {
  margin-left: 260px;
}
</style>
