import Store from "./store.js";
import Model from "./model.js";
import Template from "./template.js";
import Controller from "./controller.js";
import View from "./view.js";

export const App = {
  init() {
    // template method design pattern

    // TemplateMethod
    //   .Controler(Model(Store('todoList')), View(Template())).showAll();

    // 전역변수로 쓰는 이유가 있는가?
    const storage = new Store("todoList");
    this.model = new Model(storage);
    this.template = new Template();
    this.view = new View(this.template);
    this.controller = new Controller(this.model, this.view);
    this.controller.showAll();
  },
};
