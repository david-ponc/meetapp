import { ArrowLeftIcon } from '@primer/octicons-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import Participant from '~/components/participant';
import { AuthContext } from '~/contexts';
import { MeetContext } from '~/contexts/meet-context';
import Video from 'twilio-video';

function getTimeNow() {
	const date = new Date();
	const time = date.toLocaleTimeString('es-MX', {
		hour: '2-digit',
		minute: '2-digit',
	});
	return time;
}

export default function Room() {
	const router = useRouter();
	const [time, setTime] = useState(getTimeNow);
	// const { isLoading } = useContext(AuthContext);
	const { initializeMeet, room, leaveRoom, participants, roomName } =
		useContext(MeetContext);

	useEffect(() => {
		initializeMeet();
		const updateTime = () => {
			const now = getTimeNow();
			setTime(now);
		};

		// Video.createLocalVideoTrack()
		// 	.then(localTrack => {
		// 		console.log({ localTrack });
		// 	})
		// 	.catch(error =>
		// 		console.log(
		// 			'gestionar fallback para cuando no hay permisos. (mostrar la imagen y el nombre del usuario)',
		// 			error
		// 		)
		// 	);

		setInterval(updateTime, 1000);

		return () => {
			clearInterval(updateTime);
		};
	}, []);

	const handleLeaveRoom = () => {
		leaveRoom();
		router.replace('/');
	};

	// if (!room) {
	// 	return <p>Loading...</p>;
	// }

	return (
		<main className='w-full h-screen grid grid-rows-room-layout'>
			<section className='bg-slate-900 p-6'>
				<section className='flex flex-wrap gap-4'>
					{/* {room && <Participant participant={room.localParticipant} />} */}
				</section>
				<section className='gap-4 grid grid-cols-participants-layout auto-rows-participants'>
					{room && <Participant participant={room.localParticipant} />}
					{/* {!isLoading && (
						<section
							ref={localParticipantRef}
							className='bg-slate-800 rounded-lg flex flex-col items-center justify-center gap-4 aspect-video overflow-hidden'
						>
							<figure className='w-16 h-16 rounded-full overflow-hidden relative p-2'>
								<Image src={user.image} alt={user.name} layout='fill' />
							</figure>
							<p className='text-lg font-medium text-slate-100'>{user.name}</p>
							<div ref={videoRef} className='w-full'></div>
							<video style={{ width: '100%' }} ref={videoRef} autoPlay={true} />
							<audio ref={null} autoPlay={true} muted={true} />
						</section>
					)} */}
					{participants.map(participant => (
						<Participant key={participant.sid} participant={participant} />
						// <section
						// 	key={participant.id}
						// 	className='bg-slate-800 rounded-lg flex flex-col items-center justify-center p-2 gap-4 aspect-video'
						// >
						// 	<figure className='w-16 h-16 rounded-full overflow-hidden relative'>
						// 		<Image
						// 			src={participant.image}
						// 			alt={participant.name}
						// 			layout='fill'
						// 		/>
						// 	</figure>
						// 	<p className='text-lg font-medium text-slate-100'>
						// 		{participant.name}
						// 	</p>
						// 	{/* <video style={{ width: '100%' }} ref={null} autoPlay={true} />
						// 	<audio ref={null} autoPlay={true} muted={true} /> */}
						// </section>
					))}
				</section>
			</section>
			<footer className='flex px-6 py-3 items-center justify-between bg-slate-800 text-slate-50'>
				<p className='flex items-center gap-4 font-semibold'>
					{time}
					<span className='h-4 w-[1px] bg-slate-50 inline-block'></span>
					{roomName}
				</p>
				<button
					onClick={handleLeaveRoom}
					className='py-2 px-4 rounded-md text-rose-500 bg-rose-300/10 text-sm font-medium'
				>
					<ArrowLeftIcon size={16} /> Salir de la reunión
				</button>
			</footer>
		</main>
	);
}
