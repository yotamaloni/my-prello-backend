const logger = require("./logger.service");

var gIo = null;

function connectSockets(http, session) {
  gIo = require("socket.io")(http, {
    cors: {
      origin: "*",
    },
  });
  gIo.on("connection", (socket) => {
    console.log("New socket", socket.id);
    socket.on("disconnect", (socket) => {
      console.log("Someone disconnected");
    });

    socket.on("board-watch", (boardId) => {
      console.log("board-watch boardId:", boardId);

      if (socket.boardId === boardId) return;
      if (socket.boardId) {
        socket.leave(socket.boardId);
      }
      socket.join(boardId);
      socket.boardId = boardId;
    });

    socket.on("board-update", (board) => {
      console.log(" board-update boardId:", board._id);
      console.log("board-update", socket.boardId);
      socket.to(socket.boardId).emit("board-update", board);
      // socket.broadcast.emit("board-update", board); //IF ITS ON - SO DONT USE BOARD-WATCH
    });
    socket.on("task-update", (task) => {
      console.log("🟡 ~ task", task);
      console.log(" task-update taskId:", task.id);
      socket.broadcast.emit("task-update", task);
    });
  });
}

function boardsAfterRemove(boardId) {
  console.log("removed board", boardId);
  gIo && gIo.emit("remove-board", boardId);
}

function boardsAfterAddBoard(board) {
  console.log("add-board", board);
  gIo && gIo.emit("add-board", board);
}

module.exports = {
  connectSockets,
  boardsAfterRemove,
  boardsAfterAddBoard,
};
