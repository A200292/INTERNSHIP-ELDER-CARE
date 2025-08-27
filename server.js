const express = require("express");
const { connectDB } = require("./database");

const app = express();

// Connect to DB
connectDB();

// Import routers
const userRoute = require("./router/userRoute");
const emergencyAlertRoute = require("./router/emergencyAlertRoute");
const healthRecordRoute = require("./router/healthRecordRoute");
const notificationRoute = require("./router/notificationRoute");
const matchCriteriaRoute = require("./router/matchCriteriaRoute");
const appointmentRoute = require("./router/appointmentRoute");
const cors = require('cors');
// Middleware
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3001" // or whatever port your React app runs on
}));
app.get("/", (req, res) => {
  res.send("API is working");
});
// Route handlers
app.use("/api/user", userRoute);

app.use("/api/sos", emergencyAlertRoute);
app.use("/api/health", healthRecordRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/matchcriteria", matchCriteriaRoute);
app.use("/api/appointment", appointmentRoute);

// Start server
app.listen(3000, () => {
  console.log("Listening at port 3000");
});
