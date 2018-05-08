export const propertys: string[] = [
	'audioTracks',
	'autoplay',
	'buffered',
	'controller',
	'controls',
	'crossOrigin',
	'currentSrc',
	'currentTime',
	'defaultMuted',
	'defaultPlaybackRate',
	'duration',
	'ended',
	'error',
	'loop',
	'mediaGroup',
	'muted',
	'networkState',
	'paused',
	'playbackRate',
	'played',
	'preload',
	'readyState',
	'seekable',
	'seeking',
	'src',
	'startDate',
	'textTracks',
	'videoTracks',
	'volume'
];

export const methods: string[] = [
	'addTextTrack',
	'canPlayType',
	'load',
	'play',
	'pause'
];

export const events: string[] = [
	'abort',
	'canplay',
	'canplaythrough',
	'durationchange',
	'emptied',
	'ended',
	'error',
	'loadeddata',
	'loadedmetadata',
	'loadstart',
	'pause',
	'play',
	'playing',
	'progress',
	'ratechange',
	'seeked',
	'seeking',
	'stalled',
	'suspend',
	'timeupdate',
	'volumechange',
	'waiting'
];

export default class MediaElement {
	private msePlayer: any;
	private videoElement: HTMLVideoElement;
	[prop: string]: any;

	constructor(msePlayer: any) {
		this.msePlayer = msePlayer;
		this.videoElement = msePlayer.videoElement;
		this._addProperty();
		this._addMethods();
		this._addEvents();
	}

	private _addProperty(): void {
		for (let index = 0; index < propertys.length; index++) {
			let property = propertys[index];
			// @ts-ignore
			this[property] = this.videoElement[property];
		}
	}

	private _addMethods(): void {
		for (let index = 0; index < methods.length; index++) {
			let method = methods[index];
			// @ts-ignore
			this[method] = this.videoElement[method];
		}
	}

	private _addEvents(): void {
		for (let index = 0; index < events.length; index++) {
			let event = events[index];
			this.videoElement.addEventListener(event, (e: Event) => {
				this.msePlayer.emitter.emit(event, e);
			});
		}
	}
}
