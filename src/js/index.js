import App from './app.js';

const todo = new App();

function setView() {
  todo.controller.setView(document.location.hash);
}

window.addEventListener('load', setView);
window.addEventListener('hashchange', setView);
