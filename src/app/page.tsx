"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Todo } from "@prisma/client";

type TodoList = {
  title: string;
  status: string;
}[];

export default function Home() {
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const onChangeTodoText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(event.target.value);
  };
  const [filteredTodoList, setFilteredTodoList] = useState<Todo[]>([]);
  const [radio, setRadio] = useState("all");

  useEffect(() => {
    const getTodo = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todo`);
      const todos = await response.json();
      setTodos(todos);
    };
    getTodo();
  }, [todos]);

  const postTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!todoText) alert("入力してください");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: todoText }),
    });
    const newTodo = await response.json();
    setTodos((prevState) => [...prevState, newTodo]);
    setTodoText("");
    console.log(newTodo);
  };

  const updateTodo = async (todo: Todo) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/todo/${todo.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: todo.completed }),
      }
    );
    const updatedTodo = await response.json();
    setTodos(
      todos.map((todo) => {
        if (todo.id === updatedTodo.id) {
          return updatedTodo;
        } else {
          return todo;
        }
      })
    );
  };

  const deleteTodo = async (
    e: React.MouseEvent<HTMLButtonElement>,
    todo: Todo
  ) => {
    e.preventDefault();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/todo/${todo.id}`,
      {
        method: "DELETE",
      }
    );
    const deleteTodo = await response.json();
    setTodos(todos.filter((todo) => todo.id !== deleteTodo.id));
  };

  const handleChange = (event: any) => {
    setRadio(event.target.value);
    if (event.target.value === "incomplete") {
      const incompleteTodoList = [...todos].filter(
        (todo) => todo.completed === false
      );
      setFilteredTodoList(incompleteTodoList);
    } else if (event.target.value === "complete") {
      const completeTodoList = [...todos].filter(
        (todo) => todo.completed === true
      );
      setFilteredTodoList(completeTodoList);
    }
    return;
  };

  return (
    <>
      <div className="complete-area">
        <label>
          <input
            type="radio"
            value="all"
            onChange={handleChange}
            checked={radio === "all"}
          />
          すべて
        </label>

        <label>
          <input
            type="radio"
            value="incomplete"
            onChange={handleChange}
            checked={radio === "incomplete"}
          />
          作業中
        </label>

        <label>
          <input
            type="radio"
            value="complete"
            onChange={handleChange}
            checked={radio === "complete"}
          />
          完了
        </label>

        <h1>ToDoリスト</h1>
        <table>
          <thead>
            <tr>
              <td>ID</td>
              <td>コメント</td>
              <td>状態</td>
            </tr>
          </thead>
          {radio === "all" ? (
            <tbody id="todo-body">
              {todos.map((todo, index) => (
                <tr key={todo.title}>
                  <td>{todo.id}</td>
                  <td>{todo.title}</td>
                  <td>
                    <button onClick={() => updateTodo(todo)}>
                      {todo.completed ? "完了" : "作業中"}
                    </button>
                  </td>
                  <td>
                    <button onClick={(e) => deleteTodo(e, todo)}>削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody id="todo-body">
              {filteredTodoList.map((todo, index) => (
                <tr key={todo.title}>
                  <td>{todo.id}</td>
                  <td>{todo.title}</td>
                  <td>
                    <button onClick={() => updateTodo(todo)}>
                      {todo.completed ? "完了" : "作業中"}
                    </button>
                  </td>
                  <td>
                    <button onClick={(e) => deleteTodo(e, todo)}>削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <h2>新規タスクの追加</h2>
      <form className="add-todo" onSubmit={postTodo}>
        <input
          value={todoText}
          onChange={onChangeTodoText}
          placeholder="Todoを入力してください"
        />
        <button
          type="submit"
          // className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'
        >
          追加
        </button>
      </form>
    </>
  );
}

// export default Home;
