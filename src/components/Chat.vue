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
    <message-panel
      v-if="selectedUser"
      :user="selectedUser"
      @textInput="onMessage"
      class="right-panel"
    />
  </div>
</template>

<script lang="ts">
import socket from '../socket'
import MessagePanel from './messagePanel.vue'
import User from './User.vue'

export default {
  name: 'Chat',
  components: {
    User,
    MessagePanel
  },
  data() {
    return {
      selectedUser: null,
      users: []
    }
  },
  methods: {
    onSelectUser(user) {
      console.log('select user: ', user)
      this.selectedUser = user
      user.hasNewMessages = false
    },
    onMessage(message) {
      if (!this.selectedUser) return
      socket.emit('private message', { to: this.selectedUser.userID, content: message })
      this.selectedUser.messages.push({
        content: message,
        fromSelf: true
      })
    }
  },
  created() {
    socket.on('connect', () => {
      this.users.forEach((user) => {
        if (user.self) {
          user.connected = true
        }
      })
    })
    socket.on('disconnect', () => {
      this.users.forEach((user) => {
        if (user.self) {
          user.connected = false
        }
      })
    })

    const initReactiveProperties = (user) => {
      user.hasNewMessages = false
    }

    socket.on('users', (users) => {
      console.log('users', users)
      users.forEach((user) => {
        // user.messages.forEach((message) => {
        //   message.fromSelf = message.from === socket.userID
        // })
        for (let i = 0; i < this.users.length; i++) {
          const existingUser = this.users[i]
          console.log('user. ', user)
          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected
            // existingUser.messages = user.messages
            // return
          }
        }
        user.self = user.userID === socket.userID
        initReactiveProperties(user)
        this.users.push(user)
      })
      this.users.sort((a, b) => {
        if (a.self) return -1
        if (b.self) return 1
        if (a.username < b.username) return -1
        return a.username > b.username ? 1 : 0
      })
    })

    socket.on('user connected', (user) => {
      console.log('userconnected: ', user)
      for (let i = 0; i < this.users.length; i++) {
        const existingUser = this.users[i]
        console.log('existingUser: ', existingUser)
        if (existingUser.userID === user.userID) {
          existingUser.connected = true
          return
        }
      }
      initReactiveProperties(user)
      this.users.push(user)
    })
    socket.on('user disconnected', (id) => {
      for (let i = 0; i < this.users.length; i++) {
        const existingUser = this.users[i]
        if (existingUser.userID === id) {
          existingUser.connected = false
          return
        }
      }
    })

    socket.on('private message', ({ content, from, to }) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i]
        console.log('private message rceived', user)
        const fromSelf = socket.userID === from
        if (user.userID === (fromSelf ? to : from)) {
          console.log('user found')
          user.messages.push({
            content,
            fromSelf
          })
          if (user !== this.selectedUser) {
            user.hasNewMessages = true
          }
          break
        }
      }
    })
  },
  unmounted() {
    socket.off('connect')
    socket.off('disconnect')
    socket.off('users')
    socket.off('user connected')
    socket.off('user disconnected')
    socket.off('private message')
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
