import { useQuery } from "@tanstack/react-query";
import { problemApi } from "../api/problems";

export const useAllProblems = () => {
  const result = useQuery({
    queryKey: ["problems"],
    queryFn: () => problemApi.getAllProblems(),
  });

  return result;
};

export const useProblemById = (id) => {
  const result = useQuery({
    queryKey: ["problem", id],
    queryFn: () => problemApi.getProblemById(id),
    enabled: !!id,
  });

  return result;
};