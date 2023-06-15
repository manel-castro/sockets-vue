<template>
  <div>
    <div class="left-panel">
      <user
        v-for="user in users"
        :key="user.userID"
        :user="user"
        :selected="user === selectedUser"
        @select="onSelectUser(user)"
      />
    </div>
    <message-panel v-if="selectedUser" @sentMessage="onMessage" :user="selectedUser" />
  </div>
</template>

<script>
import socket from '../socket';
import MessagePanel from './messagePanel.vue';
import User from './User.vue';
export default {
  name: 'Chat',
  props: {
    users: Object,
  },
  components: { User, MessagePanel },
  data() {
    return {
      selectedUser: null,
    };
  },
  created() {
    console.log('created');
  },
  methods: {
    onSelectUser(user) {
      console.log('selectedUser', user);
      this.selectedUser = user;
      user.newMessages = false;
    },
    onMessage(content) {
      if (this.selectedUser) {
        socket.emit('private message', {
          content,
          to: this.selectedUser.userID,
        });
        this.selectedUser.messages.push({
          content,
          self: true,
        });
      }
    },
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
