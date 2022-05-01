import { useEffect, useState } from 'react';
import Video from 'twilio-video';

const MIN_ROOM_NAME_LENGTH = 16;

export function useMeet() {
	const [room, setRoom] = useState(null);
	const [participants, setParticipants] = useState([
		// {
		// 	id: 1,
		// 	name: 'David copia',
		// 	image: 'https://avatars.githubusercontent.com/u/32694631?v=4',
		// },
		// {
		// 	id: 2,
		// 	name: 'David copia',
		// 	image: 'https://avatars.githubusercontent.com/u/32694631?v=4',
		// },
		// {
		// 	id: 3,
		// 	name: 'David copia',
		// 	image: 'https://avatars.githubusercontent.com/u/32694631?v=4',
		// },
		// {
		// 	id: 4,
		// 	name: 'David copia',
		// 	image: 'https://avatars.githubusercontent.com/u/32694631?v=4',
		// },
		// {
		// 	id: 4,
		// 	name: 'David copia',
		// 	image: 'https://avatars.githubusercontent.com/u/32694631?v=4',
		// },
		// {
		// 	id: 4,
		// 	name: 'David copia',
		// 	image: 'https://avatars.githubusercontent.com/u/32694631?v=4',
		// },
		// {
		// 	id: 4,
		// 	name: 'David copia',
		// 	image: 'https://avatars.githubusercontent.com/u/32694631?v=4',
		// },
		// {
		// 	id: 4,
		// 	name: 'David copia',
		// 	image: 'https://avatars.githubusercontent.com/u/32694631?v=4',
		// },
	]);
	const [token, setToken] = useState(null);
	const [roomName, setRoomName] = useState('');
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		const participantConnected = participant => {
			setParticipants(prevParticipants => [...prevParticipants, participant]);
		};

		const participantDisconnected = participant => {
			setParticipants(prevParticipants =>
				prevParticipants.filter(p => p !== participant)
			);
		};

		if (room) {
			room.participants.forEach(participantConnected);
			room.on('participantConnected', participantConnected);
			room.on('participantDisconnected', participantDisconnected);

			return () => {
				room.off('participantConnected', participantConnected);
				room.off('participantDisconnected', participantDisconnected);
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

		const data = await fetch('/api/token', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: `${username} copia`, room: roomName }),
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

		console.log({ token, roomNameServer });

		setToken(token);
		setRoomName(roomNameServer);
		setLoading(false);

		return Promise.resolve(roomNameServer);
	};

	const initializeMeet = async () => {
		setLoading(true);
		try {
			const videoRoom = await Video.connect(token, {
				name: roomName,
				video: true,
				audio: true,
			});

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
			room.localParticipant.tracks.forEach(trackPublication => {
				const attachedElements = trackPublication.track.detach();
				attachedElements.forEach(element => element.remove());
			});
			room.disconnect();
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
	};
}
