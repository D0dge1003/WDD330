export default class LocalStorageHelper {
    constructor(key) {
        this.key = key;
    }

    get() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
    }

    set(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    add(item) {
        const list = this.get();
        // Check for duplicates based on the 'key' property
        if (!list.some(existing => existing.key === item.key)) {
            list.push(item);
            this.set(list);
            return true;
        }
        return false;
    }

    remove(keyId) {
        let list = this.get();
        list = list.filter(item => item.key !== keyId);
        this.set(list);
    }

    has(keyId) {
        const list = this.get();
        return list.some(item => item.key === keyId);
    }
}
