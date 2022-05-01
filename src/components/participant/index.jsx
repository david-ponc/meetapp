import { useEffect, useState, useRef } from 'react';

export default function Participant({ participant }) {
	const [videoTracks, setVideoTracks] = useState([]);
	const [audioTracks, setAudioTracks] = useState([]);
	const videoRef = useRef();
	const audioRef = useRef();

	const trackpubsToTracks = trackMap =>
		Array.from(trackMap.values())
			.map(publication => publication.track)
			.filter(track => track !== null);

	useEffect(() => {
		setVideoTracks(trackpubsToTracks(participant.videoTracks));
		setAudioTracks(trackpubsToTracks(participant.audioTracks));

		const trackSubscribed = track => {
			if (track.kind === 'video') {
				setVideoTracks(videoTracks => [...videoTracks, track]);
			} else if (track.kind === 'audio') {
				setAudioTracks(audioTracks => [...audioTracks, track]);
			}
		};

		const trackUnsubscribed = track => {
			if (track.kind === 'video') {
				setVideoTracks(videoTracks => videoTracks.filter(v => v !== track));
			} else if (track.kind === 'audio') {
				setAudioTracks(audioTracks => audioTracks.filter(a => a !== track));
			}
		};

		participant.on('trackSubscribed', trackSubscribed);
		participant.on('trackUnsubscribed', trackUnsubscribed);

		return () => {
			setVideoTracks([]);
			setAudioTracks([]);
			participant.removeAllListeners();
		};
	}, [participant]);

	useEffect(() => {
		const [videoTrack] = videoTracks;
		if (videoTrack) {
			videoTrack.attach(videoRef.current);

			return () => {
				videoTrack.detach();
			};
		}
	}, [videoTracks]);

	useEffect(() => {
		const [audioTrack] = audioTracks;
		if (audioTrack) {
			audioTrack.attach(audioRef.current);

			return () => {
				audioTrack.detach();
			};
		}
	}, [audioTracks]);

	return (
		<section className='bg-slate-800 rounded-lg aspect-video overflow-hidden relative group border border-slate-800'>
			<span className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent group-hover:to-slate-900 transition-all'></span>
			<p className='absolute bottom-2 left-2 text-transparent group-hover:text-white'>
				{participant.identity}
			</p>
			<video style={{ width: '100%' }} ref={videoRef} autoPlay={true} />
			<audio ref={audioRef} autoPlay={true} muted={true} />
		</section>
	);
}
