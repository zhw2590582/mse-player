import MseError from './mseError';

export const propertys: string[] = [];

export const methods: string[] = [];

export const events: string[] = [];

export default class MSE {
	private msePlayer: any;
	private mediaSource: any;

	constructor(msePlayer: any) {
		this.msePlayer = msePlayer;
		this.sourceOpen = this.sourceOpen.bind(this);
		this.init();
	}

	private init() {
		if (MediaSource.isTypeSupported(this.msePlayer.options.mimeCodec)) {
			this.mediaSource = new MediaSource();
			this.msePlayer.videoElement.src = URL.createObjectURL(this.mediaSource);
			this.mediaSource.addEventListener('sourceopen', this.sourceOpen);
		} else {
			throw new MseError(
				`Unsupported MIME type or codec: ${this.msePlayer.options.mimeCodec}`
			);
		}
	}

	private sourceOpen(e: Event) {
		let sourceBuffer = this.mediaSource.addSourceBuffer(
			this.msePlayer.options.mimeCodec
		);

		this.fetchUrl(this.msePlayer.options.url).then(response => {
			sourceBuffer.addEventListener('updateend', (e: Event) => {
				this.mediaSource.endOfStream();
				this.msePlayer.videoElement.play();
			});
			sourceBuffer.appendBuffer(response);
		});
	}

	private fetchUrl(url: string) {
		return fetch(url)
			.then(response => response.arrayBuffer())
			.catch(err => {
				throw new MseError(err);
			});
	}
}
