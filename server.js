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

let users = [];
let usersOnline = [];
let offlineMessages = [];

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
            if (usersOnline.length) {
                sendTelegramMessage(chatId,
                    "*Online users* \n" +
                    usersOnline.map(user => "- `" + user + "`").join("\n"),
                    "Markdown");
            } else {
                sendTelegramMessage(chatId, "No users online");
            }
        }

        if (text.startsWith("/all ") && text){
            const message = text.replace("/all ", "");
            io.emit(chatId, {
                name: name,
                text: message,
                from: 'admin',
            });
        }

        if (reply) {
            let replyText = reply.text || "";
            let userId = replyText.split(':')[0];
            if (users.includes(userId)) {
                if (usersOnline.includes(userId)) {
                    io.emit(chatId + "-" + userId, {name, text, from: 'admin'});
                } else {
                    offlineMessages.push({
                        userId: userId,
                        name: name,
                        text: text,
                        time: new Date,
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

    client.on('register', function(registerMsg){
        let userId = registerMsg.userId;
        let chatId = registerMsg.chatId;
        console.log("useId " + userId + " connected to chatId " + chatId);

        if (users.includes(userId)) {
            usersOnline.push(userId);
            sendTelegramMessage(chatId, "`" + userId + "` has come back", "Markdown");
            offlineMessages = offlineMessages
                .filter(message => {
                    if (message.userId === userId) {
                        io.emit(chatId + "-" + userId, {
                            name: message.name,
                            text: message.text,
                            time: message.time,
                            from: 'admin'
                        });
                        return false;
                    }
                    return true;
                });
        }

        client.on('message', function(msg) {
            io.emit(chatId + "-" + userId, msg);
            let visitorName = msg.visitorName ? "[" + msg.visitorName + "]: " : "";
            sendTelegramMessage(chatId, userId + ":" + visitorName + " " + msg.text);

            if (!users.includes(userId)) {
                users.push(userId);
                usersOnline.push(userId);
            }
        });

        client.on('disconnect', function(){
            if (users.includes(userId)) {
                sendTelegramMessage(chatId, "`" + userId + "` has left", "Markdown");
                usersOnline.splice(usersOnline.indexOf(userId), 1);
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

app.post('/usage-start', cors(), function(req, res) {
    console.log('usage from', req.query.host);
    res.statusCode = 200;
    res.end();
});

// left here until the cache expires
app.post('/usage-end', cors(), function(req, res) {
    res.statusCode = 200;
    res.end();
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on port:' + (process.env.PORT || 3000));
});

app.get("/.well-known/acme-challenge/:content", (req, res) => {
    res.send(process.env.CERTBOT_RESPONSE);
});
