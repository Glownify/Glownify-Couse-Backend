const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true
  },

  fieldKey: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  type: {
    type: String,
    enum: ["text","email", "number", "textarea", "date", "select", "radio", "checkbox"],
    required: true
  },

  required: {
    type: Boolean,
    default: false
  },

  placeholder: String,

  options: {
    type: [String],
    default: []
  },


}, { _id: true });

const AdmissionFormSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    unique: true
  },

  fields: {
    type: [FieldSchema],
    validate: {
      validator: function (fields) {
        return fields.length > 0;
      },
      message: "At least one field is required"
    }
  }

}, { timestamps: true });

module.exports = mongoose.model("AdmissionForm", AdmissionFormSchema);
