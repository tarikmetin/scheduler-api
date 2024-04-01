const express = require("express");
const {
  createCustomer,
  getAllCustomers,
  getCustomer,
  deleteCustomer,
  updateCustomer,
  getCustomerByDni,
} = require("../controllers/customerController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
//Authorization middleware for all customers routes below
router.use(requireAuth);

//Get the customer list
router.get("/", getAllCustomers);

//Get the specific customer
router.get("/:id", getCustomer);

//Get the specific customer by DNI
router.get("/dni/:dni", getCustomerByDni);

//Create a new customer
router.post("/", createCustomer);

//Delete a customer
router.delete("/:id", deleteCustomer);

//Update the customer
router.patch("/:id", updateCustomer);

module.exports = router;
