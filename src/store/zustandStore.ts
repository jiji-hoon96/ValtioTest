import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Todo } from "../App";

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
}

export const useZustandStore = create<TodoState>()(
  immer((set) => ({
    todos: [],
    addTodo: (text) =>
      set((state) => {
        state.todos.push({
          id: Date.now(),
          text,
          done: false,
        });
      }),
    toggleTodo: (id) =>
      set((state) => {
        const todo = state.todos.find((todo) => todo.id === id);
        if (todo) {
          todo.done = !todo.done;
        }
      }),
    removeTodo: (id) =>
      set((state) => {
        state.todos = state.todos.filter((todo) => todo.id !== id);
      }),
  }))
);
