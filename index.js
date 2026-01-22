require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");

app.use(express.json());
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
