const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    email: { 
      type: String,
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String,
      required: [true, "Please provide a password"],
      trim: true,
      minlength: 8,
      select: false // hide by default
    },
    passwordConfirm: {
      type: String,
      trim: true,
      validate: {
        // Only works on CREATE and SAVE
        validator: function(el) {
          return el === this.password;
        },
        message: "Passwords do not match"
      }
    },
    role: { 
      type: String,
      required: true,
      enum: ["elder", "caregiver", "family_member", "admin"]
    },
    roleDetails: {
      elder: {
        dateOfBirth: { type: Date },    
        phone: { type: String },
        medicalConditions: { type: [String] },
        emergencyContactIds: { type: [Schema.Types.ObjectId], ref: "User" },
        medications: { type: [String] }
      },
      caregiver: {
        certifications: { type: [String] },
        assignedElders: { type: [Schema.Types.ObjectId], ref: "User" },
        phone: { type: String },
        availability: [{
          day: { type: String },
          startTime: { type: String },
          endTime: { type: String }
        }],
        matchCriteriaId: { type: Schema.Types.ObjectId, ref: "MatchCriteria" }
      },
      family_member: {
        relationshipToElder: { type: String },
        linkedElderIds: { type: [Schema.Types.ObjectId], ref: "User" },
        phone: { type: String }
      },
      admin: {
        permissions: { type: [String] },
        managedUsers: { type: [Schema.Types.ObjectId], ref: "User" }
      }
    },
    passwordChangedAt: { type: Date }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // remove confirm field
  next();
});

// Instance method to check password
userSchema.methods.checkPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// // Check if password changed after JWT issued
// Check if password changed after JWT issued
userSchema.methods.passwordChangedAftertokenIssued = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

module.exports = mongoose.model("User", userSchema);
