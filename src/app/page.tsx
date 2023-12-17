"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Todo } from "@prisma/client";
import { Box, Button, Group, Table, Title, Radio } from "@mantine/core";

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
  }, []);

  useEffect(() => {
    if (radio === "all") setFilteredTodoList(todos);
    if (radio === "incomplete") {
      const filteredTodo = todos.filter((item) => item.completed === false);
      setFilteredTodoList(filteredTodo);
    }
    if (radio === "complete") {
      const filteredTodo = todos.filter((item) => item.completed === true);
      setFilteredTodoList(filteredTodo);
    }
  }, [todos, radio]);

  const ths = (
    <Table.Tr>
      <Table.Th>ID</Table.Th>
      <Table.Th>タスク名</Table.Th>
      <Table.Th>状態</Table.Th>
    </Table.Tr>
  );

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

  const deleteTodo = async (todo: Todo) => {
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
    <Box maw="90%" my="lg" mx="auto" style={{ textAlign: "center" }}>
      <div className="complete-area">
        <Group justify="center" mb="lg">
          <Radio.Group name="taskFileter" onChange={setRadio} value={radio}>
            <Group mt="xs">
              <Radio value="all" label="すべて" />
              <Radio value="incomplete" label="作業中" />
              <Radio value="complete" label="完了" />
            </Group>
          </Radio.Group>
        </Group>

        <Title>ToDoリスト</Title>
        <Group justify="center">
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>
              {filteredTodoList.map((todo, index) => (
                <Table.Tr key={todo.id}>
                  <Table.Td maw="1rem">{todo.id}</Table.Td>
                  <Table.Td
                    maw="10rem"
                    miw="10rem"
                    style={{ wordWrap: "break-word", textAlign: "left" }}
                  >
                    {todo.title}
                  </Table.Td>
                  <Table.Td maw="3rem">
                    <Button
                      variant="outline"
                      color="black"
                      onClick={() => updateTodo(todo)}
                    >
                      {todo.completed ? "完了" : "作業中"}
                    </Button>
                  </Table.Td>
                  <Table.Td maw="2rem">
                    <Button
                      variant="outline"
                      color="black"
                      onClick={() => deleteTodo(todo)}
                    >
                      削除
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Group>
      </div>
      <h2>新規タスクの追加</h2>
      <form className="add-todo" onSubmit={postTodo}>
        <input
          value={todoText}
          onChange={onChangeTodoText}
          placeholder="Todoを入力してください"
        />
        <Button variant="outline" color="black" type="submit">
          追加
        </Button>
      </form>
    </Box>
  );
}

// export default Home;
