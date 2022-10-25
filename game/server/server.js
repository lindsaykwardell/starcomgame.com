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

  socket.on("join", (id) => {
    socket.join(id);
    gameId = id;

    if (!games[id]) {
      games[id] = { playerCount: 1, state: null };
    } else {
      games[id].playerCount++;
    }

    socket.emit("joined", {
      id,
      playerCount: games[id].playerCount,
    });

    if (games[id]?.state) {
      socket.emit("state", games[id].state);
    }
  });

  socket.on("state", (val) => {
    if (gameId) {
      games[gameId].state = val;
      socket.to(gameId).emit("state", val);
    }
  });

  socket.on("disconnect", () => {
    if (games[gameId]) {
      games[gameId].playerCount--;
      if (games[gameId].playerCount === 0) {
        delete games[gameId];
      }
    }
  });
});

server.listen(process.env.PORT || 8080);
