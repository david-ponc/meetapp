export function mapperUser(user) {
	return {
		id: user.uid,
		name: user.displayName,
		email: user.email,
		image: user.photoURL,
	};
}
