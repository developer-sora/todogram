import { MODAL_TEXT, NO_DATA_TEXT } from '../constant/textData.js';

export default class Template {
  constructor() {
    this.defaultTemplate = this.createDefaultTemplate();
    this.dropModalTemplate = this.createDropModalTemplate();
    this.noDataTemplate = this.createNoDataTemplate();
  }

  createDefaultTemplate() {
    return data => `
    <li data-id="${data.id}" class="px-3 relative">
      <div class="view relative flex">
        <input class="toggle checked:border w-8 border-none appearance-none absolute inset-y-0 cursor-pointer peer/input" type="checkbox" ${
          data.completed ? 'checked' : ''
        }aria-label="완료하기">
        <label class="list_elem text-sm inline-block pl-10 my-2 mr-4 bg-22 bg-no-repeat 
        transition 
        peer-checked/input:bg-heart-fill peer-checked/input:text-gray-300
        peer-checked/input:line-through bg-heart-border bg-left break-all
        peer/text dark:bg-heart-border-white dark:text-slate-100 peer-checked/input:dark:bg-heart-fill-purple peer-checked/input:dark:text-slate-400
        ">
          ${data.title}
        </label>
        <button class="editButton m-auto cursor-pointer w-6 h-8 text-2xl absolute right-0 inset-y-0 bg-19 bg-no-repeat bg-center bg-icon-editMenu dark:invert" aria-label="할 일 설정"></button>
      </div>
      <ul class="editMenu absolute top-0 right-[35px] w-20 h-20 ml-20 rounded-xl bg-white border text-sm dark:bg-slate-700 z-10 hidden" aria-label="수정 모드">
        <li class="editItem h-1/2 flex items-center justify-center cursor-pointer dark:text-slate-200 hover:opacity-40">수정</li>
        <hr>
        <li class="delete h-1/2 flex items-center justify-center cursor-pointer dark:text-slate-200 hover:opacity-40">삭제</li>
      </ul>
    </li>`;
  }

  createDropModalTemplate() {
    return status => `
    <div id="dropModalBackground" class="flex justify-center items-center fixed top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-[.8]">
      <div class="min-w-[290px] w-auto h-42 bg-white rounded-xl relative dark:bg-slate-600 dark:text-slate-100">
        <button id="exit" class="cursor-pointer w-6 h-6 text-xl font-semibold absolute right-0 mr-3 mt-2">x</button>
        <div class="pt-12 pb-7 px-6 text-center break-all">${MODAL_TEXT[status]}</div>
        <hr>
        <div class="flex">
          <button id="cancel" class="w-1/2 h-12">취소</button>
          <div class="border-l"></div>
          <button id="drop" class="w-1/2 text-red-500">삭제</button>
        </div>
      </div>
    </div>`;
  }

  createNoDataTemplate() {
    return status => `
    <div class="text-center mt-20 h-full text-stone-500 dark:text-slate-300">${NO_DATA_TEXT[status]}</div>
    `;
  }

  showMainTemplate(data) {
    if (data.length === 0) {
      const currentPage = document.location.hash;
      const status = currentPage.includes('completed') ? 'completed' : 'default';
      return this.noDataTemplate(status);
    }
    return data.map(this.defaultTemplate).join('');
  }

  showModalTemplate() {
    const currentPage = document.location.hash;
    const status = currentPage.includes('completed') ? 'completed' : currentPage.includes('active') ? 'active' : 'all';
    return this.dropModalTemplate(status);
  }
}
