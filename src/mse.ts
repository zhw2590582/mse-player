import MseError from './mseError';

interface MediaSourceType {
	propertys: string[];
	methods: string[];
	events: string[];
}

export const msInstanceType: MediaSourceType = {
	propertys: [
        'activeSourceBuffers',
        'duration',
        'readyState',
        'sourceBuffers'
    ],
	methods: [
		'addSourceBuffer',
		'endOfStream',
		'removeSourceBuffer',
		'clearLiveSeekableRange',
		'setLiveSeekableRange'
	],
	events: [
        'sourceclose',
        'sourceended',
        'sourceopen'
    ]
};

export const sourceBufferType: MediaSourceType = {
	propertys: [
        'mode',
        'updating',
        'buffered',
        'timestampOffset',
        'audioTracks',
        'videoTracks',
        'textTracks',
        'appendWindowStart',
        'appendWindowEnd',
        'trackDefaults'
    ],
	methods: [
        'appendBuffer',
        'appendStream',
        'abort',
        'remove'
    ],
	events: [
        'abort',
        'error',
        'update',
        'updateend',
        'updatestart'
    ]
};

export default class MSE {
	private msePlayer: any;
	private msInstance: any;
	private activeSourceBuffer: any;

	constructor(msePlayer: any) {
		this.msePlayer = msePlayer;
		this.msSourceOpen = this.msSourceOpen.bind(this);
		this.msSourceClose = this.msSourceClose.bind(this);
		this.msSourceEnded = this.msSourceEnded.bind(this);
		this.sbUpdatestart = this.sbUpdatestart.bind(this);
		this.sbUpdateend = this.sbUpdateend.bind(this);
		this.sbUpdate = this.sbUpdate.bind(this);
		this.sbError = this.sbError.bind(this);
		this.sbAbort = this.sbAbort.bind(this);
		this.init();
	}

	private init() {
		if (MediaSource.isTypeSupported(this.msePlayer.options.mimeCodec)) {
			this.msInstance = new MediaSource();
            this.msePlayer.videoElement.src = URL.createObjectURL(this.msInstance);
			this.msInstance.addEventListener('sourceopen', this.msSourceOpen);
			this.msInstance.addEventListener('sourceclose', this.msSourceClose);
			this.msInstance.addEventListener('sourceended', this.msSourceEnded);
		} else {
			throw new MseError(
				`Unsupported MIME type or codec: ${this.msePlayer.options.mimeCodec}`
			);
		}
	}

	private msSourceOpen(e: Event) {
        console.log('msSourceOpen');
        this.activeSourceBuffer = this.msInstance.addSourceBuffer(this.msePlayer.options.mimeCodec);
        this.activeSourceBuffer.addEventListener('abort', this.sbAbort);
        this.activeSourceBuffer.addEventListener('error', this.sbError);
        this.activeSourceBuffer.addEventListener('update', this.sbUpdate);
        this.activeSourceBuffer.addEventListener('updateend', this.sbUpdateend);
        this.activeSourceBuffer.addEventListener('updatestart', this.sbUpdatestart);

		// 一次性加载全部
		this.fetchUrl(this.msePlayer.options.url).then(response => {
			this.activeSourceBuffer.appendBuffer(response);
		});
    }
    
    private msSourceClose(e: Event) {
        console.log('msSourceClose');
    }

    private msSourceEnded(e: Event) {
        console.log('msSourceEnded');
    }

    private sbUpdatestart(e: Event) {
        console.log('sbUpdatestart');
    }

    private sbUpdateend(e: Event) {
        console.log('sbUpdateend');
        this.msInstance.endOfStream();
        this.msePlayer.videoElement.play();
    }

    private sbUpdate(e: Event) {
        console.log('sbUpdate');
    }

    private sbError(e: Event) {
        console.log('sbError');
    }

    private sbAbort(e: Event) {
        console.log('sbAbort');
    }

	private fetchUrl(url: string) {
		return fetch(url)
			.then(response => response.arrayBuffer())
			.catch(err => {
				throw new MseError(err.message);
			});
    }

    public destroyASB() {
        this.activeSourceBuffer.removeEventListener('abort', this.sbAbort);
        this.activeSourceBuffer.removeEventListener('error', this.sbError);
        this.activeSourceBuffer.removeEventListener('update', this.sbUpdate);
        this.activeSourceBuffer.removeEventListener('updateend', this.sbUpdateend);
        this.activeSourceBuffer.removeEventListener('updatestart', this.sbUpdatestart);
    }
    
    public destroyMS() {
        URL.revokeObjectURL(this.msePlayer.videoElement.src);
        this.msInstance.removeEventListener('sourceopen', this.msSourceOpen);
        this.msInstance.removeEventListener('sourceclose', this.msSourceClose);
        this.msInstance.removeEventListener('sourceended', this.msSourceEnded);
    }
}
