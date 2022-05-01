import twilio from 'twilio';
import { generateId } from '~/libs/generate-id';

const AccessToken = twilio.jwt.AccessToken;
const { VideoGrant } = AccessToken;

export default async function handler(req, res) {
	const { username, room } = req.body;
	const { ACCOUNT_SID, API_KEY_SID, API_KEY_SECRET } = process.env;

	const token = new AccessToken(ACCOUNT_SID, API_KEY_SID, API_KEY_SECRET);

	let videoGrant;
	let roomName;

	if (req.method === 'POST') {
		roomName = generateId();

		videoGrant = new VideoGrant({ room: roomName });
	} else if (req.method === 'PUT') {
		roomName = room;

		videoGrant = new VideoGrant({ room });
	}

	token.addGrant(videoGrant);
	token.identity = username;

	res.status(200).json([token?.toJwt(), roomName]);
}
