const request = require('request');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(cors());

const users = [];
const chats = [];

const defaultOnlineState = true;

// handle admin Telegram messages
app.post('/hook', function(req, res){
    try {
        const message = req.body.message || req.body.channel_post;
        const chatId = message.chat.id;
        const name = message.from.first_name || message.chat.title || "admin";
        const text = message.text || "";
        const reply = message.reply_to_message;

        if (text.startsWith("/start")) {
            console.log("/start chatId " + chatId);
            sendTelegramMessage(chatId,
                "*Welcome to Intergram* \n" +
                "Your unique chat id is `" + chatId + "`\n" +
                "Use it to link between the embedded chat and this telegram chat",
                "Markdown");
        }

        if (text.startsWith("/who")) {
            const usersOnline = users.filter(user => user.chatId === chatId && user.online);
            if (usersOnline.length) {
                sendTelegramMessage(chatId,
                    "*Online users* \n" +
                    usersOnline.map(user => "- `" + user.userId + "`").join("\n"),
                    "Markdown");
            } else {
                sendTelegramMessage(chatId, "No users online");
            }
        }

        if (text.startsWith("/online")) {
            console.log("/online chatId " + chatId);
            const chatIndex = chats.findIndex(chat => chat.chatId === chatId);
            if (chats[chatIndex]) {
                chats[chatIndex].online = true;
            } else {
                chats.push({
                    chatId: chatId,
                    online: true
                })
            }
            sendTelegramMessage(chatId, "Your chat is *online* now and it will be shown for new users", "Markdown");
        }

        if (text.startsWith("/offline")) {
            console.log("/offline chatId " + chatId);
            const chatIndex = chats.findIndex(chat => chat.chatId === chatId);
            if (chats[chatIndex]) {
                chats[chatIndex].online = false;
            } else {
                chats.push({
                    chatId: chatId,
                    online: false
                })
            }
            sendTelegramMessage(chatId, "Your chat is *offline* now and it won't be shown for new users", "Markdown");
        }

        if (text.startsWith("/all ") && text){
            const message = text.replace("/all ", "");
            io.emit(chatId, {
                name: name,
                text: message,
                from: 'admin',
            });
        }

        if (reply && text) {
            const replyText = reply.text || "";
            const userId = replyText.split(':')[0];
            const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);
            if (users[userIndex]) {
                if (users[userIndex].online) {
                    io.emit(chatId + "-" + userId, {name, text, from: 'admin'});
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

    } catch (e) {
        console.error("hook error", e, req.body);
    }
    res.statusCode = 200;
    res.end();
});

// handle chat visitors websocket messages
io.on('connection', function(client){

    client.on('register', function(registerMsg) {
        const userId = registerMsg.userId;
        const chatId = parseInt(registerMsg.chatId);
        console.log("useId " + userId + " connected to chatId " + chatId);

        const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);
        if (users[userIndex]) {
            users[userIndex].online = true;
            users[userIndex].messages.forEach(message => io.emit(chatId + "-" + userId, message));
            users[userIndex].messages = [];
            sendTelegramMessage(chatId, "`" + userId + "` has come back", "Markdown");
        }

        client.on('message', function(msg) {
            io.emit(chatId + "-" + userId, msg);
            let visitorName = msg.visitorName ? "[" + msg.visitorName + "]: " : "";
            sendTelegramMessage(chatId, "`" + userId + "`:" + visitorName + " " + msg.text, "Markdown");

            if (!users.find(user => user.userId === userId && user.chatId === chatId)) {
                users.push({
                    userId: userId,
                    chatId: chatId,
                    online: true,
                    messages: [],
                });
            }
        });

        client.on('disconnect', function() {
            const userIndex = users.findIndex(user => user.userId === userId && user.chatId === chatId);
            if (users[userIndex]) {
                users[userIndex].online = false;
                sendTelegramMessage(chatId, "`" + userId + "` has left", "Markdown");
            }
        });
    });

});

function sendTelegramMessage(chatId, text, parseMode) {
    request
        .post('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage')
        .form({
            "chat_id": chatId,
            "text": text,
            "parse_mode": parseMode
        });
}

app.post('/usage-start', function(req, res) {
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
app.post('/usage-end', function(req, res) {
    res.statusCode = 200;
    res.end();
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on port:' + (process.env.PORT || 3000));
});

app.get("/.well-known/acme-challenge/:content", (req, res) => {
    res.send(process.env.CERTBOT_RESPONSE);
});
