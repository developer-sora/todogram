import Controller from '../js/controller.js';
import Model from '../js/model.js';
import View from '../js/view.js';
import Template from '../js/template.js';

jest.mock('../js/model.js');
jest.mock('../js/view.js');

describe('Controller', () => {
  let controller;
  let model;
  let template;
  let view;

  beforeEach(() => {
    model = new Model();
    // template = new Template();
    view = new View(template);
    controller = new Controller(model, view);
  });

  test('should add a new item', () => {
    const title = 'New Todo';
    controller.addItem(title);
    expect(model.create).toHaveBeenCalledWith(title);
    expect(view.render).toHaveBeenCalledWith('addItemDone');
  });

  test('should delete an item', () => {
    const id = 1;
    controller.deleteItem(id);
    expect(model.delete).toHaveBeenCalledWith(id);
    expect(view.render).toHaveBeenCalledWith('deleteItem', id);
  });

  test('should edit an item', () => {
    const id = 1;
    const title = 'Updated Todo';
    controller.editItemSave({ id, title });
    expect(model.update).toHaveBeenCalledWith(id, { title });
    expect(view.render).toHaveBeenCalledWith('editItemDone', { id, title });
  });

  test('should toggle item completion status', () => {
    const id = 1;
    const completed = true;
    controller.toggleItem({ id, completed });
    expect(model.update).toHaveBeenCalledWith(id, { completed });
    expect(view.render).toHaveBeenCalledWith('toggleItem', { id, completed });
  });
});
