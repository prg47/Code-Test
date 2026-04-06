import Problem from "../models/Problem.model.js";

// GET /api/problems
export const getAllProblems = async (req, res) => {
  try {
    // Return only the fields needed for a problem listing page
    const problems = await Problem.find({}, "id title difficulty category");
    res.status(200).json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ msg: "Failed to fetch problems" });
  }
};

// GET /api/problems/:id
export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findOne({ id: req.params.id });
    if (!problem) {
      return res.status(404).json({ msg: "Problem not found" });
    }
    res.status(200).json(problem);
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ msg: "Failed to fetch problem" });
  }
};

// POST /api/problems  (admin/seed use)
export const createProblem = async (req, res) => {
  try {
    const existing = await Problem.findOne({ id: req.body.id });
    if (existing) {
      return res.status(409).json({ msg: "Problem with this id already exists" });
    }
    const problem = await Problem.create(req.body);
    res.status(201).json(problem);
  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({ msg: "Failed to create problem" });
  }
};

// DELETE /api/problems/:id  (admin use)
export const deleteProblem = async (req, res) => {
  try {
    const deleted = await Problem.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ msg: "Problem not found" });
    }
    res.status(200).json({ msg: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ msg: "Failed to delete problem" });
  }
};
