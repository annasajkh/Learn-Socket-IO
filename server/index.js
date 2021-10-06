const express = require("express");
const http = require("http");
const { Server } = require("socket.io");


const fs = require("fs")

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.send("go to https://Learn-Socket-IO.annasvirtual.repl.co/chat to chat")
});

app.get("/chat", (req, res) => {
  res.sendFile("/home/runner/Learn-Socket-IO/client/index.html");
});

app.get("/client/index.js", (req, res) => {
  res.sendFile("/home/runner/Learn-Socket-IO/client/index.js");
});


function updateChat(text, socket=undefined) {
  fs.appendFile("/home/runner/Learn-Socket-IO/server/database/chat_history.txt", text + "\n", function (err) {
    if (err) throw err;
  });
  
  io.emit("message", text);

  if(text == "a user connected") {
    fs.readFile("/home/runner/Learn-Socket-IO/server/database/chat_history.txt", "utf8" , (err, data) => {
      if (err) throw err;

      let chunkData = data.split("\n");

      for(let i = 0; i < chunkData.length; i++) {
        if(chunkData[i] != "") {
          io.to(socket.id).emit("message", chunkData[i]);
        }
      }
    });
  }
}

io.on("connection", (socket) => {
  updateChat("a user connected", socket)

  socket.on("message", (msg) => {
    updateChat(msg);
  });
  
  socket.on("disconnect", () => {
    updateChat("a user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on 3000");
});