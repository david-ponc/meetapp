import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { debounce } from '~/libs/debounce';
import { DEBOUNCE_TIMEOUT } from '~/utils/constans';

export function useRoomName() {
	const [roomName, setRoomName] = useState('');
	const inputRoomNameRef = useRef();
	const hasValueRoomName = useRef(roomName.length > 0 && roomName !== '');

	const changeByTyping = event => {
		setRoomName(event.target.value);
	};

	const changeByClipboard = () => {
		if ('clipboard' in navigator) {
			navigator.clipboard.readText().then(setRoomName);
		} else {
			toast.error(
				'Su navegador no soporta la funcionalidad de copiar y pegar texto 😥'
			);
		}
		inputRoomNameRef.current.focus();
	};

	const handleClickToCopyOnClipboard = debounce(event => {
		event.preventDefault();
		navigator.clipboard
			.writeText(roomName)
			.then(() => toast.success('Se copió el nombre de la sala'));
	}, DEBOUNCE_TIMEOUT);

	const updateRoomName = value => setRoomName(value);

	const resetRoomName = () => {
		setRoomName('');
	};

	return {
		roomName,
		changeByTyping,
		changeByClipboard,
		handleClickToCopyOnClipboard,
		updateRoomName,
		resetRoomName,
		inputRoomNameRef,
		hasValueRoomName,
	};
}
