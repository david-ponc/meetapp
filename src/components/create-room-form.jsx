import { DeviceCameraVideoIcon } from '@primer/octicons-react';
import clsx from 'clsx';
import { useContext } from 'react';
import { MeetContext } from '~/contexts';
import Spinner from './spinner';

export default function CreateRoomForm(props) {
	const { isLoading } = useContext(MeetContext);

	return (
		<form className='flex flex-col' {...props}>
			<button
				disabled={isLoading}
				className={clsx(
					'bg-indigo-500 text-indigo-50 font-medium rounded-md px-6 py-3 shadow-lg shadow-indigo-500/50 hover:bg-indigo-600 transition-colors text-sm lg:text-base',
					isLoading && 'cursor-not-allowed hover:bg-indigo-400'
				)}
			>
				{isLoading ? (
					<span className='flex items-center justify-center'>
						<Spinner className='text-white' /> Creando...
					</span>
				) : (
					<span className='flex items-center justify-center gap-2'>
						<DeviceCameraVideoIcon size={16} /> Crea una reunión
					</span>
				)}
			</button>
		</form>
	);
}
