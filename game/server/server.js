require("dotenv").config();

const http = require("http");
const server = http.createServer((req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": process.env.CLIENT_URL,
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Max-Age": 2592000, // 30 days
    /** add other headers as per requirement */
  };

  res.writeHead(200, headers);
  res.write(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Star Commander</title>
      <script>
        window.location.href = "${process.env.CLIENT_URL}"
      </script>
    </head>
    <body>
    </body>
  </html>
  `);
  res.end();
  return;
});
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

const games = {};

io.on("connection", (socket) => {
  let gameId;
  console.log("a user connected");

  socket.on("join", (id) => {
    socket.join(id);
    gameId = id;

    if (!games[id]) {
      games[id] = 1;
    } else {
      games[id]++;
    }

    socket.emit("joined", {
      id,
      playerCount: games[id],
    });
  });

  socket.on("state", (val) => {
    console.log(gameId);
    if (gameId) {
      socket.to(gameId).emit("state", val);
    }
  });

  socket.on("disconnect", () => {
    if (games[gameId]) {
      games[gameId]--;
      if (games[gameId] === 0) {
        delete games[gameId];
      }
    }
  });
});

server.listen(process.env.PORT || 8080);
