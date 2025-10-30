import mongoose from "mongoose";

const weekSchema = new mongoose.Schema({
  weekNumber: Number,
  weekTitle: String,
  topics: [String],
  miniProject: String,
});

const courseSchema = new mongoose.Schema({
  image: String, // path of uploaded image
  title: String,
  duration: String,
  description: String,
  popular: Boolean,
  outline: [weekSchema],
});

export default mongoose.model("Course", courseSchema);
