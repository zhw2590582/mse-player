import MseError from './mseError';

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
    private events: string[];

    constructor(msePlayer: any) {
        this.msePlayer = msePlayer;
        this.addEvents();
    }

    private addEvents(): void {
        this.events = events;
        for (let index = 0; index < events.length; index++) {
            let event = events[index];
            this.msePlayer.videoElement.addEventListener(event, (e: Event) => {
                this.msePlayer.emit(event, e);
            });
        }
    }
}
