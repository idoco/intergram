const request = require('request');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const serverLink = process.env.SERVER_URL;

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());
app.use(cors());

const users = [];
const chats = [];

const defaultOnlineState = true;

// handle admin Telegram messages
app.post('/hook', function (req, res) {
	try {

		if (!req.body.callback_query) {
			const message = req.body.message || req.body.channel_post;
			const chatId = message.chat.id;
			const name = message.from.first_name || message.chat.title || 'admin';
			const text = message.text || '';
			const reply = message.reply_to_message;

			console.log('< ' + text)

			if (text.startsWith('/start')) {
				console.log('/start chatId ' + chatId);
				sendTelegramMessage(chatId,
					'*Welcome to Telegram Chat Widget Bot* 🔥\n\n' +
					'Your unique chat id is `' + chatId + '`\n' +
					'Use it to link between the embedded chat and this telegram chat\n\n' +

					'🔹 Works on any MikroTik Hotspot Portals\n' +
					'🔹 Easy access for customer support\n' +
					'🔹 Real-time chats\n' +
					'🔹 Instant support and troubleshooting\n' +
					'🔹 Personalized interaction with your chat ID\n\n' +

					'*Available Commands:*\n' +
					'`/start` - Info about @MikrotikHsSupportBot \n' +
					'`/all [any_text]` - Send message to all online users\n' +
					'`/who` -  Get online users list\n' +
					'`/online` - Set chat online (Show Chat Widget)\n' +
					'`/offline` - Set chat offline (Hide Chat Widget)\n' +
					'`/ban [name]` - Ban user\n' +
					'`/unban [name]` - Unban user\n' +
					'`/user [name]` - See the user\'s information\n' +
					'`/info` - more information about @MikrotikHsSupportBot\n' +
					'`/help` - For detailed instructions\n\n' +

					'[Kintoyyy/Telegram-Chat-Widget](https://github.com/Kintoyyy/Telegram-Chat-Widget)Consider giving it a ⭐',
					'Markdown');
			}

			if (text.startsWith('/help')) {
				console.log('/help chatId ' + chatId);
				sendTelegramMessage(chatId,
					'*Telegram Chat Widget Bot instructions* 🔥🤖\n\n' +
					'Your unique chat id is `' + chatId + '`\n\n' +

					'*How to Setup on mikrotik:*\n\n' +
					'*1.)* We need to add @MikrotikHsSupportBot to hotspot walled-garden by pasting this following command in the *terminal*\n\n' +
					'goto:  *ip* > *hotspot* > *Walled Garden Ip List*\n\n' +
					'then add a new entry\nset to *accept*\nDst. Host `' + serverLink + '`\n\n' +
					'2. Add this in your preferred *html file* ex: *login.html*\n\n' +
					'```\n<script>\n' +
					'window.intergramId = "' + chatId + '";\n' +
					'window.CustomData = {\n' +
					'	"username": "$(username)",\n' +
					'	"ip address": "$(ip)",\n' +
					'	"Mac address": "$(mac)",\n' +
					'	"trial": "$(trial)",\n' +
					'	"interface" : "$(interface-name)",\n' +
					'	"vlan" : "$(vlan-id)"\n' +
					'};\n' +
					'</script>\n' +
					'<script id="intergram" type="text/javascript" src="' + serverLink + '/js/widget.js"></script>\n' +
					'```\n' +
					'3. *Done*\n\n' +
					'for more details: [Kintoyyy/Telegram-Chat-Widget](https://github.com/Kintoyyy/Telegram-Chat-Widget)\n\n' +
					'*Feel free to support this project*\n' +
					'*Paypal* - paypal.me/Kintoyyyy\n' +
					'*Gcash / Maya - * `09760009422`\n',
					'Markdown');
			}

			if (text.startsWith('/info')) {
				console.log('/info chatId ' + chatId);
				sendTelegramMessage(chatId,
					'*Telegram Chat Widget Bot information* 🔥[🐈](https://media.tenor.com/gTrQ1V5mSxQAAAAC/cat-call-center.gif)\n\n' +
					'@MikrotikHsSupportBot / [Kintoyyy/Telegram-Chat-Widget](https://github.com/Kintoyyy/Telegram-Chat-Widget) is a fork of [idoco/intergram](https://github.com/idoco/intergram) and [yamaha252/intergram](https://github.com/yamaha252/intergram) Consider giving the repositories a ⭐ to show some support\n\n' +
					'If you encounter some errors or you want new features\n' +
					'open a pull request in [Kintoyyy/Telegram-Chat-Widget](https://github.com/Kintoyyy/Telegram-Chat-Widget/pulls) 🙂\n\n' +
					'*Feel free to support this project*\n' +
					'*Paypal* - paypal.me/Kintoyyyy\n' +
					'*Gcash / Maya - * `09760009422`\n',
					'Markdown');
			}


			if (text.startsWith('/who')) {

				console.log('/who');
				const usersOnline = users.filter(user => user.chatId === chatId && user.online);
				if (usersOnline.length) {
					sendTelegramMessage(chatId,
						'*Online users* 🧑‍🦯\n' +
						usersOnline.map(user => '- `' + user.userId + '`').join('\n'),
						'Markdown');
				} else {
					sendTelegramMessage(chatId, 'No users online 🌵');
				}

			}

			if (text.startsWith('/online')) {
				console.log('/online chatId ' + chatId);
				const chatIndex = chats.findIndex(chat => chat.chatId === chatId);
				if (chats[chatIndex]) {
					chats[chatIndex].online = true;
				} else {
					chats.push({
						chatId: chatId,
						online: true
					})
				}
				sendTelegramMessage(chatId, 'Your chat is *online* 🟢 now and it will be shown for new users', 'Markdown');
			}

			if (text.startsWith('/offline')) {
				console.log('/offline chatId ' + chatId);
				const chatIndex = chats.findIndex(chat => chat.chatId === chatId);
				if (chats[chatIndex]) {
					chats[chatIndex].online = false;
				} else {
					chats.push({
						chatId: chatId,
						online: false
					})
				}
				sendTelegramMessage(chatId, 'Your chat is *offline* 🔴 now and it won\'t be shown for new users', 'Markdown');
			}

			if (text.startsWith('/all')) {
				const message = text.replace(/^\/all(@?\w+)? /, '');
				console.log('/all ' + message);
				io.emit(chatId, {
					name: name,
					text: message,
					from: 'admin',
				});
			}

			if (text.startsWith('/ban')) {
				const userId = text.replace(/^\/ban(@?\w+)? /, '');

				if (userId === '') {
					sendTelegramMessage(chatId, 'Please enter a username ex.`/ban cat`', 'Markdown');
				}

				const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);
				if (users[userIndex]) {
					users[userIndex].banned = true;
					sendTelegramMessage(chatId, 'Ok, *' + userId + '* was banned ⛔', 'Markdown');
				} else {
					sendTelegramMessage(chatId, 'User not found or banned.', 'Markdown');
				}
			}

			if (text.startsWith('/unban')) {
				const userId = text.replace(/^\/unban(@?\w+)? /, '').trim();
				const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);
				if (userIndex !== -1) {
					users[userIndex].banned = false;
					sendTelegramMessage(chatId, 'Ok, *' + userId + '* was unbanned 🥳', 'Markdown');
				} else {
					sendTelegramMessage(chatId, 'User not found or not banned.', 'Markdown');
				}
			}


			if (text.startsWith('/user')) {
				const userId = text.replace(/^\/user(@?\w+)? /, '');
				const user = users.find(user => user.userId === userId && user.chatId === chatId);
				if (user) {
					const CustomData = user.CustomData || {};
					const username = user.CustomData.username || userId;
					const CustomMsg = `\`${username}\`\n\n${Object.entries(CustomData).map(([label, value]) => `${label.trim()} : \`${value.trim()}\``).join('\n')}`;
					sendTelegramMessage(chatId, CustomMsg, 'Markdown');
				} else {
					sendTelegramMessage(chatId, 'User not found', 'Markdown');
				}
			}

			if (text.startsWith('/test')) {
				const inlineKeyboard = [
					[
						{ text: 'Button 1', callback_data: 'button_1' },
						{ text: 'Button 2', callback_data: 'button_2' },
					],
					[
						{ text: 'Button 3', callback_data: 'button_3' },
						{ text: 'Button 4', callback_data: 'button_4' },
					],
					[
						{ text: 'Button 5', callback_data: 'button_5' },
					],
				];
				sendTelegramMessage(
					chatId,
					'What todo with the user?🔥\n\n',
					'Markdown',
					false,
					inlineKeyboard
				);
			}

			if (reply && text) {
				const replyText = reply.text || '';
				const userId = replyText.split(':')[0];
				const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);

				console.log(userId)

				if (users[userIndex]) {
					if (users[userIndex].online) {
						io.emit(chatId + '-' + userId, { name, text, from: 'admin' });
					} else {
						users[userIndex].messages.push({
							name: name,
							text: text,
							time: new Date,
							from: 'admin',
						});
					}
				}
			}

		} else {
			const callbackQuery = req.body.callback_query;
			console.log(callbackQuery)
			const chatId = callbackQuery.message.chat.id;
			const data = callbackQuery.data;

			switch (data) {
				case 'button_1':
					sendTelegramMessage(chatId, 'You clicked Button 1!');
					break;
				case 'button_2':
					sendTelegramMessage(chatId, 'You clicked Button 2!');
					break;
				default:
					break;
			}

			// Respond to the callback query to acknowledge receipt
			request.post('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/answerCallbackQuery')
				.form({
					callback_query_id: callbackQuery.id,
				})
				.on('response', function (response) {
					console.log('telegram callback response:', response.statusCode);
				});
		}

	} catch (e) {
		console.error('hook error', e, req.body);
	}
	res.statusCode = 200;
	res.end();
});

// handle chat visitors websocket messages
io.on('connection', function (client) {

	client.on('register', function (registerMsg) {

		const userId = registerMsg.userId;
		const chatId = parseInt(registerMsg.chatId);
		const CustomData = registerMsg.CustomData;

		console.log('useId ' + userId + ' connected to chatId ' + chatId);

		const CustomMsg = `\`${userId}\`: *connected to chat* 😶‍🌫️\n\n`;
		let CustomMsgData = '';

		if (CustomData) {
			CustomMsgData = `${Object.entries(CustomData).map(([label, value]) => `${label}: ${value}`).join('\n')}`;
		}

		sendTelegramMessage(chatId, `${CustomMsg}${CustomMsgData}`, 'Markdown', true);


		const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);
		if (users[userIndex]) {
			if (users[userIndex].banned) {
				client.disconnect();
				return;
			}

			users[userIndex].online = true;
			users[userIndex].messages.forEach(message => io.emit(chatId + '-' + userId, message));
			users[userIndex].messages = [];
			if (users[userIndex].active) {
				sendTelegramMessage(chatId, '`' + userId + '` has come back 👋', 'Markdown', true);
			}
		}

		client.on('message', function (msg) {

			const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);
			if (users[userIndex] && users[userIndex].banned) {
				client.disconnect();
				return;
			}
			io.emit(chatId + '-' + userId, msg);

			console.log('> ' + msg.text)

			if (msg.text === '/help') {
				io.emit(chatId + '-' + userId, {
					text: registerMsg.helpMsg || 'help is coming😭',
					from: 'admin',
				});
				return;
			}


			let visitorName = msg.visitorName ? '[' + msg.visitorName + ']: ' : '';

			sendTelegramMessage(chatId, '`' + userId + '`:' + visitorName + ' ' + msg.text, 'Markdown');



			if (users[userIndex]) {
				users[userIndex].active = true;
				if (users[userIndex].unactiveTimeout) {
					clearTimeout(users[userIndex].unactiveTimeout);
				}
			} else {
				users.push({
					userId: userId,
					chatId: chatId,
					online: true,
					active: true,
					banned: false,
					messages: [],
					CustomData: CustomData || {}
				});
			}
		});

		client.on('disconnect', function () {
			const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);
			if (users[userIndex]) {
				users[userIndex].online = false;
				if (users[userIndex].active) {
					users[userIndex].unactiveTimeout = setTimeout(() => {
						users[userIndex].active = false;
					}, 60000);
					if (!users[userIndex].banned) {
						sendTelegramMessage(chatId, '`' + userId + '` has left 🏃💨', 'Markdown', true);
					}
				}
			}
		});
	});

});

function sendTelegramMessage(chatId, text, parseMode, disableNotification, inlineKeyboard) {
	const options = {
		'chat_id': chatId,
		'text': text,
		'parse_mode': parseMode,
		'disable_notification': !!disableNotification,
	};

	if (inlineKeyboard) {
		options.reply_markup = JSON.stringify({
			inline_keyboard: inlineKeyboard,
		});
	}

	request
		.post('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage')
		.form(options)
		.on('response', function (response) {
			console.log('telegram status code:', response.statusCode);
		});
}

app.post('/usage-start', function (req, res) {
	const chatId = parseInt(req.body.chatId);
	const host = req.body.host;

	let chat = chats.find(chat => chat.chatId === chatId);
	if (!chat) {
		chat = {
			chatId: chatId,
			online: defaultOnlineState
		};
		chats.push(chat)
	}

	console.log('usage chat ' + chatId + ' (' + (chat.online ? 'online' : 'offline') + ') from ' + host);
	res.statusCode = 200;
	res.json({
		online: chat.online
	});
});

// left here until the cache expires
app.post('/usage-end', function (req, res) {
	res.statusCode = 200;
	res.end();
});

app.get('/status', function (req, res) {
	const currentTime = new Date().toISOString();
	res.statusCode = 200;
	res.send({
		status: 'ok',
		pingTime: currentTime
	});
	console.log({
		status: 'ok',
		pingTime: currentTime
	})
});

app.get('/', function (req, res) {
	res.redirect((process.env.REDIRECT_URL || 'https://kintoyyy.github.io/Telegram-Chat-Widget'))
});

http.listen(process.env.PORT || 3000, function () {
	console.log('listening on port:' + (process.env.PORT || 3000));
});

app.get('/.well-known/acme-challenge/:content', (req, res) => {
	res.send(process.env.CERTBOT_RESPONSE);
});
