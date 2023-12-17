import { useMutation } from "@tanstack/react-query";
import TodoRepository from "../repository/TodoRepository";

export const useMutateTodo = () => {
  const createTodo = async (title: string) => {
    const res = await TodoRepository.createTodo(title);
    return res.data;
  };

  const createTodoMutation = useMutation({
    mutationFn: (title: string) => createTodo(title),
    mutationKey: ["createTodo"],
    onError: (error) => {
      console.log(`${error.message}`);
    },
    onSuccess: (res) => {
      return res;
    },
  });

  return {
    createTodoMutation,
  };
};
