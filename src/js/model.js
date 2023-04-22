export default function Model(storage) {
  this.storage = storage;
}

Model.prototype.read = function (query) {
  if (query) {
    return this.storage.read(query);
  }
  return this.storage.readAll();
};

Model.prototype.create = function (title) {
  const newTodos = {
    title,
    completed: false,
    id: new Date().getTime(),
  };
  this.storage.add(newTodos);
};

Model.prototype.delete = function (id) {
  this.storage.delete(id);
};

Model.prototype.drop = function (currentPage) {
  this.storage.drop(currentPage);
};

Model.prototype.update = function (id, updateData) {
  this.storage.update(id, updateData);
};

Model.prototype.toggleAll = function (completed) {
  this.storage.toggleAll(completed);
};

Model.prototype.getCount = function (callback) {
  const todos = {
    total: 0,
    active: 0,
    completed: 0,
  };

  const data = this.storage.readAll();

  data.forEach(todo => {
    if (todo.completed) {
      todos.completed++;
    } else todos.active++;
    todos.total++;
  });

  callback(todos);

  return todos;
};
