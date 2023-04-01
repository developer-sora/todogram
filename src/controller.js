export default function Controller(model, view) {
  const self = this;
  self.model = model;
  self.view = view;
  self.view.render("showMain");
  self.view.bind("addItem", function (title) {
    self.addItem(title);
  });
  self.view.bind("deleteItem", function (id) {
    self.deleteItem(id);
  });
  self.view.bind("toggleItem", function (updateData) {
    self.toggleItem(updateData);
  });
  self.view.bind("editItem", function (id) {
    self.editItem(id);
  });
  self.view.bind("editItemDone", function (updateData) {
    self.editItemSave(updateData);
  });
}

Controller.prototype.showAll = function () {
  const data = this.model.read();
  this.view.render("showEntries", data);
};

Controller.prototype.addItem = function (title) {
  this.model.create(title);
  this.view.render("addItem");
  this.showAll();
};

Controller.prototype.deleteItem = function (id) {
  this.model.delete(id);
  this.view.render("deleteItem", id);
};

Controller.prototype.toggleItem = function (updateData) {
  const { id, completed } = updateData;
  this.model.update(id, { completed: completed });
  this.view.render("toggleItem", updateData);
};

Controller.prototype.editItem = function (id) {
  const data = this.model.read(id);
  this.view.render("editItem", data[0]);
};

Controller.prototype.editItemSave = function (updateData) {
  const { id, title } = updateData;
  if (title.length !== 0) {
    this.model.update(id, { title: title });
    this.view.render("editItemDone", { id, title });
  } else {
    this.deleteItem(id);
  }
};

/*
self.model.create(title, function () {
			self.view.render('clearNewTodo');
			self._filter(true);
		});

    model안에 view.render를 넘기는 이유?
 */
