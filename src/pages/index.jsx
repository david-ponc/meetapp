import { MarkGithubIcon, StopIcon, XIcon } from '@primer/octicons-react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BrowserFrame } from '~/components/browser-frame';
import CreateRoomForm from '~/components/create-room-form';
import JoinRoomForm from '~/components/join-room-form';
import Spinner from '~/components/spinner';
import { AuthContext, MeetContext } from '~/contexts';

export default function Home() {
	const router = useRouter();
	const {
		login,
		logout,
		user,
		isLoading: isAuthLoading,
	} = useContext(AuthContext);
	const { joinRoom, createRoom, roomName } = useContext(MeetContext);

	const handleCreateRoom = async event => {
		event.preventDefault();

		if (!user.name) {
			console.error('No user name');
			return;
		}

		await createRoom({ username: user.name })
			.then(roomNameServer =>
				router.push('/room/[roomId]', `/room/${roomNameServer}`)
			)
			.catch(error =>
				toast.custom(
					t => (
						<ErrorNotification
							content={error.message}
							onClose={() => toast.dismiss(t.id)}
						/>
					),
					{ id: 'error-name-room-meet' }
				)
			);
	};

	const handleJoinRoom = event => {
		event.preventDefault();

		if (!user.name) {
			console.error('No user name');
			return;
		}

		joinRoom({ username: user.name })
			.then(() => router.push('/room/[roomId]', `/room/${roomName}`))
			.catch(error =>
				toast.custom(
					t => (
						<ErrorNotification
							content={error.message}
							onClose={() => toast.dismiss(t.id)}
						/>
					),
					{ id: 'error-name-room-meet' }
				)
			);
	};

	return (
		<>
			<Head>
				<title>Meetapp</title>
				<link rel='icon' href='/favicon.ico' />
				<meta
					name='description'
					content='La plataforma de videoconferencias gratuita'
				/>
			</Head>
			<main className='w-full h-screen grid grid-rows-web-layout'>
				<header className='w-full flex justify-between items-center px-6 py-4'>
					<p className='text-indigo-500 font-semibold'>Meetapp</p>
					<a
						href='https://github.com/david-ponc/meetapp'
						target='_blank'
						rel='noopener noreferrer'
						className='px-4 py-2 flex items-center gap-2 rounded-md bg-white border border-zinc-200 font-medium text-sm'
					>
						<MarkGithubIcon size={16} /> Repositorio
					</a>
				</header>
				<section className='w-full h-full grid grid-rows-landing-layout'>
					<header className='flex flex-col items-center justify-center p-6 text-center lg:py-24'>
						<h1 className='font-bold text-3xl lg:text-6xl text-center text-zinc-900 lg:max-w-[20ch]'>
							La plataforma de videoconferencias gratuita
						</h1>
						<p className='text-lg lg:text-xl mt-4 text-zinc-500'>
							Con MeetApp podrás crear y unirte a reuniones
						</p>
					</header>
					<main className='flex items-center justify-center px-4'>
						<BrowserFrame>
							{isAuthLoading ? (
								<section className='h-full p-6 lg:p-0 flex items-center justify-center'>
									<Spinner className='text-zinc-500' />
								</section>
							) : user ? (
								<>
									<section className='h-full px-3 py-4 flex flex-col gap-4 md:justify-center md:items-center base'>
										<UserCard user={user} onLogout={logout} />
										<section className='flex flex-col gap-6 bg-white border border-zinc-200 rounded-md shadow-2xl shadow-zinc-200 p-6 md:w-[384px] md:mx-auto'>
											{roomName === '' && (
												<CreateRoomForm onSubmit={handleCreateRoom} />
											)}
											<JoinRoomForm onSubmit={handleJoinRoom} />
										</section>
									</section>
								</>
							) : (
								<section className='h-full p-6 lg:p-0 flex items-center justify-center'>
									<section className='flex flex-col gap-6 bg-white border border-zinc-200 rounded-md shadow-2xl shadow-zinc-200 p-6 max-w-xs lg:max-w-sm'>
										<p className='font-semibold text-center'>Unete a Meetapp</p>
										<button
											onClick={login}
											className='px-6 py-3 rounded-md text-sm font-medium bg-zinc-800 text-zinc-100 flex items-center justify-center gap-2 shadow-xl shadow-zinc-400/30 hover:bg-zinc-700 transition-colors'
										>
											<MarkGithubIcon size={16} /> Iniciar con Github
										</button>
									</section>
								</section>
							)}
						</BrowserFrame>
					</main>
				</section>
				<footer className='w-full flex justify-center items-center px-6 py-3 border-t border-t-zinc-200'>
					<p className='text-center text-xs text-gray-500 font-semibold'>
						&copy; {new Date().getFullYear()} Meetapp
					</p>
				</footer>
			</main>

			<Toaster position='top-right' />
		</>
	);
}

function UserCard({ user, onLogout }) {
	return (
		<article className='p-4 rounded-md border border-zinc-200 grid grid-cols-card-user-layout gap-4 bg-white md:w-[384px] md:mx-auto'>
			<figure className='w-10 h-10 rounded-full overflow-hidden relative'>
				<Image src={user.image} alt={user.name} layout='fill' />
			</figure>
			<section className='whitespace-nowrap overflow-hidden text-ellipsis'>
				<p className='font-semibold lg:text-lg whitespace-nowrap overflow-hidden text-ellipsis'>
					{user.name}
				</p>
				<p className='font-medium text-xs lg:text-sm text-zinc-500 self-center whitespace-nowrap overflow-hidden text-ellipsis'>
					{user.email}
				</p>
			</section>
			<button
				className='self-center font-medium text-xs py-1 px-3 rounded-md bg-rose-100 text-rose-700'
				onClick={onLogout}
			>
				Salir
			</button>
		</article>
	);
}

function ErrorNotification({ content, onClose }) {
	return (
		<section className='flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-md bg-white border border-zinc-200 text-zinc-800 shadow-2xl shadow-zinc-200'>
			<StopIcon size={24} className='self-start fill-rose-600' />
			<section>
				<p className='text-base font-semibold'>Ocurrido un error 😥</p>
				<p className='text-sm text-zinc-500'>{content}</p>
			</section>
			<button
				onClick={onClose}
				className='self-start text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 px-1 py-[2px] rounded-md'
			>
				<XIcon size={16} />
			</button>
		</section>
	);
}
