const Event = require("../models/eventModel");
const Customer = require("../models/customerModel");
const mongoose = require("mongoose");

// Get all events
const getAllEvents = async (req, res) => {
  //To get all the events we use find method with {}, also we sort according to their timestamp, newest one going to be coming first
  const allEvents = await Event.find({}).sort({ createdAt: -1 });

  //Then we are sending response of status 200 along with the list registered at the variable
  res.status(200).json(allEvents);
};

// Get a single event
const getEvent = async (req, res) => {
  //The url parameter is picked used req.params. This parameter has id info in it so we destructre it.
  const { id } = req.params;

  //We check if it is not valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //If not an error will be send as response
    return res.status(404).json({ error: "Event does not exist" });
  }

  //If guard clause above wont activated then we check the database using findById Method
  const event = await Event.findById(id);
  if (!event) {
    return res.status(404).json({ error: "Event does not exist" });
  }
  res.status(200).json(event);
};

// Get multiple events in a customer card (this is used in customerbase)
const getCustomerEvents = async (req, res) => {
  const { id } = req.params;

  const eventIds = id.split(",");

  const customerEvents = await Event.find({ _id: { $in: eventIds } }).sort({
    createdAt: -1,
  });
  res.status(200).json(customerEvents);
};

// Create an event
const createEvent = async (req, res) => {
  // Destructring from the request body
  const {
    title,
    start,
    end,
    patientName,
    treatmentName,
    cellphoneNumber,
    dni,
  } = req.body;

  // Registering the variables to the db
  try {
    const event = await Event.create({
      title,
      start,
      end,
      patientName,
      dni,
      cellphoneNumber,
      treatmentName,
    });

    // Find the relevant customer by its name
    const customer = await Customer.findOne({ dni });

    try {
      customer.treatmentHistory.push(event);
      await customer.save();
    } catch (error) {
      console.error("Error updating treatment history:", error);
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ ERROR: err.message });
  }
};

// Delete a single customer
const deleteEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Event does not exist" });
  }

  const event = await Event.findByIdAndDelete(id);

  if (!event) {
    return res
      .status(400)
      .json({ error: "Event that you wanna delete does not exist" });
  }

  try {
    await Customer.updateMany(
      { treatmentHistory: id },
      { $pull: { treatmentHistory: id } }
    );
  } catch (error) {
    console.error("Error updating treatment history:", error);
  }

  res.status(200).json(event);
};

// Update the customer
const updateEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Event does not exist" });
  }

  const event = await Event.findByIdAndUpdate(id, {
    ...req.body,
  });

  if (!event) {
    return res
      .status(400)
      .json({ error: "Event that you wanna update does not exist" });
  }

  res.status(200).json(event);
};

module.exports = {
  createEvent,
  getAllEvents,
  getEvent,
  deleteEvent,
  updateEvent,
  getCustomerEvents,
};
