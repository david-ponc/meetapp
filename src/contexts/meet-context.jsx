import { createContext } from 'react';
import { useMeet } from '~/hooks/use-meet';

export const MeetContext = createContext(null);

export function MeetContextProvider({ children }) {
	const {
		room,
		participants,
		token,
		roomName,
		isLoading,
		joinRoom,
		createRoom,
		initializeMeet,
		leaveRoom,
		clearRoomName,
		changeRoomName,
	} = useMeet();

	return (
		<MeetContext.Provider
			value={{
				room,
				participants,
				token,
				roomName,
				isLoading,
				joinRoom,
				createRoom,
				initializeMeet,
				leaveRoom,
				clearRoomName,
				changeRoomName,
			}}
		>
			{children}
		</MeetContext.Provider>
	);
}
