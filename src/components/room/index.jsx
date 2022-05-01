import { useEffect, useState } from 'react';
import Participant from '~/components/participant';

export default function Room({ roomName, room, handleLogout }) {
	const [participants, setParticipants] = useState([]);

	useEffect(() => {
		const participantConnected = () => {
			const newParticipants = Array.from(room.participants.values());
			setParticipants(newParticipants);
		};

		const participantDisconnected = participant => {
			const newParticipants = Array.from(room.participants.values());
			console.log({ newParticipants });
			setParticipants(newParticipants);
		};

		room.participants.forEach(participantConnected);
		room.on('participantConnected', participantConnected);
		room.on('participantDisconnected', participantDisconnected);

		return () => {
			room.off('participantConnected', participantConnected);
			room.off('participantDisconnected', participantDisconnected);
		};
	}, [room]);

	return (
		<section>
			<header>
				<h1>Room: {roomName}</h1>
				<p>Total participants: {room.participants.size}</p>
				<button onClick={handleLogout}>Logout</button>
			</header>
			<section>
				<div style={{ maxWidth: '300px', margin: '0 auto' }}>
					{room ? (
						<Participant
							key={room.localParticipant.sid}
							participant={room.localParticipant}
						/>
					) : (
						''
					)}
				</div>
			</section>
			<main>
				<h2>Remote Participants</h2>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill,minmax(300px, 1fr))',
						gap: '1.5rem',
					}}
				>
					{participants.map(
						participant =>
							participant.state !== 'disconnected' && (
								<Participant key={participant.sid} participant={participant} />
							)
					)}
				</div>
			</main>
		</section>
	);
}
