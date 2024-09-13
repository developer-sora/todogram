import { render, screen, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import View from '../js/view.js';
import Template from '../js/template.js';
import fs from 'fs';

describe('View 테스트', () => {
  let view;
  let template;

  beforeEach(() => {
    const curHtml = fs.readFileSync('src/index.html', 'utf8');
    document.body.innerHTML = curHtml;
    template = new Template();
    view = new View(template);
  });

  afterEach(() => {});

  test('오늘 날짜가 표시된다.', () => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;
    view.render('showDate');
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  test('토글을 통해 다크모드를 설정할 수 있다.', () => {
    view.render('darkMode');
    expect(document.documentElement).toHaveClass('dark');
    view.render('darkMode');
    expect(document.documentElement).not.toHaveClass('dark');
  });

  test('할 일을 추가하면 화면에 추가된 할 일 목록이 나타난다.', () => {
    const items = [
      {
        title: 'test1',
        completed: false,
        id: new Date().getTime(),
      },
    ];
    view.render('showEntries', items);
    expect(screen.getByText('test1')).toBeInTheDocument();
  });

  test('인풋에 텍스트가 있으면 post 버튼이 활성화된다.', () => {
    const input = screen.getByPlaceholderText('What needs to be done?');
    const postButton = screen.getByRole('button', { name: /post/i });
    fireEvent.change(input, { target: { value: 'New Todo' } });
    if (input.value === 'New Todo') {
      view.render('activePostButton');
    }
    expect(postButton).not.toBeDisabled();
  });

  test('인풋이 비어있으면 post 버튼이 비활성화된다.', () => {
    const input = screen.getByPlaceholderText('What needs to be done?');
    const postButton = screen.getByRole('button', { name: /post/i });
    fireEvent.change(input, { target: { value: '' } });
    if (input.value === '') {
      view.render('disablePostButton');
    }
    expect(postButton).toBeDisabled();
  });

  test('해당 할 일의 수정(edit) 모드를 열고 닫을 수 있다.', () => {
    const items = [
      {
        title: 'test1',
        completed: false,
        id: new Date().getTime(),
      },
    ];
    view.render('showEntries', items);
    view.render('openEditMenu', items[0].id);
    const editMenu = screen.getByRole('list', { name: '수정 모드' });
    expect(editMenu).toHaveClass('opened');
    view.render('closeEditMenu');
    expect(editMenu).toHaveClass('hidden');
  });

  test('삭제 모달을 열고 닫을 수 있다.', () => {
    view.render('openDropModal');
    const modalBackground = document.getElementById('dropModalBackground');
    expect(modalBackground).toBeInTheDocument();
    view.render('closeDropModal');
    expect(modalBackground).not.toBeInTheDocument();
  });

  test('에러', () => {
    function throwError() {
      throw new Error('Something went wrong');
    }
    expect(throwError).toThrow(); // 통과
    expect(throwError).toThrow('Something went wrong'); // 통과
  });
});
