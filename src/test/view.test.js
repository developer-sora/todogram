import { fireEvent } from '@testing-library/dom';
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

  // render 메서드 테스트
  test('render메서드에 있는 커맨드가 아닌 경우 아무 것도 하지 않는다', () => {
    view.render('test');
  });

  test('darkMode커맨드를 호출하면 다크모드인 경우 dark 클래스가 생기고, 아닌 경우 없어진다.', () => {
    view.render('darkMode');
    expect(document.documentElement).toHaveClass('dark');
    view.render('darkMode');
    expect(document.documentElement).not.toHaveClass('dark');
  });

  test('showDate커맨드를 호출하면 오늘의 날짜가 렌더링된다.', () => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;
    view.render('showDate');
    expect(mockDate.innerHTML).toBe(formattedDate);
  });

  test('할 일 목록이 있을 때 화면에 할 일 목록이 나타난다.', () => {
    expect(mockTodoList.innerHTML).toContain('test1');
  });

  test('할 일 목록이 없을 때 전부 삭제 버튼을 disabled 처리한다.', () => {
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
      expect(mockPostButton).toBeDisabled();
    }
  });

  test('addItemDone 커맨드가 인풋 입력 필드를 비운다', () => {
    mockNewTodo.value = 'New todo';
    view.render('addItemDone');
    expect(mockNewTodo.value).toBe('');
  });

  test('해당 할 일의 수정(edit) 모드를 열고 닫을 수 있다.', () => {
    // 열기 테스트
    view.render('openEditMenu', 1);
    const editMenu = document.querySelector('[data-id="1"] ul');
    expect(editMenu).toHaveClass('opened');

    // 닫기 테스트
    view.render('closeEditMenu');
    expect(editMenu).toHaveClass('hidden');
  });

  test('수정 모드를 열 때 주어진 ID를 가진 요소가 없으면 아무 것도 일어나지 않는다.', () => {
    expect(view.render('openEditMenu', 999));
  });

  test('수정 모드를 닫을 때 수정 모드가 열려있지 않으면 아무 것도 일어나지 않는다.', () => {
    expect(view.render('closeEditMenu'));
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

  test('deleteItem 커맨드는 주어진 ID를 가진 요소가 없으면 아무 것도 하지 않는다.', () => {
    view.render('deleteItem', 999);
  });

  test('할 일 목록의 완료/미완료 처리를 토글할 수 있다.', () => {
    // 완료 처리
    view.render('toggleItem', { id: 1, completed: true });
    const inputElem = document.querySelector('[data-id="1"] input');
    expect(inputElem.checked).toBe(true);
    // 미완료 처리
    view.render('toggleItem', { id: 1, completed: false });
    expect(inputElem.checked).toBe(false);
  });

  test('toggleItem 커맨드는 주어진 ID를 가진 요소가 없으면 아무 것도 하지 않는다.', () => {
    view.render('toggleItem', { id: 999, completed: false });
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

    // input 필드가 생기고 해당 value에 할 일 목록이 들어가야 함
    expect(input.value).toBe('test1');
  });

  test('editItem 커맨드는 주어진 ID를 가진 요소가 없으면 아무 것도 하지 않는다.', () => {
    view.render('editItem', { id: 999, title: 'test' });
  });

  test('수정이 완료되면 input창을 지우고 텍스트가 수정된 텍스트로 변경된다.', () => {
    view.render('editItem', { id: 1, title: 'test1' });
    view.render('editItemDone', { id: 1, title: 'update!' });

    const elem = document.querySelector('[data-id="1"]');
    const div = elem.querySelector('div');
    const input = elem.querySelector('#edit');
    const label = elem.querySelector('label');
    expect(div.classList.contains('hidden')).toBe(false);
    expect(input).toBeNull();
    expect(label.textContent).toBe('update!');
  });

  test('editItemDone 커맨드는 주어진 ID를 가진 요소가 없으면 undefined를 return한다.', () => {
    expect(view.render('editItemDone', { id: 999 })).toBeUndefined();
  });

  test('editItemDone 커맨드는 수정하는 input 요소가 없으면 undefined를 return한다.', () => {
    expect(view.render('editItemDone', { id: 2 })).toBeUndefined();
  });

  test('완료 상태에 따른 할 일 목록 수를 업데이트 할 수 있다.', () => {
    view.render('updateElementCount', {
      total: 4,
      active: 1,
      completed: 3,
    });
    expect(mockActiveCounter.innerHTML).toBe('1');
    expect(mockCompletedCounter.innerHTML).toBe('3');
  });

  // bind 메서드 테스트
  test('존재하지 않는 이벤트를 호출하면 아무것도 하지 않는다.', () => {
    const handler = jest.fn();
    view.bind('nonExistentEvent', handler);

    expect(handler).not.toHaveBeenCalled();
  });

  test('turnDarkMode 이벤트가 다크 모드 토글을 설정한다.', () => {
    const handler = jest.fn();
    view.bind('turnDarkMode', handler);

    fireEvent.click(document.querySelector('#dark-mode-toggle'));
    expect(handler).toHaveBeenCalled();
  });

  test('controlPostButton 이벤트가 텍스트에 따라 버튼을 활성화/비활성화한다.', () => {
    const handler = jest.fn();
    view.bind('controlPostButton', handler);

    // 텍스트가 있으면 버튼 활성화
    fireEvent.keyUp(mockNewTodo, { target: { value: 'New Todo' } });
    expect(handler).toHaveBeenCalledWith('active');

    // 텍스트가 없으면 버튼 비활성화
    fireEvent.keyUp(mockNewTodo, { target: { value: '' } });
    expect(handler).toHaveBeenCalledWith('disable');
  });

  test('addItemDone 이벤트가 인풋 텍스트가 빈 문자열일 경우 호출되지 않는다.', () => {
    const handler = jest.fn();
    view.bind('addItemDone', handler);

    fireEvent.keyUp(mockNewTodo, { key: 'Enter', target: { value: '' } });
    expect(handler).not.toHaveBeenCalled();
  });

  test('addItemDone 이벤트가 텍스트를 입력하고 엔터를 누르거나 post 버튼을 클릭했을 때 호출된다.', () => {
    const handler = jest.fn();
    view.bind('addItemDone', handler);

    fireEvent.keyUp(mockNewTodo, { key: 'Enter', target: { value: 'New Todo' } });
    fireEvent.click(mockPostButton);

    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler).toHaveBeenCalledWith('New Todo');
  });

  test('openEditMenu 이벤트가 edit 버튼 클릭 시 호출된다.', () => {
    const handler = jest.fn();
    view.bind('openEditMenu', handler);

    fireEvent.click(document.querySelector('[data-id="1"] .editButton'));
    expect(handler).toHaveBeenCalledWith(1);
  });

  test('openEditMenu 이벤트가 edit 버튼이 아닌 다른 부분을 클릭하면 호출되지 않는다', () => {
    const handler = jest.fn();
    view.bind('openEditMenu', handler);

    fireEvent.click(document.querySelector('[data-id="1"]'));
    expect(handler).not.toHaveBeenCalled();
  });

  test('closeEditMenu 이벤트가 edit 버튼이 아닌 다른 부분을 클릭 하면 호출된다.', () => {
    const handler = jest.fn();
    view.bind('closeEditMenu', handler);

    fireEvent.click(document.body); // edit 버튼이 아닌 부분 클릭
    expect(handler).toHaveBeenCalled();
  });

  test('closeEditMenu 이벤트가 edit 버튼 클릭 시 호출되지 않는다.', () => {
    const handler = jest.fn();
    view.bind('closeEditMenu', handler);

    fireEvent.click(document.querySelector('[data-id="1"] .editButton')); // edit 버튼 클릭
    expect(handler).not.toHaveBeenCalled();
  });

  test('deleteItem 이벤트가 삭제 버튼 클릭 시 호출된다.', () => {
    const handler = jest.fn();
    view.bind('deleteItem', handler);

    fireEvent.click(document.querySelector('[data-id="1"] .delete'));
    expect(handler).toHaveBeenCalledWith(1);
  });

  test('deleteItem 이벤트가 삭제 버튼이 아닌 다른 부분을 클릭하면 호출되지 않는다.', () => {
    const handler = jest.fn();
    view.bind('deleteItem', handler);

    fireEvent.click(document.querySelector('[data-id="1"]'));
    expect(handler).not.toHaveBeenCalled();
  });

  test('openDropModal 이벤트가 삭제 모달 열기 버튼 클릭 시 호출된다.', () => {
    const handler = jest.fn();
    view.bind('openDropModal', handler);

    fireEvent.click(mockAllDestroy);
    expect(handler).toHaveBeenCalled();
  });

  test('closeDropModal 이벤트가 모달 닫기 버튼/x버튼/모달 외의 부분 클릭 시 호출된다.', () => {
    view.render('openDropModal');

    const handler = jest.fn();
    view.bind('closeDropModal', handler);

    fireEvent.click(document.querySelector('#dropModalBackground'));
    fireEvent.click(document.querySelector('#exit'));
    fireEvent.click(document.querySelector('#cancel'));

    expect(handler).toHaveBeenCalledTimes(3);
  });

  test('dropItemsDone 이벤트가 삭제 모달 내 삭제 버튼 클릭 시 호출된다.', () => {
    view.render('openDropModal');

    const handler = jest.fn();
    view.bind('dropItemsDone', handler);

    fireEvent.click(document.querySelector('#drop'));
    expect(handler).toHaveBeenCalled();
  });

  test('dropItemsDone 이벤트가 삭제 모달 내 삭제 버튼이 아닌 부분을 클릭하면 호출되지 않는다.', () => {
    view.render('openDropModal');

    const handler = jest.fn();
    view.bind('dropItemsDone', handler);

    // drop 버튼이 아닌 다른 요소 클릭
    const otherButton = document.createElement('button');
    otherButton.id = 'cancel';
    mockModal.appendChild(otherButton);

    fireEvent.click(otherButton);

    expect(handler).not.toHaveBeenCalled();
  });

  test('toggleItem 이벤트가 할 일 토글 체크박스 클릭 시 호출된다.', () => {
    const handler = jest.fn();
    view.bind('toggleItem', handler);

    fireEvent.click(document.querySelector('[data-id="1"] .toggle'));
    expect(handler).toHaveBeenCalledWith({ id: 1, completed: true });
  });

  test('toggleItem 이벤트가 할 일 요소에서 토글 체크박스가 아닌 다른 부분을 클릭하면 호출되지 않는다.', () => {
    const handler = jest.fn();
    view.bind('toggleItem', handler);

    fireEvent.click(document.querySelector('[data-id="1"]'));
    expect(handler).not.toHaveBeenCalled();
  });

  test('toggleAll 이벤트가 전체 완료/미완료 토글 클릭 시 호출된다.', () => {
    const handler = jest.fn();
    view.bind('toggleAll', handler);

    fireEvent.click(mockToggleAll);
    expect(handler).toHaveBeenCalledWith(true);
  });

  test('editItem 이벤트가 할 일 더블 클릭 혹은 수정 모드 수정 버튼 클릭시 호출된다.', () => {
    const handler = jest.fn();
    view.bind('editItem', handler);
    fireEvent.dblClick(document.querySelector('[data-id="1"] .list_elem'));
    fireEvent.click(document.querySelector('[data-id="1"] .editItem'));
    expect(handler).toHaveBeenCalledTimes(2);
  });

  test('editItem 이벤트가 할 일 요소의 list_elem 클래스가 아닌 요소를 더블 클릭 혹은 수정 모드의 수정 버튼 이외의 버튼을 클릭하면 호출되지 않는다.', () => {
    const handler = jest.fn();
    view.bind('editItem', handler);
    fireEvent.dblClick(document.querySelector('[data-id="1"]'));
    fireEvent.click(document.querySelector('[data-id="1"]'));
    expect(handler).not.toHaveBeenCalled();
  });

  test('editItemDone 이벤트가 ID가 "edit"인 요소에서 blur 및 Enter 키 이벤트에 적절하게 반응한다.', () => {
    view.render('editItem', { id: 1, title: 'test1' });

    const handler = jest.fn();
    view.bind('editItemDone', handler);

    const inputElem = mockTodoList.querySelector('[data-id="1"] #edit');
    const otherElem = document.createElement('button');
    otherElem.id = 'non-edit';
    mockTodoList.appendChild(otherElem);

    // blur 이벤트 테스트 (id가 'edit'인 경우)
    fireEvent.blur(inputElem, { target: { value: 'Updated Item' } });
    expect(handler).toHaveBeenCalledWith({
      id: 1,
      title: 'Updated Item',
    });

    // blur 이벤트 테스트 (id가 'edit'가 아닌 경우)
    const otherBlurSpy = jest.spyOn(otherElem, 'blur');
    fireEvent.blur(otherElem);
    expect(otherBlurSpy).not.toHaveBeenCalled();

    // Enter 키 테스트 (id가 'edit'인 경우)
    const blurSpy = jest.spyOn(inputElem, 'blur');
    fireEvent.keyPress(inputElem, { key: 'Enter' });
    expect(blurSpy).toHaveBeenCalled();

    // 다른 키 입력 테스트 (blur가 호출되지 않음)
    fireEvent.keyPress(inputElem, { key: 'A' });
    expect(blurSpy).toHaveBeenCalledTimes(1);

    // id가 'edit'가 아닌 요소에서 Enter 키 테스트
    const otherBlurEnterSpy = jest.spyOn(otherElem, 'blur');
    fireEvent.keyPress(otherElem, { key: 'Enter' });
    expect(otherBlurEnterSpy).not.toHaveBeenCalled();
  });
});
