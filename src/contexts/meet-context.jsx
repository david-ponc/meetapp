import { createContext } from 'react';
import { useMeet } from '~/hooks/use-meet';

export const MeetContext = createContext(null);

export function MeetContextProvider({ children }) {
	const data = useMeet();

	return (
		<MeetContext.Provider value={{ ...data }}>{children}</MeetContext.Provider>
	);
}
