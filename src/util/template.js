const template = data => `<li data-id="${data.id}" class="${data.completed ? 'completed' : ''}">
    <div class="view">
    <input class="toggle" type="checkbox" ${data.completed ? 'checked' : ''}>
    <label class="list_elem">${data.title}</label>
    <button class="destroy"></button>
    </div>
    </li>`;

export default function showTemplate(data) {
  let view = '';
  data.forEach(value => {
    view += template(value);
  });
  return view;
}
