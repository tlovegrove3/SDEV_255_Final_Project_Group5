const { mongoose } = require("../config/database");

const courseSchema = new mongoose.Schema({
  cname: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  subject_area: { type: String, required: true },
  credits: { type: Number, required: true, min: 1, max: 6, default: 3 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field before saving
courseSchema.pre("save", function (next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
