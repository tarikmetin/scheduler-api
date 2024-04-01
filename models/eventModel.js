// Import mongoose
const mongoose = require("mongoose");

// Import Event Model
const Customer = require("./customerModel");

// Make a schema
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    patientName: { type: String, required: true },
    dni: { type: Number, required: true },
    cellphoneNumber: { type: Number },
    treatmentName: { type: String, required: true },
  },
  { timestamps: true }
);

// Make a modal and export
module.exports = mongoose.model("Event", eventSchema);
