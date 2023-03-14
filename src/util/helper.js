export function localSave(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}

export function localRead(key) {
  return JSON.parse(localStorage.getItem(key));
}
