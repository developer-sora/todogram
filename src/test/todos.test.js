import { render, screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import Controller from '../js/controller.js';
import Store from '../js/store.js';
import Model from '../js/model.js';
import View from '../js/view.js';
import Template from '../js/template.js';
import mockHtml from './mockHtml.js';
import { NO_DATA_TEXT } from '../constant/textData.js';

describe('Controller', () => {
  class LocalStorageMock {
    constructor() {
      this.store = {};
    }

    clear() {
      this.store = {};
    }

    getItem(key) {
      return this.store[key] || null;
    }

    setItem(key, value) {
      this.store[key] = String(value);
    }

    removeItem(key) {
      delete this.store[key];
    }
  }

  let store;
  let model;
  let view;
  let template;
  let controller;

  beforeEach(() => {
    if (typeof window === 'undefined') {
      global.localStorage = new LocalStorageMock();
    }
    document.body.innerHTML = mockHtml;
    store = new Store('test');
    model = new Model(store);
    template = new Template();
    view = new View(template);
    controller = new Controller(model, view);
    controller.setView('');
  });

  test('할 일 목록이 하나도 없을 때 투두리스트를 작성해보세요 ✨ 택스트가 뜸', () => {
    //when
    const todoList = store.readAll();
    // if (todoList) console.log(store.readAll());
    //then
    expect(screen.getByText(NO_DATA_TEXT.default)).toBeInTheDocument();
  });
});
