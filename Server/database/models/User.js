const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "trainer", "admin"],
    },

    profession: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    // isPhoneVerified: {
    //   type: Boolean,
    //   default: false,
    // },

    // isEmailVerified: {
    //   type: Boolean,
    //   default: false,
    // },

    lastLoginAt: Date,
  },
  { timestamps: true },
);

// Remove 'next' and the call to next()
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
});

module.exports = mongoose.model("User", userSchema);
