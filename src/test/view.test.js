import { render, screen, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import View from '../js/view.js';
import Template from '../js/template.js';
import fs from 'fs';

describe('View 테스트', () => {
  let view;
  let template;
  let mockTodoList,
    mockNewTodo,
    mockToggleAll,
    mockModal,
    mockPostButton,
    mockDate,
    mockAllDestroy,
    mockActiveCounter,
    mockCompletedCounter;

  beforeEach(() => {
    const curHtml = fs.readFileSync('src/index.html', 'utf8');
    document.body.innerHTML = curHtml;
    template = new Template();
    view = new View(template);

    mockDate = document.querySelector('.date');
    mockTodoList = document.querySelector('#todo-list');
    mockNewTodo = document.querySelector('.new-todo');
    mockToggleAll = document.querySelector('#toggle-all');
    mockModal = document.querySelector('.modal');
    mockPostButton = document.querySelector('#post');
    mockAllDestroy = document.querySelector('.all-destroy');
    mockActiveCounter = document.querySelector('.active-count');
    mockCompletedCounter = document.querySelector('.completed-count');
    // given
    const todos = [
      {
        title: 'test1',
        completed: false,
        id: 1,
      },
      {
        title: 'test2',
        completed: true,
        id: 2,
      },
    ];

    view.render('showEntries', todos);
  });

  afterEach(() => {
    view.render('showEntries', []);
    jest.clearAllMocks();
  });

  test('darkMode를 호출하면 다크모드인 경우 dark 클래스가 생기고, 아닌 경우 없어진다.', () => {
    view.render('darkMode');
    expect(document.documentElement).toHaveClass('dark');
    view.render('darkMode');
    expect(document.documentElement).not.toHaveClass('dark');
  });

  test('showDate를 호출하면 오늘의 날짜가 렌더링된다.', () => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;
    view.render('showDate');
    expect(mockDate.innerHTML).toBe(formattedDate);
  });

  test('showEntries를 호출하면 할 일 목록이 있을 때 화면에 할 일 목록이 나타난다.', () => {
    expect(mockTodoList.innerHTML).toContain('test1');
  });

  test('showEntries를 호출하면 할 일 목록이 없을 때 전부 삭제 버튼을 disabled 처리한다.', () => {
    const todos = [];
    view.render('showEntries', todos);
    expect(mockAllDestroy).toBeDisabled();
  });

  test('인풋에 텍스트가 있으면 post 버튼이 활성화된다.', () => {
    fireEvent.change(mockNewTodo, { target: { value: 'New Todo' } });
    if (mockNewTodo.value === 'New Todo') {
      view.render('activePostButton');
      expect(mockPostButton).not.toBeDisabled();
    }
  });

  test('인풋이 비어있으면 post 버튼이 비활성화된다.', () => {
    fireEvent.change(mockNewTodo, { target: { value: '' } });
    if (mockNewTodo.value === '') {
      view.render('disablePostButton');
    }
    expect(mockPostButton).toBeDisabled();
  });

  test('addItemDone 메서드가 인풋 입력 필드를 비운다', () => {
    mockNewTodo.value = 'new todo';
    view.render('addItemDone');
    expect(mockNewTodo.value).toBe('');
  });

  test('해당 할 일의 수정(edit) 모드를 열고 닫을 수 있다.', () => {
    // 오류 처리
    expect(view.render('openEditMenu', 3)).toBeUndefined();
    expect(view.render('closeEditMenu')).toBeUndefined();

    // 열기 테스트
    view.render('openEditMenu', 1);
    const editMenu = document.querySelector('[data-id="1"] ul');
    expect(editMenu).toHaveClass('opened');

    // 닫기 테스트
    view.render('closeEditMenu');
    expect(editMenu).toHaveClass('hidden');
  });

  test('삭제 모달을 열고 닫을 수 있다.', () => {
    view.render('openDropModal');
    expect(mockModal.innerHTML).toContain('삭제할까요?');
    view.render('closeDropModal');
    expect(mockModal.innerHTML).toBe('');
  });

  test('할 일 목록을 하나 삭제하면 할 일 목록에서 해당 엘리멘트가 삭제된다.', () => {
    view.render('deleteItem', 1);
    expect(document.querySelector('[data-id="1"]')).toBeNull();
  });

  test('할 일 목록의 완료 처리를 토글할 수 있다.', () => {
    view.render('toggleItem', { id: 1, completed: true });
    const inputElem = document.querySelector('[data-id="1"] input');
    expect(inputElem.checked).toBe(true);
    view.render('toggleItem', { id: 1, completed: false });
    expect(inputElem.checked).toBe(false);
  });

  test('할 일 목록을 전부 완료/미완료 처리하는 토글을 할 수 있다.', () => {
    view.render('toggleAll', { completed: true });
    expect(mockToggleAll.checked).toBe(true);
    view.render('toggleAll', { completed: false });
    expect(mockToggleAll.checked).toBe(false);
  });

  test('할 일의 수정 모드가 활성화되면 수정할 수 있는 input창이 나타난다. ', () => {
    view.render('editItem', { id: 1, title: 'test1' });

    const elem = document.querySelector('[data-id="1"]');
    const div = elem.querySelector('div');
    const input = elem.querySelector('#edit');

    // div가 숨겨져야 함
    expect(div.classList.contains('hidden')).toBe(true);

    // input 필드가 추가되어야 함
    expect(input.value).toBe('test1');
  });

  test('수정이 완료되면 input창을 지우고 텍스트가 수정된 텍스트로 변경된다.', () => {
    view.render('editItemDone', { id: 1, title: 'update!' });

    const elem = document.querySelector('[data-id="1"]');
    const div = elem.querySelector('div');
    const input = elem.querySelector('#edit');
    const label = elem.querySelector('label');
    expect(div.classList.contains('hidden')).toBe(false);
    expect(input).toBeNull();
    expect(label.textContent).toBe('update!');
  });

  test('', () => {
    view.render('updateElementCount', {
      total: 2,
      active: 1,
      completed: 1,
    });
    expect(mockActiveCounter.innerHTML).toBe('1');
    expect(mockCompletedCounter.innerHTML).toBe('1');
  });
});
