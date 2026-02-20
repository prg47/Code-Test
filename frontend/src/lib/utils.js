export const getDifficultyBadgeClass = (difficulty) => {
    if (!difficulty) return "badge-ghost";  // ← add this
    switch (difficulty.toLowerCase()) {
        case "easy":
            return "badge-success";
        case "medium":
            return "badge-warning";
        case "hard":
            return "badge-error";
        default:
            return "badge-ghost";
    }
};