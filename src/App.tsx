import React from "react";
import "./App.css";
import TodoInput from "./components/todoInput";
import TodoList from "./components/todoList";
import { useZustandStore } from "./store/zustandStore";
import { useSnapshot } from "valtio";
import { valtioActions, valtioState } from "./store/valtioStore";

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export interface TodoListProps<
  T extends { id: number; text: string; done: boolean }
> {
  todos: readonly T[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  title: string;
}

function App() {
  const zustandTodos = useZustandStore((state) => state.todos);
  const {
    addTodo: addZustandTodo,
    toggleTodo: toggleZustandTodo,
    removeTodo: removeZustandTodo,
  } = useZustandStore();

  // Valtio
  const valtioSnapshot = useSnapshot(valtioState);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">
        Todo App - State Management Comparison
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 bg-gray-50 rounded">
          <h2 className="text-xl font-bold mb-4">Zustand + Immer</h2>
          <TodoInput onAdd={addZustandTodo} />
          <TodoList
            title="Zustand Todos"
            todos={zustandTodos}
            onToggle={toggleZustandTodo}
            onRemove={removeZustandTodo}
          />
        </div>

        <div className="p-4 bg-gray-50 rounded">
          <h2 className="text-xl font-bold mb-4">Valtio</h2>
          <TodoInput onAdd={valtioActions.addTodo} />
          <TodoList
            title="Valtio Todos"
            todos={valtioSnapshot.todos}
            onToggle={valtioActions.toggleTodo}
            onRemove={valtioActions.removeTodo}
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h3 className="font-bold mb-2">State Updates Log</h3>
        <button
          onClick={() => {
            console.log("Zustand State:", useZustandStore.getState());
            console.log("Valtio State:", valtioSnapshot);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Log Current State
        </button>
      </div>
    </div>
  );
}

export default App;
