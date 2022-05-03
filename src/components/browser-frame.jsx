export function BrowserFrame({ children }) {
	return (
		<section className='w-full max-w-7xl h-full bg-zinc-200/60 rounded-tl-md rounded-tr-md lg:rounded-tr-lg lg:rounded-tl-lg border border-zinc-400/30 border-b-0 overflow-hidden'>
			<header className='border-b border-b-zinc-400/40 flex bg-zinc-50 px-1 py-1 gap-[2px] lg:px-2 lg:py-3 lg:gap-1'>
				<span className='w-1 h-1 lg:w-[7px] lg:h-[7px] rounded-full bg-zinc-300 inline-block shadow-inner shadow-zinc-400/60'></span>
				<span className='w-1 h-1 lg:w-[7px] lg:h-[7px] rounded-full bg-zinc-300 inline-block shadow-inner shadow-zinc-400/60'></span>
				<span className='w-1 h-1 lg:w-[7px] lg:h-[7px] rounded-full bg-zinc-300 inline-block shadow-inner shadow-zinc-400/60'></span>
			</header>
			{children}
		</section>
	);
}
