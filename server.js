const express = require("express");
const cors = require("cors");
const path = require("path");
const expressSession = require("express-session");

const app = express();
const server = require("http").createServer(app);

// session setup
const session = expressSession({
  secret: "coding is amazing",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});

// Express App Config
app.use(express.json());
app.use(session);
app.use(express.static("public"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "public")));
} else {
  const corsOptions = {
    origin: [
      "http://127.0.0.1:8080",
      "http://localhost:8080",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
    ],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

const authRoutes = require("./api/auth/auth.routes");
const userRoutes = require("./api/user/user.routes");
const boardRoutes = require("./api/board/board.routes");
const { connectSockets } = require("./services/socket.service");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/board", boardRoutes);
connectSockets(server, session);

app.get("/**", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const logger = require("./services/logger.service");
const port = process.env.PORT || 3030;
server.listen(port, () => {
  logger.info("Server is now running on port " + port);
});
