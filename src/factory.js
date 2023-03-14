import Header from "./components/Header.js";
import Input from "./components/Input.js";
import TodoList from "./components/TodoList.js";

export default function factoryMaker({
  $target,
  component,
  state,
  setTodoList,
}) {
  const $div = document.createElement("div");
  $div.className = "todo-list";
  $target.appendChild($div);

  if (component === "header") {
    return new Header({ $target });
  }
  if (component === "input") {
    return new Input({
      $div,
      setTodoList,
    });
  }
  if (component === "todoList") {
    return new TodoList({
      $div,
      todoList: state.todoList,
    });
  }
}
