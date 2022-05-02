import { initializeApp, getApps } from 'firebase/app';
import {
	getAuth,
	GithubAuthProvider,
	signInWithRedirect,
	getRedirectResult,
} from 'firebase/auth';
import { mapperUser } from '~/libs/mapper-user';

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
};

if (!getApps().length) {
	initializeApp(firebaseConfig);
}

export { getRedirectResult };

export const firebaseService = {
	auth: getAuth(),
	loginWithGithub: async function () {
		const provider = new GithubAuthProvider();
		signInWithRedirect(this.auth, provider);
	},
	getOnRedirectDataUser: function () {
		return getRedirectResult(this.auth)
			.then(result => {
				const user = result.user;
				return user;
			})
			.then(mapperUser)
			.catch(error => {
				console.error('Login unsuccessful', error);
			});
	},
	onAuthStateChanged: function () {
		return new Promise((resolve, reject) => {
			this.auth.onAuthStateChanged(user => {
				if (user) {
					const mappedUser = mapperUser(user);
					resolve(mappedUser);
				} else {
					reject(user);
				}
			});
		});
	},
	logout: function () {
		return this.auth.signOut();
	},
};
