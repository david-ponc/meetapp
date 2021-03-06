import { CopyIcon, PeopleIcon } from '@primer/octicons-react';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
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
import { useTime } from '~/hooks/use-time';
import { useRoomName } from '~/hooks/use-room-name';
import clsx from 'clsx';

export default function Room() {
	const router = useRouter();
	const [time] = useTime();
	const { roomName, handleClickToCopyOnClipboard, updateRoomName } =
		useRoomName();
	const {
		initializeMeet,
		room,
		leaveRoom,
		participants,
		toggleVideo,
		toggleAudio,
		isSharingVideo,
		isSharingAudio,
		isDomainSpeaker,
	} = useContext(MeetContext);

	useEffect(() => {
		initializeMeet().then(updateRoomName);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleLeaveRoom = () => {
		leaveRoom();
		router.replace('/');
	};

	return (
		<>
			<Head>
				<title>Meetapp | {roomName || 'Contectado...'}</title>
				<link rel='icon' href='/favicon.ico' />
				<meta
					name='description'
					content='La plataforma de videoconferencias gratuita'
				/>
			</Head>

			<main className='w-full h-screen grid grid-rows-room-layout'>
				{room ? (
					<section
						className={clsx(
							'bg-zinc-900 p-6 gap-4 ',
							participants.length === 0 && 'flex items-center justify-center',
							participants.length > 0 &&
								'grid grid-cols-participants-layout grid-rows-participants-layout justify-center lg:justify-start'
						)}
					>
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
						<p className='font-medium text-xl'>Contectando...</p>
					</section>
				)}

				<footer className='px-6 py-3 grid grid-cols-3 bg-zinc-800 text-zinc-50'>
					<section className='justify-self-start flex items-center gap-4 text-sm font-semibold w-[56px] lg:w-auto'>
						<p className='hidden lg:block'>{time}</p>
						<div className='hidden lg:block h-4 w-[1px] bg-zinc-50'></div>
						<section className='flex items-center gap-4'>
							{roomName ? (
								<p className='hidden md:block truncate'>{roomName}</p>
							) : (
								<div className='w-32 h-2 animate-pulse bg-zinc-700 rounded-md' />
							)}
							<button
								disabled={!roomName}
								onClick={handleClickToCopyOnClipboard}
								className={clsx(
									'rounded-lg bg-zinc-700 px-3 py-2 transition-transform',
									!roomName
										? 'cursor-not-allowed text-zinc-500'
										: 'active:scale-90 text-zinc-50'
								)}
							>
								<CopyIcon size={16} />
							</button>
						</section>
					</section>
					<section className='justify-self-center flex items-center gap-2'>
						{room && (
							<>
								<button
									onClick={toggleVideo}
									className='transition-transform active:scale-90'
								>
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
								<button
									onClick={toggleAudio}
									className='transition-transform active:scale-90'
								>
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
									className='py-2 px-4 rounded-xl bg-rose-500 text-zinc-50 text-sm font-medium transition-transform active:scale-90'
								>
									<PhoneIcon stroke={2} />
								</button>
							</>
						)}
					</section>
					<section className='justify-self-end flex items-center gap-2'>
						<span className='text-sm font-bold'>{participants.length + 1}</span>
						<PeopleIcon size={22} />
					</section>
				</footer>
			</main>
			<Toaster position='top-right' />
		</>
	);
}
