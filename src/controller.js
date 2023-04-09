export default function Controller(model, view) {
  const self = this;
  self.model = model;
  self.view = view;
  self.view.render('showMain');
  self.view.bind('addItem', title => {
    self.addItem(title);
  });
  self.view.bind('deleteItem', id => {
    self.deleteItem(id);
  });
  self.view.bind('toggleItem', updateData => {
    self.toggleItem(updateData);
  });
  self.view.bind('editItem', id => {
    self.editItem(id);
  });
  self.view.bind('editItemDone', updateData => {
    self.editItemSave(updateData);
  });
  self.view.bind('showActive', () => {
    self.showActive();
  });
  self.view.bind('showCompleted', () => {
    self.showCompleted();
  });
  self.view.bind('dropItems', () => {
    self.dropItems();
  });
}

Controller.prototype.showAll = function () {
  const data = this.model.read();
  this.updateCount();
  this.view.render('showEntries', data);
};

Controller.prototype.showActive = function () {
  const data = this.model.read({ completed: false });
  this.view.render('showEntries', data);
};

Controller.prototype.showCompleted = function () {
  const data = this.model.read({ completed: true });
  this.view.render('showEntries', data);
};

Controller.prototype.addItem = function (title) {
  this.model.create(title);
  this.view.render('addItem');
  this.showAll();
};

Controller.prototype.deleteItem = function (id) {
  this.model.delete(id);
  this.updateCount();
  this.view.render('deleteItem', id);
};

Controller.prototype.dropItems = function () {
  this.model.drop();
  this.showAll();
};

Controller.prototype.toggleItem = function (updateData) {
  const { id, completed } = updateData;
  this.model.update(id, { completed });
  this.view.render('toggleItem', updateData);
  this.updateCount();
};

Controller.prototype.editItem = function (id) {
  const data = this.model.read({ id: Number(id) });
  this.view.render('editItem', data[0]);
};

Controller.prototype.editItemSave = function (updateData) {
  const { id, title } = updateData;
  if (title.length !== 0) {
    this.model.update(id, { title });
    this.view.render('editItemDone', { id, title });
  } else {
    this.deleteItem(id);
  }
};

Controller.prototype.updateCount = function () {
  this.model.getCount(todos => {
    this.view.render('updateElementCount', todos);
  });
};

/*
self.model.create(title, function () {
			self.view.render('clearNewTodo');
			self._filter(true);
		});

    model안에 view.render를 넘기는 이유?
 */
