import { useEffect, useState } from 'react';
import Video from 'twilio-video';

const MIN_ROOM_NAME_LENGTH = 16;

export function useMeet() {
	const [localTracks, setLocalTracks] = useState([]);
	const [room, setRoom] = useState(null);
	const [participants, setParticipants] = useState([]);
	const [token, setToken] = useState(null);
	const [roomName, setRoomName] = useState('');
	const [isLoading, setLoading] = useState(false);
	const [isSharingVideo, setSharingVideo] = useState(false);
	const [isSharingAudio, setSharingAudio] = useState(false);

	useEffect(() => {
		const udpateParticipants = () => {
			setParticipants(Array.from(room.participants.values()));
			console.log(room.participants);
		};

		if (room) {
			// console.log({ room });
			room.participants.forEach(udpateParticipants);
			room.on('participantConnected', udpateParticipants);
			room.on('participantDisconnected', udpateParticipants);

			// room.on('participantConnected', participantConnected);
			// room.on('participantDisconnected', participantDisconnected);

			room.on('trackPublished', udpateParticipants);
			room.on('trackUnpublished', udpateParticipants);

			return () => {
				room.off('participantConnected', udpateParticipants);
				room.off('participantDisconnected', udpateParticipants);
				room.off('trackPublished', udpateParticipants);
				room.off('trackUnpublished', udpateParticipants);
				// room.off('participantDisconnected', participantDisconnected);
				// room.off('trackPublished', track => {
				// 	console.log('track published', track);
				// });
				// room.on('trackUnpublished', track => {
				// 	console.log('track unpublished', track);
				// });
			};
		}
	}, [room]);

	const joinRoom = async ({ username }) => {
		setLoading(true);

		if (roomName === '' || roomName.length < MIN_ROOM_NAME_LENGTH) {
			setLoading(false);
			throw new Error(
				'No se encontró la sala a la que intentas unirte. Por favor, verifica el nombre de la sala  y vuelve a intentarlo.'
			);
		}

		const count = participants.length;

		const data = await fetch('/api/token', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: `${username} ${count}`,
				room: roomName,
			}),
		}).then(res => res.json());

		const [token] = data;

		setToken(token);
		setLoading(false);
	};

	const createRoom = async ({ username }) => {
		setLoading(true);

		const data = await fetch('/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username }),
		}).then(res => res.json());

		const [token, roomNameServer] = data;

		setToken(token);
		setRoomName(roomNameServer);
		setLoading(false);

		return Promise.resolve(roomNameServer);
	};

	const initializeMeet = async () => {
		setLoading(true);

		try {
			const tracks = await Video.createLocalTracks({
				audio: { facingMode: 'user' },
				video: { facingMode: 'user' },
			});

			const videoRoom = await Video.connect(token, {
				name: roomName,
				tracks,
			});

			setSharingVideo(true);
			setSharingAudio(true);
			setLocalTracks(tracks);
			setRoom(videoRoom);
			setLoading(false);
		} catch (error) {
			console.error('initializeMeet Error: ', error);
			setLoading(false);
		}
	};

	const leaveRoom = () => {
		setRoom(null);
		setToken(null);
		setRoomName('');
		if (room) {
			room.localParticipant.tracks.forEach(publication => {
				publication.track.stop();
				const attachedElements = publication.track.detach();
				attachedElements.forEach(element => element.remove());
			});
			room.disconnect();
		}
	};

	const toggleVideo = () => {
		const track = localTracks.find(track => track.kind === 'video');

		if (track.isEnabled) {
			track.disable();
			setSharingVideo(false);
			room.localParticipant.unpublishTrack(track);
		} else {
			track.enable();
			setSharingVideo(true);
			room.localParticipant.publishTrack(track);
		}
	};

	const toggleAudio = () => {
		const track = localTracks.find(track => track.kind === 'audio');
		console.log(track.isEnabled);
		if (track.isEnabled) {
			track.disable();
			setSharingAudio(false);
			room.localParticipant.unpublishTrack(track);
		} else {
			track.enable();
			setSharingAudio(true);
			room.localParticipant.publishTrack(track);
		}
	};

	const clearRoomName = () => {
		setRoomName('');
	};

	const changeRoomName = roomName => {
		setRoomName(roomName);
	};

	return {
		room,
		participants,
		token,
		roomName,
		isLoading,
		joinRoom,
		createRoom,
		initializeMeet,
		leaveRoom,
		clearRoomName,
		changeRoomName,
		toggleVideo,
		toggleAudio,
		isSharingVideo,
		isSharingAudio,
	};
}
