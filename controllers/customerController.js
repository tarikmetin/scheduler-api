const Customer = require("../models/customerModel");
const mongoose = require("mongoose");

// Get all customers
const getAllCustomers = async (req, res) => {
  //To get all the customer we use find method with {}, also we sort according to their timestamp, newest one going to be coming first
  const allCustomers = await Customer.find({}).sort({ createdAt: -1 });

  //Then we are sending response of status 200 along with the list registered at the variable
  res.status(200).json(allCustomers);
};

// Get a single customer
const getCustomer = async (req, res) => {
  //The url parameter is picked used req.params. This parameter has id info in it so we destructre it.
  const { id } = req.params;

  //We check if it is not valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //If not an error will be send as response
    return res.status(404).json({ error: "Customer does not exist" });
  }

  //If guard clause above wont activated then we check the database using findById Method
  //Alternatively, if you want to find customer by dni number then use findByOne({dni: id}), but do not forget above guard should be modified as well.
  const customer = await Customer.findById(id);
  if (!customer) {
    return res.status(404).json({ error: "Customer does not exist" });
  }
  res.status(200).json(customer);
};

// Get a single customer by DNI
const getCustomerByDni = async (req, res) => {
  const { dni } = req.params;
  try {
    const customer = await Customer.findOne({ dni });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a customer
const createCustomer = async (req, res) => {
  // Destructring from the request body
  const { patientName, cellphoneNumber, dni, treatmentHistory } = req.body;

  // Registering the variables to the db
  try {
    const customer = await Customer.create({
      patientName,
      cellphoneNumber,
      dni,
      treatmentHistory,
    });
    res.status(200).json(customer);
  } catch (err) {
    res.status(400).json({ ERROR: err.message });
  }
};

// Delete a single customer
const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Customer does not exist" });
  }

  const customer = await Customer.findByIdAndDelete(id);

  if (!customer) {
    return res
      .status(400)
      .json({ error: "Customer that you wanna delete does not exist" });
  }

  res.status(200).json(customer);
};

// Update the customer
const updateCustomer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Customer does not exist" });
  }

  const customer = await Customer.findByIdAndUpdate(id, {
    ...req.body,
  });

  if (!customer) {
    return res
      .status(400)
      .json({ error: "Customer that you wanna update does not exist" });
  }

  res.status(200).json(customer);
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomer,
  deleteCustomer,
  updateCustomer,
  getCustomerByDni,
};
