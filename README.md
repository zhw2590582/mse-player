# mse-player
基于MSE实现的视频分段加载播放器

## Usage

#### html
```html
    <video id="video" controls></video>
    <script src="msePlayer/msePlayer.js"></script>
```

#### js
```js
    var msePlayer = new MsePlayer({
        target: "#video", // video元素，必填
        url: window.location.href + 'video/frag_bunny.mp4', // 视频地址，必填
        type: 'mp4', // 视频类型，选填
        mimeCodec: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', // 编码解码器，选填
        segmentLength: 1048576 // 分段长度，选填
    });

    console.log(msePlayer);
```

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)