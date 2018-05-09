interface MimeCodec {
	[prop: string]: string;
}

const mimeCodeces: MimeCodec = {
	mp4: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
};

export default mimeCodeces;
