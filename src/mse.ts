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
    private contentLength: number;

    constructor(msePlayer: any) {
        this.msePlayer = msePlayer;
        this.msSourceopen = this.msSourceopen.bind(this);
        this.msSourceclose = this.msSourceclose.bind(this);
        this.msSourceended = this.msSourceended.bind(this);
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

            this.msInstance.addEventListener('sourceopen', this.msSourceopen);
            this.msInstance.addEventListener('sourceclose', this.msSourceclose);
            this.msInstance.addEventListener('sourceended', this.msSourceended);
            
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

    private msSourceopen(e: Event) {
        console.log('mediaSource: sourceopen');
        this.activeSourceBuffer = this.msInstance.addSourceBuffer(this.msePlayer.options.mimeCodec);
        this.activeSourceBuffer.addEventListener('abort', this.sbAbort);
        this.activeSourceBuffer.addEventListener('error', this.sbError);
        this.activeSourceBuffer.addEventListener('update', this.sbUpdate);
        this.activeSourceBuffer.addEventListener('updateend', this.sbUpdateend);
        this.activeSourceBuffer.addEventListener('updatestart', this.sbUpdatestart);

        // 一次性加载全部
        this.appendAll();

        // 分段加载
    }

    private appendAll() {
        this.fetchUrl(this.msePlayer.options.url).then(response => {
            this.activeSourceBuffer.appendBuffer(response);
        });
    }

    private appendSegment(chunk: any) {
        // 
    }
    
    private msSourceclose(e: Event) {
        console.log('mediaSource: sourceclose');
    }

    private msSourceended(e: Event) {
        console.log('mediaSource: sourceended');
    }

    private sbUpdatestart(e: Event) {
        console.log('sourceBuffer: updatestart');
    }

    private sbUpdateend(e: Event) {
        console.log('sourceBuffer: updateend');
        this.msInstance.endOfStream();
        this.msePlayer.videoElement.play();
    }

    private sbUpdate(e: Event) {
        console.log('sourceBuffer: update');
    }

    private sbError(e: Event) {
        console.log('sourceBuffer: error');
    }

    private sbAbort(e: Event) {
        console.log('sourceBuffer: abort');
    }

    private sblAddsourcebuffer(e: Event) {
        console.log('sourceBufferList: addsourcebuffer');
    }

    private sblRemovesourcebuffer(e: Event) {
        console.log('sourceBufferList: removesourcebuffer');
    }

    private asblAddsourcebuffer(e: Event) {
        console.log('activeSourceBufferList: addsourcebuffer');
    }

    private asblRemovesourcebuffer(e: Event) {
        console.log('activeSourceBufferList: removesourcebuffer');
    }

    private fetchUrl(url: string) {
        console.log('fetch: ' + url);
        return fetch(url)
            .then(response => {
                if (!this.contentLength) {
                    this.contentLength = Number(response.headers.get('content-length'));
                    console.log('content-length: ' + this.contentLength);
                }
                return response.arrayBuffer();
            })
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
        this.msInstance.removeEventListener('sourceopen', this.msSourceopen);
        this.msInstance.removeEventListener('sourceclose', this.msSourceclose);
        this.msInstance.removeEventListener('sourceended', this.msSourceended);
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
