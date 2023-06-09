<template>
  <div>
    <div class="left-panel">
      <user
        v-for="user in users"
        :key="user.userID"
        :user="user"
        :selected="selectedUser === user"
        @select="onSelectUser(user)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import User from './User.vue'

export default {
  name: 'Chat',
  components: {
    User
  },
  data() {
    return {
      selectedUser: null,
      users: []
    }
  },
  methods: {
    onSelectUser(user) {
      this.selecteduser = user
      user.hasNewMessages = false
    }
  }
}
</script>

<style>
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
