export default function Input({ $div, setTodoList }) {
  this.div = $div;
  this.setTodoList = setTodoList;
}

Input.prototype.render = function () {
  const $input = document.createElement("input");
  $input.className = "new-todo";
  $input.setAttribute("autofocus", true);
  $input.placeholder = "What needs to be done?";

  $input.addEventListener("keyup", (e) => {
    if (e.target.value !== "" && e.key === "Enter") {
      this.setTodoList(e.target.value);
      e.target.value = "";
    }
  });

  this.div.appendChild($input);
};
