import mitt from './mitt';
import MSE from './mse';
import MediaElement from './mediaElement';
import MseError from './mseError';
import 'whatwg-fetch';

interface Options {
	target: string;
	type: string;
	url: string;
	mimeCodec: string;
}

class MsePlayer {
	private options: Options;
	private videoElement: HTMLVideoElement;
	private mediaElement: any;
	private mse: any;
	private emitter: any;

	constructor(options: Options) {
		this.options = Object.assign({}, MsePlayer.DEFAULTS, options);
		Object.assign(this.constructor.prototype, mitt());
		this.videoElement = <HTMLVideoElement>document.querySelector(
			this.options.target
		);
		if (!this.videoElement || this.videoElement.tagName !== 'VIDEO') {
			throw new MseError(`Can't find video element: ${this.options.target}`);
		}
		this.init();
	}

	private static get DEFAULTS(): Options {
		return {
			target: '',
			type: '',
			url: '',
			mimeCodec: ''
		};
	}

	private init() {
		this.mediaElement = new MediaElement(this);
		this.mse = new MSE(this);
		// console.log(this);
	}
}

(<any>window).MsePlayer = MsePlayer;
export default MsePlayer;
