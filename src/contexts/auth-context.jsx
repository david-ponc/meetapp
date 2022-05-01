import { createContext, useEffect, useState } from 'react';
import { firebaseService } from '~/services/firebase';

export const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		firebaseService
			.onAuthStateChanged()
			.then(setUser)
			.then(() => setIsLoading(false))
			.catch(() => setIsLoading(false));
	}, []);

	const login = () => {
		firebaseService.loginWithGithub();
	};

	const logout = () => {
		firebaseService.logout().then(() => setUser(null));
	};

	return (
		<AuthContext.Provider value={{ login, logout, user, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}
