import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Video from 'twilio-video';
import Notification from '~/components/Notification';
import { debounce } from '~/libs/debounce';
import { DEBOUNCE_TIMEOUT, MIN_ROOM_NAME_LENGTH } from '~/utils/constans';

export function useMeet() {
	const [localTracks, setLocalTracks] = useState([]);
	const [room, setRoom] = useState(null);
	const [participants, setParticipants] = useState([]);
	const [token, setToken] = useState(null);
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

	const joinRoom = async ({ username, roomName }) => {
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
		localStorage.setItem('roomName', roomName);
		setToken(token);
		setLoading(false);

		return Promise.resolve(roomName);
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
		localStorage.setItem('roomName', roomNameServer);
		setToken(token);
		setLoading(false);

		return Promise.resolve(roomNameServer);
	};

	const initializeMeet = async () => {
		setLoading(true);

		const tracks = await Video.createLocalTracks({
			audio: { facingMode: 'user' },
			video: { facingMode: 'user' },
		});

		if (token === null) {
			setLoading(false);
			throw new Error('Hubo un problema al conectarte a la sala 😔.');
		}

		const roomName = localStorage.getItem('roomName');

		if (roomName === null) {
			setLoading(false);
			throw new Error('Hubo un problema al conectarte a la sala 😔.');
		}

		const videoRoom = await Video.connect(token, {
			dominantSpeaker: true,
			name: roomName,
			tracks,
		});

		setSharingVideo(true);
		setSharingAudio(true);
		setLocalTracks(tracks);
		setRoom(videoRoom);
		setLoading(false);

		return Promise.resolve(roomName);
	};

	const leaveRoom = debounce(() => {
		setRoom(null);
		setToken(null);
		localStorage.removeItem('token');
		localStorage.removeItem('roomName');

		if (room) {
			room.localParticipant.tracks.forEach(publication => {
				publication.track.stop();
				const attachedElements = publication.track.detach();
				attachedElements.forEach(element => element.remove());
			});
			room.disconnect();
		}

		return Promise.resolve();
	}, DEBOUNCE_TIMEOUT);

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

	return {
		room,
		participants,
		token,
		isLoading,
		joinRoom,
		createRoom,
		initializeMeet,
		leaveRoom,
		toggleVideo,
		toggleAudio,
		isSharingVideo,
		isSharingAudio,
		isDomainSpeaker,
	};
}
