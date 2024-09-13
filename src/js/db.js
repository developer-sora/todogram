export default class LocalStorageStorage {
  readAll(dbName) {
    return JSON.parse(localStorage.getItem(dbName)) || [];
  }

  save(dbName, data) {
    localStorage.setItem(dbName, JSON.stringify(data));
  }
}
