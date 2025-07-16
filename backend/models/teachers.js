const { mongoose } = require("../config/database");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  teacherId: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // might hash this later
  department: { type: String, required: true },
  createdCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
