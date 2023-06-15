<template>
  <div class="app">
    <select-username @selectUsername="onSelectUsername" v-if="!usernameAlreadySelected" />
    <chat v-else :users="this.users" />
  </div>
</template>

<script>
import Chat from '../components/Chat.vue';
import SelectUsername from '../components/SelectUsername.vue';
import socket from '../socket';
export default {
  name: 'App',
  components: { SelectUsername, Chat },
  data() {
    return {
      usernameAlreadySelected: false,
      users: [],
    };
  },
  methods: {
    onSelectUsername(username) {
      socket.auth = { username };
      socket.connect();
    },
  },
  created() {
    const sessionID = localStorage.getItem('session');
    if (sessionID) {
      console.log('sesionID exists', sessionID);
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on('connect', () => {
      console.log('connected');
      this.usernameAlreadySelected = true;
    });
    socket.on('session', ({ sessionID, userID }) => {
      console.log('emited session: ', sessionID, userID);
      this.usernameAlreadySelected = true;
      localStorage.setItem('session', sessionID);
      socket.auth = { sessionID };
      socket.userID = userID;
    });

    socket.on('connect_error', (err) => {
      if (err.message === 'invalid username') {
        this.usernameAlreadySelected = false;
      }
    });
    socket.on('users', (users) => {
      console.log('users:', users);
      users.forEach((user) => {
        if (user.userID === socket.userID) {
          console.log('self is true');
          user.connected = true;
          user.self = true;
          user.messages = user.messages || [];
        }
      });
      this.users = users;
    });
    socket.on('private message', (message) => {
      console.log('message:', message);
      message.self = message.from === socket.userID;

      const conversationUser = message.self ? message.to : message.from;
      const existingUser = this.users.find((_user) => _user.userID === conversationUser);
      existingUser.messages.push(message);
      existingUser.newMessages = true;
    });
    socket.on('user connected', (user) => {
      const existingUser = this.users.find((_user) => user.userID === _user.userID);
      if (!existingUser) {
        this.users.push(user);
      } else {
        existingUser.connected = true;
      }
    });
    socket.on('user disconnected', (userID) => {
      const existingUser = this.users.find((_user) => userID === _user.userID);

      existingUser.connected = false;
    });
  },
};
</script>

<style>
body {
  margin: 0;
}

@font-face {
  font-family: Lato;
  src: '~/public/fonts/Lato-Regular.ttf';
}

#app {
  font-family: Lato, Arial, sans-serif;
  font-size: 14px;
}
</style>
