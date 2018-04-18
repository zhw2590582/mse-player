import Emitter from 'tiny-emitter';

class MsePlayer extends Emitter {
  constructor(options) {
    super();
    this.options = {
      ...MsePlayer.DEFAULTS,
      ...options
    };

    this._init();
  }

  static get DEFAULTS() {
    return {

    };
  }

  _init() {
    console.log(this)
  }
}

window.MsePlayer = MsePlayer;
export default MsePlayer;