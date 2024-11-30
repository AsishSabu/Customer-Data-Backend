const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  s_no: {
    type: Number,
    required: true,
    unique: true,
  },
  name_of_customer: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
     unique: true
     },
  mobile_number: {
     type: String,
     required: true,
     unique: true
     },
  dob: {
    type: Date,
    required: true
  },
  created_at: {
     type: Date,
     default: Date.now
     },
  modified_at: {
    type: Date,
     default: Date.now
     },
});

customerSchema.index({ email: 1, mobile_number: 1 });

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
