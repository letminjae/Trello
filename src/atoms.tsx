import { atom } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}
interface IToDoState {
  [key: string]: ITodo[];
}

export const LOCAL_TODO = 'recoil_todos';

export const loadTodos = () => {
    const localTodos = localStorage.getItem(LOCAL_TODO);
    if (localTodos) {
        return JSON.parse(localTodos);
    }
    return null;
};

export const saveTodos = (todos: IToDoState) => {
    localStorage.setItem(LOCAL_TODO, JSON.stringify(todos));
};

export const defaultTodos: IToDoState = {
  "To Do": [],
  Doing: [],
  Done: [],
  "Do Later": [],
};

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: loadTodos() ?? defaultTodos,
});