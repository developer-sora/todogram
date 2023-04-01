export default function Template() {
  // `` 변환하시오.
  this.defaultTemplate =
    '<li data-id="{{id}}" class="{{completed}}">' +
    '<div class="view">' +
    '<input class="toggle" type="checkbox" {{checked}}>' +
    '<label class="list_elem">{{title}}</label>' +
    '<button class="destroy"></button>' +
    "</div>" +
    "</li>";
}

Template.prototype.show = function (data) {
  let i, l;
  let view = "";

  for (i = 0, l = data.length; i < l; i++) {
    let template = this.defaultTemplate;
    let completed = "";
    let checked = "";

    if (data[i].completed) {
      completed = "completed";
      checked = "checked";
    }

    template = template.replace("{{id}}", data[i].id);
    template = template.replace("{{title}}", data[i].title);
    template = template.replace("{{completed}}", completed);
    template = template.replace("{{checked}}", checked);

    view = view + template;
  }
  return view;
};
