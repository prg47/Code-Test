import { PROBLEMS } from "../../frontend/src/data/problems.js"; // adjust path if needed
import { connectDB } from "../src/lib/db.js";
import Problem from "../src/models/Problem.model.js";

const seed = async () => {
  await connectDB();

  const problems = Object.values(PROBLEMS);

  for (const problem of problems) {
    const exists = await Problem.findOne({ id: problem.id });
    if (exists) {
      console.log(`Skipping existing problem: ${problem.id}`);
      continue;
    }
    await Problem.create(problem);
    console.log(`Seeded: ${problem.id}`);
  }

  console.log("Seeding complete.");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});