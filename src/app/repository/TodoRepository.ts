import { AxiosPromise } from "axios";
import apiClient from "../lib/api-client";
import { Todo } from "@prisma/client";

class TodoRepository {
  public static getTodos(): AxiosPromise<Todo[]> {
    return apiClient.get(`/todo`);
  }
  public static createTodo(title: string): AxiosPromise<Todo>{
    return apiClient.post(`/todo`, title)
  }
}

export default TodoRepository;
