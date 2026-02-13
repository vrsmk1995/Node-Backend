require("dotenv").config();

const express = require("express");
const http = require("http");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");

const hpp = require("hpp");

const connectDB = require("./db");
const logger = require("./utils/logger");
const errorMiddleware = require("./middleware/errorMiddleware");

const { authLimiter } = require("./middleware/rateLimit");

const app = express();
const xssSanitizer = require("./middleware/xssSanitizer");

app.set("trust proxy", 1);
app.disable("x-powered-by");

// Security Headers
app.use(helmet());

// CORS (Production Safe)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Body Parser with limit
app.use(express.json({ limit: "10kb" }));

// Data Sanitization
// app.use(mongoSanitize());
app.use(xssSanitizer);
app.use(hpp());

// Logging
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// DB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Error Middleware
app.use(errorMiddleware);

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
