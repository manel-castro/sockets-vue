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

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
