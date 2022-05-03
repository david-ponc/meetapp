import { PeopleIcon } from '@primer/octicons-react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { LocalParticipant, RemoteParticipant } from '~/components/participant';
import { MeetContext } from '~/contexts/meet-context';
import {
	Mic as MicIcon,
	MicMute as MicMuteIcon,
	Phone as PhoneIcon,
	VideoCamera as VideoCameraIcon,
	VideoCameraOff as VideoCameraOffIcon,
} from 'iconoir-react';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import Spinner from '~/components/spinner';

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
	const {
		initializeMeet,
		room,
		leaveRoom,
		participants,
		roomName,
		toggleVideo,
		toggleAudio,
		isSharingVideo,
		isSharingAudio,
		isDomainSpeaker,
	} = useContext(MeetContext);

	useEffect(() => {
		initializeMeet().catch(() => router.replace('/'));

		const updateTime = () => {
			const now = getTimeNow();
			setTime(now);
		};

		setInterval(updateTime, 1000);

		return () => {
			clearInterval(updateTime);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleLeaveRoom = () => {
		leaveRoom();
		router.replace('/');
	};

	return (
		<>
			<Head>
				<title>Meetapp | {roomName}</title>
				<link rel='icon' href='/favicon.ico' />
				<meta
					name='description'
					content='La plataforma de videoconferencias gratuita'
				/>
			</Head>

			<main className='w-full h-screen grid grid-rows-room-layout'>
				{room ? (
					<section className='bg-zinc-900 p-6 gap-4 grid grid-cols-participants-layout grid-rows-participants-layout justify-center lg:justify-start'>
						<LocalParticipant
							participant={room.localParticipant}
							isSharingVideo={isSharingVideo}
							isSharingAudio={isSharingAudio}
							isDomainSpeaker={isDomainSpeaker}
						/>

						{participants.map(participant => (
							<RemoteParticipant
								key={participant.sid}
								participant={participant}
								isDomainSpeaker={isDomainSpeaker}
							/>
						))}
					</section>
				) : (
					<section className='bg-zinc-900 flex flex-col justify-center items-center gap-4 text-zinc-50'>
						<Spinner className='text-indigo-300' />
						<p className='font-medium text-xl'>Loading...</p>
					</section>
				)}

				<footer className='flex px-6 py-3 items-center justify-between bg-zinc-800 text-zinc-50'>
					<p className='flex items-center gap-4 font-semibold'>
						<span className='hidden md:inline-block'>{time}</span>
						<span className='hidden md:inline-block h-4 w-[1px] bg-zinc-50'></span>
						<span className='whitespace-nowrap overflow-hidden text-ellipsis max-w-[56px] md:max-w-[auto]'>
							{roomName}
						</span>
					</p>
					<section className='flex items-center gap-2'>
						{room && (
							<>
								<button onClick={toggleVideo}>
									{isSharingVideo ? (
										<div className='p-2 rounded-xl hover:bg-zinc-700 text-zinc-400'>
											<VideoCameraIcon stroke={2} />
										</div>
									) : (
										<div className='p-2 rounded-xl bg-rose-500 text-zinc-50'>
											<VideoCameraOffIcon stroke={2} />
										</div>
									)}
								</button>
								<button onClick={toggleAudio}>
									{isSharingAudio ? (
										<div className='p-2 rounded-xl hover:bg-zinc-700 text-zinc-400'>
											<MicIcon stroke={2} />
										</div>
									) : (
										<div className='p-2 rounded-xl bg-rose-500 text-zinc-50'>
											<MicMuteIcon stroke={2} />
										</div>
									)}
								</button>
								<button
									onClick={handleLeaveRoom}
									className='py-2 px-4 rounded-xl bg-rose-500 text-zinc-50 text-sm font-medium'
								>
									<PhoneIcon stroke={2} />
								</button>
							</>
						)}
					</section>
					<section className='flex items-center gap-2'>
						<span className='text-sm font-bold'>{participants.length + 1}</span>
						<PeopleIcon size={22} />
					</section>
				</footer>
			</main>
			<Toaster position='top-right' />
		</>
	);
}
