const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const httpServer = require("http").createServer(app);

app.get("*", (req, res) => {
  return res.send("server");
});
const io = require("socket.io")(httpServer, {
  transports: ["websocket", "polling"],
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.chat;

  if (id) {
    socket.join(id);
  }

  const createdMessage = (msg) => {
    socket.broadcast.to(id).emit("newIncomingMessage", msg);
  };

  socket.on("createdMessage", createdMessage);
});

httpServer.listen(3001);
