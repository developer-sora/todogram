export function init(saveItem) {
  this.saveItem = saveItem;
}

export function save(key, item) {
  this.saveItem.save(key, item);
}
export function localSave(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}

export function localRead(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function findParent(element, tagName) {
  if (!element.parentNode) {
    return;
  }
  if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
    return element.parentNode;
  }
  return findParent(element.parentNode, tagName);
}
