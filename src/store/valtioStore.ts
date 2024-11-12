import { proxy } from "valtio";
import { Todo } from "../App";

interface ValtioState {
  todos: Todo[];
}

export const valtioState = proxy<ValtioState>({
  todos: [],
});

export const valtioActions = {
  addTodo: (text: string) => {
    valtioState.todos.push({
      id: Date.now(),
      text,
      done: false,
    });
  },
  toggleTodo: (id: number) => {
    const todo = valtioState.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.done = !todo.done;
    }
  },
  removeTodo: (id: number) => {
    valtioState.todos = valtioState.todos.filter((todo) => todo.id !== id);
  },
};
