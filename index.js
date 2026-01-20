const express = require("express");
const app = express();
const http = require("http");


app.use(express.json());
const userRoutes = require("./routes/userRoutes");

app.use("/users", userRoutes);

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});