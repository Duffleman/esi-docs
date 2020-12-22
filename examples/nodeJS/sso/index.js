import crypto from 'crypto';
import inquirer from 'inquirer';
import jsonClient from 'json-client';
import querystring from 'querystring';
import questions from './questions.js';

const eveClient = jsonClient('https://login.eveonline.com');

async function start() {
	const { verifier, challenge } = await generateChallenges();

	const { clientId } = await inquirer.prompt(questions[0]);
	const { clientSecret } = await inquirer.prompt(questions[1]);

	const params = querystring.stringify({
		client_id: clientId,
		code_challenge: challenge,
		code_challenge_method: 'S256',
		redirect_uri: 'http://localhost:8080/callback/',
		response_type: 'code',
		state: 'duffleman',
	});

	console.log(`https://login.eveonline.com/v2/oauth/authorize?${params}`);

	const { code } = await inquirer.prompt(questions[2]);

	const tokenRes = await eveClient('post', 'v2/oauth/token', null, {
		grant_type: 'authorization_code',
		code,
		client_id: clientId,
		code_verifier: verifier,
		redirect_uri: 'http://localhost:8080/callback/',
	}, {
		headers: {
			Authorization: `Basic ${makeAuthHeader(clientId, clientSecret)}`,
		},
	});

	const verifyRes = await eveClient('get', 'oauth/verify', null, null, {
		headers: {
			Authorization: `Bearer ${tokenRes.access_token}`,
		},
	});

	console.log(verifyRes);
}

function makeAuthHeader(clientId, clientSecret) {
	return Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
}

async function generateChallenges() {
	const verifier = base64URLEncode(crypto.randomBytes(32));
	const challenge = base64URLEncode(crypto.createHash('sha256').update(verifier).digest());

	return { verifier, challenge };
}

function base64URLEncode(str) {
	return str.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
}

await start();
