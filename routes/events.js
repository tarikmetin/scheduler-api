const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEvent,
  deleteEvent,
  updateEvent,
  getCustomerEvents,
} = require("../controllers/eventController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
//Authorization middleware for all customers routes below
router.use(requireAuth);

//Get the event list
router.get("/", getAllEvents);

//Get the event customer
router.get("/:id", getEvent);

//Get customer's events
router.get("/filtered/:id", getCustomerEvents);

//Create a new customer
router.post("/", createEvent);

//Delete a customer
router.delete("/:id", deleteEvent);

//Update the customer
router.patch("/:id", updateEvent);

module.exports = router;
