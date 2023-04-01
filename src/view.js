import { findParent } from "./util/helper.js";

export default function View(template) {
  this.template = template;
  this.$date = document.querySelector(".date");
  this.$todoList = document.querySelector(".todo-list");
  this.$newTodo = document.querySelector(".new-todo");
}

// 화살표 함수와 function() 차이점 공부

View.prototype.getDate = function () {
  const now = new Date();
  return `
  ${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} 
  `;
};

View.prototype._itemId = function (element) {
  const $li = findParent(element, "li");
  return parseInt($li.dataset.id, 10);
};

View.prototype.deleteItem = function (id) {
  const elem = document.querySelector('[data-id="' + id + '"]');
  if (elem) {
    this.$todoList.removeChild(elem);
  }
};

View.prototype.toggleItem = function (id, completed) {
  const elem = document.querySelector('[data-id="' + id + '"]');
  if (elem) {
    elem.classList.toggle("completed");
  }
  elem.querySelector("input").checked = completed;
};

View.prototype.editItem = function (id, title) {
  const elem = document.querySelector('[data-id="' + id + '"]');
  if (!elem) {
    return;
  }
  elem.classList.add("editing");
  const input = document.createElement("input");
  input.className = "edit";
  elem.appendChild(input);
  input.focus();
  input.value = title;
};

View.prototype.editItemDone = function (id, title) {
  const elem = document.querySelector('[data-id="' + id + '"]');
  if (!elem) {
    return;
  }
  elem.classList.remove("editing");
  const input = elem.querySelector(".edit");
  elem.removeChild(input);
  elem.querySelector("label").textContent = title;
};

View.prototype.render = function (viewCmd, parameter) {
  const viewCommands = {
    showMain: () => {
      this.$date.innerHTML = this.getDate();
    },
    showEntries: () => {
      this.$todoList.innerHTML = this.template.show(parameter);
    },
    addItem: () => {
      this.$newTodo.value = "";
    },
    deleteItem: () => {
      this.deleteItem(parameter);
    },
    toggleItem: () => {
      this.toggleItem(parameter.id, parameter.completed);
    },
    editItem: () => {
      this.editItem(parameter.id, parameter.title);
    },
    editItemDone: () => {
      this.editItemDone(parameter.id, parameter.title);
    },
  };
  viewCommands[viewCmd]();
};

View.prototype.bind = function (event, handler) {
  if (event === "addItem") {
    this.$newTodo.addEventListener("keyup", (e) => {
      if (e.target.value !== "" && e.key === "Enter") {
        handler(this.$newTodo.value);
      }
    });
  }
  if (event === "deleteItem") {
    this.$todoList.addEventListener("click", (e) => {
      if (e.target.className === "destroy") {
        handler(this._itemId(e.target));
      }
    });
  }
  if (event === "toggleItem") {
    this.$todoList.addEventListener("click", (e) => {
      if (e.target.className === "toggle") {
        handler({
          id: this._itemId(e.target),
          completed: e.target.checked,
        });
      }
    });
  }
  if (event === "editItem") {
    this.$todoList.addEventListener("dblclick", (e) => {
      if (e.target.className === "list_elem") {
        handler(this._itemId(e.target));
      }
    });
  }
  if (event === "editItemDone") {
    this.$todoList.addEventListener(
      "blur",
      (e) => {
        if (e.target.className === "edit") {
          handler({
            id: this._itemId(e.target),
            title: e.target.value,
          });
        }
      },
      true
    );
    this.$todoList.addEventListener("keypress", (e) => {
      if (e.target.className === "edit" && e.key === "Enter") {
        e.target.blur();
      }
    });
  }
};

// blur에 true넣는 이유??
// 이벤트 캡쳐링..
