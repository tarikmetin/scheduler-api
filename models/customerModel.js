// Import mongoose
const mongoose = require("mongoose");

// Import Event Model
const Event = require("./eventModel.js");

// Make a schema
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    patientName: { type: String, required: true },
    cellphoneNumber: { type: Number },
    dni: { type: Number, required: true },
    treatmentHistory: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  },
  { timestamps: true }
);

// customerSchema.pre("save", async function (next) {
//   try {
//     const existingCustomer = await this.constructor.findOne({ dni: this.dni });
//     if (existingCustomer) {
//       const error = new Error("Customer with this DNI already exists");
//       return next(error);
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

customerSchema.pre("save", async function (next) {
  try {
    // Check if the document is new (being created for the first time)
    if (this.isNew) {
      const existingCustomer = await this.constructor.findOne({
        dni: this.dni,
      });
      if (existingCustomer) {
        const error = new Error("Customer with this DNI already exists");
        return next(error);
      }
    }
    // If the document is not new, continue with saving
    next();
  } catch (error) {
    next(error);
  }
});

// Make a modal and export
module.exports = mongoose.model("Customer", customerSchema);
