require("dotenv").config();

const express = require("express");
//This imports the router from customers.js as customersRouter
const customersRouter = require("./routes/customers");
const eventsRouter = require("./routes/events");
const userRotuer = require("./routes/user");
//This imports mongoose
const mongoose = require("mongoose");

const cors = require("cors");

//express app stored in app constant
const app = express();

//MIDDLEWARE
//This lets express parse json data
app.use(express.json());
app.use(cors({ "Access-Control-Allow-Origin": process.env.CLIENT_URI }));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
// When someone goes to /api/customers then customersRouter going to be called
app.use("/api/customers", customersRouter);
app.use("/api/events", eventsRouter);
app.use("/api/user", userRotuer);

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen for requests only starts after we connected to the db
    app.listen(process.env.PORT, () => {
      console.log("listenin on port 4000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
