import { ArrowRightIcon, PasteIcon, XIcon } from '@primer/octicons-react';
import clsx from 'clsx';
import { useContext, useRef } from 'react';
import { MeetContext } from '~/contexts';
import ButtonToggle from './button-toggle';
import Spinner from './spinner';

export default function JoinRoomForm(props) {
	const { isLoading, roomName, clearRoomName, changeRoomName } =
		useContext(MeetContext);
	const inputRef = useRef();

	const hasValueRoomName = roomName !== '';

	const handleChangeRoomName = event => {
		const { value } = event.target;
		changeRoomName(value);
	};

	const pasteTextOfClipboard = async () => {
		if ('clipboard' in navigator) {
			const text = await navigator.clipboard.readText();
			changeRoomName(text);
		} else {
			alert('Your browser does not support clipboard API');
		}
		inputRef.current.focus();
	};

	return (
		<form className='flex flex-col gap-4' {...props}>
			<fieldset className='relative'>
				<input
					ref={inputRef}
					onChange={handleChangeRoomName}
					value={roomName}
					type='text'
					name='room'
					placeholder='Ingresa el identificador de la reunión'
					className='w-full px-6 py-3 text-sm lg:text-base border border-zinc-300 rounded-md placeholder:text-zinc-400 bg-zinc-50 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none'
				/>
				<ButtonToggle
					type='button'
					onClick={pasteTextOfClipboard}
					fallbackContent={<XIcon size={16} />}
					fallbackAction={clearRoomName}
					isInitialState={roomName === ''}
				>
					<PasteIcon size={16} />
				</ButtonToggle>
			</fieldset>
			<button
				type='submit'
				disabled={isLoading}
				className={clsx(
					'bg-indig-50 text-zinc-900 border border-zinc-200 bg-white/50 font-medium rounded-md px-6 py-3 transition-shadow hover:shadow-xl hover:shadow-zinc-500/10 text-sm lg:text-base',
					hasValueRoomName ? 'block' : 'hidden',
					isLoading && 'cursor-not-allowed hover:shadow-none'
				)}
			>
				{isLoading ? (
					<span className='flex items-center justify-center'>
						<Spinner className='text-indigo-500' /> Entrando...
					</span>
				) : (
					<span className='flex items-center justify-center gap-2'>
						<ArrowRightIcon size={16} /> Entrar a la reunión
					</span>
				)}
			</button>
		</form>
	);
}
