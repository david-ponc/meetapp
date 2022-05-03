import clsx from 'clsx';

export default function ButtonToggle({
	children,
	className,
	fallbackContent,
	isInitialState,
	onClick,
	fallbackAction,
	...props
}) {
	return (
		<button
			className={clsx(
				'h-9 w-9 rounded-md bg-white absolute border border-zinc-200 top-1/2 -translate-y-1/2 right-[5px] z-10 flex items-center justify-center',
				className
			)}
			onClick={isInitialState ? onClick : fallbackAction}
			{...props}
		>
			{isInitialState ? children : fallbackContent}
		</button>
	);
}
