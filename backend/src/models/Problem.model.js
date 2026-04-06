import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String },
}, { _id: false });

const descriptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  notes: [{ type: String }],
}, { _id: false });

const starterCodeSchema = new mongoose.Schema({
  javascript: { type: String },
  python: { type: String },
  java: { type: String },
}, { _id: false });

const expectedOutputSchema = new mongoose.Schema({
  javascript: { type: String },
  python: { type: String },
  java: { type: String },
}, { _id: false });

const problemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // slug like "two-sum"
    title: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    category: { type: String, required: true },
    description: { type: descriptionSchema, required: true },
    examples: [exampleSchema],
    constraints: [{ type: String }],
    starterCode: { type: starterCodeSchema },
    expectedOutput: { type: expectedOutputSchema },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;