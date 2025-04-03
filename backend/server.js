// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo"); 
const routes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");
const graphRoutes = require("./routes/graphRoutes"); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.log(" MongoDB Error:", err));

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true })); 
app.use(express.static("public")); 

// Session Middleware
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Store sessions in MongoDB
    cookie: { secure: false }, // Set secure: true in production with HTTPS
  })
);

// Passport Setup
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", routes);
app.use("/api/data", dataRoutes);
app.use("/api/graph", graphRoutes); 

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});