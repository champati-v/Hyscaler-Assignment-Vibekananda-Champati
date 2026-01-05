const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes  = require('./routes/auth.routes.js');
const leaveRoutes = require('./routes/leave.routes.js');

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/leave", leaveRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the Employee Leave Management System API");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}..`)
});
