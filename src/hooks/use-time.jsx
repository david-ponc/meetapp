import { useState, useEffect } from 'react';

function getTimeNow() {
	const date = new Date();
	const time = date.toLocaleTimeString('es-MX', {
		hour: '2-digit',
		minute: '2-digit',
	});
	return time;
}

export function useTime() {
	const [time, setTime] = useState(getTimeNow);

	useEffect(() => {
		const updateTime = () => {
			const now = getTimeNow();
			setTime(now);
		};

		setInterval(updateTime, 1000);

		return () => {
			clearInterval(updateTime);
		};
	}, []);

	return [time];
}
