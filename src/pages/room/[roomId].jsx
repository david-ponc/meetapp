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
	} = useContext(MeetContext);

	useEffect(() => {
		initializeMeet();
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
		<main className='w-full h-screen grid grid-rows-room-layout'>
			<section className='bg-slate-900 p-6 gap-4 grid grid-cols-participants-layout auto-rows-participants justify-center lg:justify-start'>
				{room && (
					<LocalParticipant
						participant={room.localParticipant}
						isSharingVideo={isSharingVideo}
						isSharingAudio={isSharingAudio}
					/>
				)}
				{participants.map(participant => (
					<RemoteParticipant key={participant.sid} participant={participant} />
				))}
			</section>
			<footer className='flex px-6 py-3 items-center justify-between bg-slate-800 text-slate-50'>
				<p className='flex items-center gap-4 font-semibold'>
					<span className='hidden md:inline-block'>{time}</span>
					<span className='hidden md:inline-block h-4 w-[1px] bg-slate-50'></span>
					<span className='whitespace-nowrap overflow-hidden text-ellipsis max-w-[56px] md:max-w-[auto]'>
						{roomName}
					</span>
				</p>
				<section className='flex items-center gap-2'>
					<button onClick={toggleVideo}>
						{isSharingVideo ? (
							<div className='p-2 rounded-xl hover:bg-slate-700 text-slate-400'>
								<VideoCameraIcon stroke={2} />
							</div>
						) : (
							<div className='p-2 rounded-xl bg-rose-500 text-slate-50'>
								<VideoCameraOffIcon stroke={2} />
							</div>
						)}
					</button>
					<button onClick={toggleAudio}>
						{isSharingAudio ? (
							<div className='p-2 rounded-xl hover:bg-slate-700 text-slate-400'>
								<MicIcon stroke={2} />
							</div>
						) : (
							<div className='p-2 rounded-xl bg-rose-500 text-slate-50'>
								<MicMuteIcon stroke={2} />
							</div>
						)}
					</button>
					<button
						onClick={handleLeaveRoom}
						className='py-2 px-4 rounded-xl bg-rose-500 text-slate-50 text-sm font-medium'
					>
						<PhoneIcon stroke={2} />
					</button>
				</section>
				<section className='flex items-center gap-2'>
					<span className='text-sm font-bold'>{participants.length + 1}</span>
					<PeopleIcon size={22} />
				</section>
			</footer>
		</main>
	);
}
