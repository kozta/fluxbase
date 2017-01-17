import Rx from 'rx';

export function Dispatcher () {
  this.stream = new Rx.Subject();
  this.dispatch = function (payload) {
    this.stream.onNext(payload);
  };
};

export default Dispatcher;
