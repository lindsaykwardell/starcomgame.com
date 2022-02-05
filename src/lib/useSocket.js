import { io } from "socket.io-client";

export default () => {
  const gameId = location.hash;
  let socket;

  if (!gameId) {
    console.log("Single player mode");
  } else {
    socket = io(import.meta.env.VITE_GAME_SERVER);
  }

  return socket;
};
