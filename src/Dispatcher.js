import {Subject} from 'rx';

export function createDispatcher() {
  return {
    stream: new Subject(),

    dispatch(payload) {
      this.stream.onNext(payload);
    }
  };
};

export default createDispatcher;
