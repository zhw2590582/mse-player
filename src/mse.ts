import MseError from './mseError';

interface MediaSourceType {
    propertys?: string[];
    methods?: string[];
    events?: string[];
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

export const sourceBufferListType: MediaSourceType = {
    propertys: [
        'length'
    ],
    events: [
        'addsourcebuffer',
        'removesourcebuffer'
    ]
}

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
        this.sblAddsourcebuffer = this.sblAddsourcebuffer.bind(this);
        this.sblRemovesourcebuffer = this.sblRemovesourcebuffer.bind(this);
        this.asblAddsourcebuffer = this.asblAddsourcebuffer.bind(this);
        this.asblRemovesourcebuffer = this.asblRemovesourcebuffer.bind(this);
        this.init();
    }

    private init() {
        if (MediaSource.isTypeSupported(this.msePlayer.options.mimeCodec)) {
            this.msInstance = new MediaSource();
            this.msePlayer.videoElement.src = URL.createObjectURL(this.msInstance);

            this.msInstance.addEventListener('sourceopen', this.msSourceOpen);
            this.msInstance.addEventListener('sourceclose', this.msSourceClose);
            this.msInstance.addEventListener('sourceended', this.msSourceEnded);
            
            this.msInstance.sourceBuffers.addEventListener('addsourcebuffer', this.sblAddsourcebuffer);
            this.msInstance.sourceBuffers.addEventListener('removesourcebuffer', this.sblRemovesourcebuffer);

            this.msInstance.activeSourceBuffers.addEventListener('addsourcebuffer', this.asblAddsourcebuffer);
            this.msInstance.activeSourceBuffers.addEventListener('removesourcebuffer', this.asblRemovesourcebuffer);
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

    private sblAddsourcebuffer(e: Event) {
        console.log('sblAddsourcebuffer');
    }

    private sblRemovesourcebuffer(e: Event) {
        console.log('sblRemovesourcebuffer');
    }

    private asblAddsourcebuffer(e: Event) {
        console.log('asblAddsourcebuffer');
    }

    private asblRemovesourcebuffer(e: Event) {
        console.log('asblRemovesourcebuffer');
    }

    private fetchUrl(url: string) {
        console.log('fetchUrl: ' + url);
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
        this.msInstance.removeEventListener('sourceopen', this.msSourceOpen);
        this.msInstance.removeEventListener('sourceclose', this.msSourceClose);
        this.msInstance.removeEventListener('sourceended', this.msSourceEnded);
    }

    public destroySBL() {
        this.msInstance.sourceBuffers.removeEventListener('addsourcebuffer', this.sblAddsourcebuffer);
        this.msInstance.sourceBuffers.removeEventListener('removesourcebuffer', this.sblRemovesourcebuffer);
    }

    public destroyASBL() {
        this.msInstance.activeSourceBuffers.removeEventListener('addsourcebuffer', this.asblAddsourcebuffer);
        this.msInstance.activeSourceBuffers.removeEventListener('removesourcebuffer', this.asblRemovesourcebuffer);
    }

    public destroyURL(){
        URL.revokeObjectURL(this.msePlayer.videoElement.src);
    }
}
