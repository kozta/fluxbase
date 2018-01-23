import { Subject } from 'rxjs';

export class Store {
    constructor() {
        this.link = undefined;
        this.type = undefined;
        this.stream = new Subject();
    }

    dispatch(action) {
        this.stream.next({store: this, action});
    }

    get(path) {}
    set(path, value) {}
    sync(path, callback) {}
}

export default Store;