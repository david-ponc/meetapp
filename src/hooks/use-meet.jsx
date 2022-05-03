import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Video from 'twilio-video';
import Notification from '~/components/Notification';

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
	const [isDomainSpeaker, setDomainSpeaker] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem('token');
		setToken(token);
	}, []);

	useEffect(() => {
		const udpateParticipants = () =>
			setParticipants(Array.from(room.participants.values()));

		if (room) {
			// console.log({ room });
			room.participants.forEach(udpateParticipants);
			room.on('participantConnected', participant => {
				udpateParticipants();
				Notification(`${participant.identity} se ha unido a la sala`);
			});
			room.on('participantDisconnected', participant => {
				udpateParticipants();
				Notification(`${participant.identity} se ha salido de la sala`);
			});

			room.on('trackPublished', udpateParticipants);
			room.on('trackUnpublished', udpateParticipants);
			room.on('disconnected', () => {
				toast.success('Has salido de la sala');
			});
			room.on('dominantSpeakerChanged', participant => {
				console.log(participant?.identity, room.localParticipant.identity);
				setDomainSpeaker(
					participant?.identity === room.localParticipant.identity
				);
			});

			return () => {
				room.off('participantConnected', udpateParticipants);
				room.off('participantDisconnected', udpateParticipants);
				room.off('trackPublished', udpateParticipants);
				room.off('trackUnpublished', udpateParticipants);
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

		// const count = participants.length;

		const data = await fetch('/api/token', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username,
				room: roomName,
			}),
		}).then(res => res.json());

		const [token] = data;

		localStorage.setItem('token', token);
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

		localStorage.setItem('token', token);
		setToken(token);
		setRoomName(roomNameServer);
		setLoading(false);

		return Promise.resolve(roomNameServer);
	};

	const initializeMeet = async () => {
		setLoading(true);

		const tracks = await Video.createLocalTracks({
			audio: { facingMode: 'user' },
			video: { facingMode: 'user' },
		});

		if (token || localStorage.getItem('token')) {
			const videoRoom = await Video.connect(
				token || localStorage.getItem('token'),
				{
					dominantSpeaker: true,
					name: roomName,
					tracks,
				}
			);

			setSharingVideo(true);
			setSharingAudio(true);
			setLocalTracks(tracks);
			setRoom(videoRoom);
			setLoading(false);
		} else {
			leaveRoom();
			setLoading(false);
			throw new Error();
		}
	};

	const leaveRoom = () => {
		setRoom(null);
		setToken(null);
		setRoomName('');
		localStorage.removeItem('token');
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
		isDomainSpeaker,
	};
}
