// biome-ignore lint/style/useImportType: <explanation>
import { TodoListProps } from "../App";

function TodoList<T extends { id: number; text: string; done: boolean }>({
  todos,
  onToggle,
  onRemove,
  title,
}: TodoListProps<T>) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-3 bg-white rounded shadow"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => onToggle(todo.id)}
                className="mr-3"
              />
              <span className={todo.done ? "line-through text-gray-500" : ""}>
                {todo.text}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(todo.id)}
              className="px-2 py-1 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoList;
