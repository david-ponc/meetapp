import { AuthContextProvider, MeetContextProvider } from '~/contexts';
import '~/styles/globals.css';

function MyApp({ Component, pageProps }) {
	return (
		<AuthContextProvider>
			<MeetContextProvider>
				<Component {...pageProps} />
			</MeetContextProvider>
		</AuthContextProvider>
	);
}

export default MyApp;
