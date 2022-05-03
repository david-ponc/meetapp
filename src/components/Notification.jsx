import toast from 'react-hot-toast';
import { Bell as BellIcon } from 'iconoir-react';

const Notification = (message, options) =>
	toast.custom(
		() => (
			<section className='flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-md bg-zinc-800 border border-zinc-700 shadow-sm shadow-zinc-900/60'>
				<BellIcon size={24} className='self-start text-indigo-300' />
				<section>
					<p className='text-sm text-zinc-300'>{message}</p>
				</section>
			</section>
		),
		options
	);

export default Notification;
