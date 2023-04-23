import { MODAL_TEXT, NO_DATA_TEXT } from '../constant/textData.js';

export default function Template() {
  this.defaultTemplate = data => `
  <li data-id="${data.id}" class="px-3 relative">
    <div class="view relative flex">
      <input class="toggle checked:border w-8 border-none appearance-none absolute inset-y-0 cursor-pointer peer/input" type="checkbox" ${
        data.completed ? 'checked' : ''
      }>
      </input>
      <label class="list_elem w-full pl-10 my-2 bg-22 bg-no-repeat 
      transition 
      peer-checked/input:bg-heart-fill peer-checked/input:text-gray-300
      peer-checked/input:line-through bg-heart-border bg-left list_elem block break-all
      peer/text dark:bg-heart-border-white dark:text-slate-100 peer-checked/input:dark:bg-heart-fill-purple peer-checked/input:dark:text-slate-400
      ">
        ${data.title}
      </label>
      <button class="editButton m-auto cursor-pointer w-6 h-8 text-2xl absolute right-0 inset-y-0 bg-19 bg-no-repeat bg-center bg-icon-editMenu dark:invert"></button>
    </div>
    <ul class="editMenu absolute top-0 right-[35px] w-20 h-20 ml-20 rounded-xl bg-white border text-sm dark:bg-slate-700 z-10 hidden">
      <li class="editItem h-1/2 flex items-center justify-center cursor-pointer dark:text-slate-200 hover:opacity-40">수정</li>
      <hr/>
      <li class="delete h-1/2 flex items-center justify-center cursor-pointer dark:text-slate-200 hover:opacity-40">삭제</li>
    </ul>
  </li>`;

  this.dropModalTemplate = status => `
  <div id="modalBackground" class="flex justify-center items-center fixed top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-[.8]">
    <div class="min-w-[290px] w-auto h-42 bg-white rounded-xl relative dark:bg-slate-600 dark:text-slate-100">
      <button id="exit" class="cursor-pointer w-6 h-6 text-xl font-semibold absolute right-0 mr-3 mt-2">x</button>
      <div class="pt-12 pb-7 px-6 text-center break-all">${MODAL_TEXT[status]}</div>
      <hr />
      <div class="flex">
        <button id="cancel" class="w-1/2 h-12">취소</button>
        <div class="border-l"></div>
        <button id="drop" class="w-1/2 text-red-500">삭제</button>
      </div>
    </div>
  </div>`;

  this.noDataTemplate = status => `
  <div class="text-center mt-20 h-full text-stone-500 dark:text-slate-300">${NO_DATA_TEXT[status]}</div>
  `;
}

Template.prototype.showMainTemplate = function (data) {
  if (data.length === 0) {
    const currentPage = document.location.hash;
    const status = currentPage.includes('completed') ? 'completed' : 'default';
    return this.noDataTemplate(status);
  }
  let view = '';
  data.forEach(value => {
    view += this.defaultTemplate(value);
  });
  return view;
};

Template.prototype.showModalTemplate = function () {
  const currentPage = document.location.hash;
  const status = currentPage.includes('completed') ? 'completed' : currentPage.includes('active') ? 'active' : 'all';
  return this.dropModalTemplate(status);
};
