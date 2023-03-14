import { localSave } from "../util/helper.js";

export default function TodoList({ $div, todoList }) {
  this.div = $div;

  this.todoList = todoList;

  this.updateState = (nextState) => {
    this.todoList = nextState;
    this.render();
  };

  this.allCompleteTodo = (status) => {
    const todoList = [...this.todoList];
    todoList.forEach((v) => (v.completed = status));
    this.todoList = todoList;
    localSave("todoList", this.todoList);
  };

  this.completeTodo = (id, status) => {
    const todoList = [...this.todoList];
    const index = todoList.findIndex((v) => v.id === id);
    if (status === "complete") {
      todoList[index].completed = true;
    } else {
      todoList[index].completed = false;
    }
    todoList.splice(index, 1, todoList[index]);
    this.todoList = todoList;
    localSave("todoList", this.todoList);
  };

  this.updateTodo = (id, text) => {
    const todoList = [...this.todoList];
    const index = todoList.findIndex((v) => v.id === id);
    todoList[index].title = text;
    todoList.splice(index, 1, todoList[index]);
    this.updateState(todoList);
  };

  this.addTodo = (item) => {
    const addedTodo = [...this.todoList, item];
    this.updateState(addedTodo);
  };

  this.deleteTodo = (id) => {
    const deletedTodo = this.todoList.filter((v) => v.id !== id);
    this.updateState(deletedTodo);
  };

  this.createTodoElem = ($ul, item) => {
    const $li = document.createElement("li");
    $li.setAttribute("data-id", item.id);
    const $div = document.createElement("div");
    $div.className = "view";
    const $checkbox = document.createElement("input");
    $checkbox.type = "checkbox";
    $checkbox.className = "complete-check";
    const $label = document.createElement("label");
    $label.appendChild(document.createTextNode(item.title));
    const $button = document.createElement("button");
    $button.className = "distroy";

    if (item.completed) {
      $li.className = "completed";
      $checkbox.checked = true;
    }

    $checkbox.addEventListener("click", (e) => {
      const $li = e.target.parentElement.parentElement;
      const li_id = Number($li.dataset.id);
      if ($checkbox.checked) {
        $li.className = "completed";
        this.completeTodo(li_id, "complete");
      } else {
        $li.className = "";
        this.completeTodo(li_id, "cancel");
      }
    });

    $label.addEventListener("dblclick", (e) => {
      const $li = e.target.parentElement.parentElement;
      const li_id = Number($li.dataset.id);
      $li.className = "editing";
      const $input = document.createElement("input");
      $input.className = "edit";
      $input.value = e.target.innerText;
      $input.addEventListener("change", (e) => {
        this.updateTodo(li_id, e.target.value);
      });
      $li.appendChild($input);
    });

    $div.addEventListener("mouseover", () => {
      $button.innerText = "X";
    });

    $div.addEventListener("mouseout", () => {
      $button.innerText = "";
    });

    $button.addEventListener("click", (e) => {
      const $li = e.target.parentElement.parentElement;
      const li_id = Number($li.dataset.id);
      this.deleteTodo(li_id);
    });

    $div.appendChild($checkbox);
    $div.appendChild($label);
    $div.appendChild($button);
    $li.appendChild($div);
    $ul.appendChild($li);

    return $li;
  };
}

TodoList.prototype.render = function () {
  this.div.innerHTML = "";

  const $ul = document.createElement("ul");
  const $input = document.createElement("input");
  $input.type = "checkbox";
  $input.className = "toggle-all";
  $input.id = "toggle-all";
  const $label = document.createElement("label");
  $label.className = "toggle-all";

  $label.addEventListener("click", (e) => {
    if ($input.checked) {
      $input.checked = false;
    } else {
      $input.checked = true;
    }
    const checkboxes = document.querySelectorAll(".complete-check");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = $input.checked;
    });
    $ul.childNodes.forEach(
      (v) => (v.className = $input.checked ? "completed" : "")
    );
    this.allCompleteTodo($input.checked);
  });

  this.div.appendChild($input);
  this.div.appendChild($label);
  this.div.appendChild($ul);

  this.todoList.forEach((v) => {
    this.createTodoElem($ul, v);
  });

  localSave("todoList", this.todoList);
};

//    좋은 코드
//    1. 사람이 알아보기 쉬워야 한다.
//    2. 예측 가능해야 한다.
//    3. 확장 되어야 한다.
//    4. 변경이 막혀야 있어야 한다.
//    5. 하나의 함수는 한가지 일만 해야 한다.
//    6. 함수는 반드시 동일한 파라미터에 동일한 결과가 나와야 한다. (순수함수)
//    7. 불변 한 변수, 함수로 만들어라
