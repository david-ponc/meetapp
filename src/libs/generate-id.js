import { customAlphabet } from 'nanoid';

export function generateId(length = 16) {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz-';
	const nanoid = customAlphabet(alphabet, length);
	return nanoid(length);
}
