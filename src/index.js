import Rx from 'rxjs';

export class Store {
    constructor() {
        this.link = undefined;
        this.type = undefined;
        this.stream = new Rx.Subject();
    }

    get(path) {}
    set(path, value) {}
    sync(path, callback) {}
}

export default Store;