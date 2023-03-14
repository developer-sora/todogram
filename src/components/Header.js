export default function Header({ $target }) {
  this.target = $target;
}

Header.prototype.render = function () {
  const $header = document.createElement("header");
  $header.innerHTML = `
    <h1>todos</h1>
  `;
  this.target.appendChild($header);
};
