export default function Model(storage) {
  this.storage = storage;
}

Model.prototype.read = function (query) {
  if (query) {
    return this.storage.readItem(query);
  }
  return this.storage.readAll();
};

Model.prototype.create = function (title) {
  const newTodoList = {
    title,
    completed: false,
    id: new Date().getTime(),
  };
  this.storage.newItemSave(newTodoList);
};

Model.prototype.delete = function (id) {
  this.storage.deleteItemSave(id);
};

Model.prototype.drop = function (currentPage) {
  this.storage.dropItemsSave(currentPage);
};

Model.prototype.update = function (id, updateData) {
  this.storage.updateItemSave(id, updateData);
};

Model.prototype.getCount = function (callback) {
  const todos = {
    active: 0,
    completed: 0,
  };

  const data = this.storage.readAll();

  data.forEach(todo => {
    if (todo.completed) {
      todos.completed++;
    } else todos.active++;
  });

  callback(todos);
};
