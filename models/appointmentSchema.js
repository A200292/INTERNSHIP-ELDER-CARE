const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    elderId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    caregiverId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed"],
      default: "pending",
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Appointment", appointmentSchema);
