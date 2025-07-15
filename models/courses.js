const db = require("../db");

const courseSchema = new db.Schema({
  cname: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String, required: true },
  subject_area: { type: String, required: true },
  credits: { type: Number, required: true },
});

const Course = db.model("Course", courseSchema);

module.exports = Course;
