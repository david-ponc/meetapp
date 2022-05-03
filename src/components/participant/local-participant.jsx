import clsx from 'clsx';
import { User as UserIcon } from 'iconoir-react';
import { useEffect, useRef } from 'react';

export function LocalParticipant({
	participant,
	isSharingVideo,
	isDomainSpeaker,
}) {
	const videoRef = useRef();
	const audioRef = useRef();

	useEffect(() => {
		participant.tracks.forEach(track => {
			if (track.kind === 'video') {
				track?.track.attach(videoRef.current);
			} else if (track.kind === 'audio') {
				track?.track.attach(audioRef.current);
			}
		});
	}, [participant]);

	return (
		<section
			className={clsx(
				'bg-zinc-800 rounded-lg aspect-video overflow-hidden relative group border border-zinc-800',
				isDomainSpeaker && 'shadow-lg shadow-emerald-600'
			)}
		>
			<span className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent group-hover:to-zinc-900 transition-all'></span>
			<p className='absolute bottom-2 left-2 text-transparent group-hover:text-white'>
				{participant.identity}
			</p>
			<video
				className={clsx('w-full', isSharingVideo ? null : 'hidden')}
				ref={videoRef}
				autoPlay={true}
			/>
			{!isSharingVideo && (
				<section className='h-full bg-zinc-800 rounded-lg flex flex-col items-center justify-center p-2 gap-4 '>
					<figure className='w-16 h-16 rounded-full overflow-hidden relative bg-zinc-700 flex justify-center items-center text-zinc-400 border border-zinc-600/50'>
						<UserIcon width={48} height={48} />
					</figure>
					<p className='text-lg font-medium text-zinc-100'>
						{participant.identity}
					</p>
				</section>
			)}

			<audio ref={audioRef} autoPlay={true} muted={false} />
		</section>
	);
}
