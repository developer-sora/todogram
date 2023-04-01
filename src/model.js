export default function Model(storage) {
  this.storage = storage;
}

Model.prototype.read = function (id) {
  if (id) {
    return this.storage.readItem(id);
  } else return this.storage.readAll();
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

Model.prototype.update = function (id, updateData) {
  this.storage.updateItemSave(id, updateData);
};
