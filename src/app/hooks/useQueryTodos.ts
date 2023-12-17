import { Todo } from "@prisma/client";
import TodoRepository from "../repository/TodoRepository";
import { useQuery } from "@tanstack/react-query";

export const useQueryTodos = () => {
  const getTodos = async () => {
    const { data } = await TodoRepository.getTodos();
    return data;
  };
  return useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () => getTodos(),
  });
};
