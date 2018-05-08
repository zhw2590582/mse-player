import mitt from 'mitt';
import MSE from './mse';
import MediaElement, { propertys, methods, events } from './mediaElement';

interface Options {
	target: string;
	type: string;
	url: string;
}

class MsePlayer {
	private options: Options;
	private videoElement: HTMLVideoElement;
	private mediaElement: any;
	private mse: any;
	private emitter: any;

	constructor(options: Options) {
		this.options = {
			...MsePlayer.DEFAULTS,
			...options
		};

    this.videoElement = document.querySelector(this.options.target);
    this.emitter = mitt();
		this._init();
	}

	private static get DEFAULTS(): Options {
		return {
			target: '',
			type: '',
			url: ''
		};
	}

	private _init() {
		this.mse = new MSE(this);
		this.mediaElement = new MediaElement(this);
		// console.log(this);
	}
}

(<any>window).MsePlayer = MsePlayer;
export default MsePlayer;
