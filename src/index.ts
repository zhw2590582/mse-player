import mitt from './mitt';
import MSE from './mse';
import MediaElement from './mediaElement';
import MseError from './mseError';
import mimeCodeces from './mimeCodeces';
import 'whatwg-fetch';

interface Options {
    target: string;
    url: string;
    type?: string;
    mimeCodec?: string;
}

class MsePlayer {
    private options: Options;
    private videoElement: HTMLVideoElement;
    private mediaElement: any;
    private mse: any;

    constructor(options: Options) {
        this.options = this.verification(
            Object.assign({}, MsePlayer.DEFAULTS, options)
        );
        Object.assign(this.constructor.prototype, mitt());
        this.videoElement = <HTMLVideoElement>document.querySelector(
            this.options.target
        );
        if (!this.videoElement || this.videoElement.tagName !== 'VIDEO') {
            throw new MseError(`Can't find video's element: ${this.options.target}`);
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

    private verification(options: Options): Options {
        if (!options.url) {
            throw new MseError(`Can't find video's url`);
        }

        if (!options.type) {
            let urlArr = options.url.trim().toLocaleLowerCase().split('.');
            let type = urlArr[urlArr.length - 1];
            if (!type || !Object.keys(mimeCodeces).includes(type)) {
                throw new MseError(`Can't find video's type from ${options.url}`);
            } else {
                options.type = type;
            }
        }

        if (!options.mimeCodec) {
            let mimeCodec = mimeCodeces[options.type];
            if (!mimeCodec) {
                throw new MseError(`Can't find video's mimeCodec from ${options.type}`);
            } else {
                options.mimeCodec = mimeCodec;
            }
        }

        return options;
    }

    private init() {
        this.mediaElement = new MediaElement(this);
        this.mse = new MSE(this);
        // console.log(this);
    }
}

(<any>window).MsePlayer = MsePlayer;
export default MsePlayer;
