require("dotenv").config();

const express = require("express");
const http = require("http");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./db");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "*", // dev only
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

connectDB();

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

const errorMiddleware = require("./middleware/errorMiddleware");
app.use(errorMiddleware);

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
