# mse-player
> 基于MSE实现的视频分段加载播放器

## 使用

.html
```html
    <video id="video" controls></video>
    <script src="msePlayer.js"></script>
```

.js
```js
    // 可以使用 ES6 模块加载
    import MsePlayer from 'path/to/msePlayer.js';

    var msePlayer = new MsePlayer({
        target: "#video", // video元素，必填
        url: window.location.href + 'video/frag_bunny.mp4', // 视频地址，必填
        type: 'mp4', // 视频类型，选填，默认识别 url 后缀
        mimeCodec: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', // 编码解码器，选填，默认识别 type
        segmentLength: 1048576 // 分段长度，选填，默认1M
    });

    console.log(msePlayer);
```

## 开发

安装

```sh
$ npm install
```

开发

```sh
$ npm run dev
```

测试

```sh
$ npm run test
```

发布

```sh
$ npm run build
```

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)