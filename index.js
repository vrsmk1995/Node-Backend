require("dotenv").config();


const express = require("express");
const http = require("http");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./db");
const morgan = require("morgan");
const logger = require("./utils/logger");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // dev only
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);


const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const errorMiddleware = require("./middleware/errorMiddleware");
app.use(errorMiddleware);

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
