const crypto = require("crypto");
const { InMemorySessionStore } = require("./sessionStore");
const { InMemoryMessageStore } = require("./messageStore");

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();

const randomId = () => crypto.randomBytes(8).toString("hex");

io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  console.log("sessionId: ", sessionID);
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    console.log("session: ", session);
    if (session) {
      socket.username = session.username;
      socket.userID = session.userID;
      socket.sessionID = sessionID;
      return next();
    }
  }
  // first time logging
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }

  socket.username = username;
  socket.sessionID = randomId();
  socket.userID = randomId();

  next();
});

io.on("connection", async (socket) => {
  const session = {
    username: socket.username,
    userID: socket.userID,
    connected: true,
  };

  sessionStore.saveSession(socket.sessionID, session);
  socket.emit("session", {
    userID: socket.userID,
    sessionID: socket.sessionID,
  });

  const sessions = sessionStore.findAllSession();

  // Organize messages per conversation
  const users = [];
  const messages = messageStore.findMessagesForUser(socket.userID);

  const messagesPerUser = new Map();
  messages.forEach((message) => {
    // We only want to organize by the other users, not by "yourself"
    const otherUser =
      message.from === socket.userID ? message.to : message.from;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  });

  sessions.forEach((session) => {
    users.push({
      ...session,
      messages: messagesPerUser.get(socket.userID) || [],
    });
  });

  socket.emit("users", users);

  socket.broadcast.emit("user connected", session);

  socket.on("private message", ({ content, to }) => {
    const message = {
      content,
      from: socket.userID,
      to,
    };
    socket.to(to).to(socket.userID).emit("private message", message);
    messageStore.saveMessage(message);
  });

  socket.on("disconnect", async () => {
    socket.broadcast.emit("user disconnected", socket.userID);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
