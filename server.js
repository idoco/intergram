const express = require('express');
const compression = require('compression');
const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const request = require('request');

app.use(express.static('dist', {index: 'demo.html', maxage: '4h'}));
app.use(compression());
app.use(bodyParser.json());

function sendTelegramMessage(chatId, text) {
    console.log("[chat-" + chatId + "] " + text);
    request
        .post('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage')
        .form({
            "chat_id": chatId,
            "text": text,
            "parse_mode": "Markdown"
        });
}
app.post('/hook', function(req, res){
    try {
        const message = req.body.message || req.body.channel_post;
        const chatId = message.chat.id;
        const name = message.chat.first_name || message.chat.title || "admin";
        const text = message.text || "";
        const reply = message.reply_to_message;

        if (text.startsWith("/start")) {
            sendTelegramMessage(chatId,
                "*Welcome to Intergram* \n" +
                "Your unique chat id is `" + chatId + "`\n" +
                "Use it to link between the embedded chat and this telegram chat");
        } else if (reply) {
            let replyText = reply.text || "";
            let userId = replyText.split(':')[0];
            io.emit(chatId + "-" + userId, {name, text, from: 'admin'});
        } else if (text){
            io.emit(chatId, {name, text, from: 'admin'});
        }

    } catch (e) {
        console.log("hook error", e, req.body);
    }
    res.statusCode = 200;
    res.end();
});

io.on('connection', function(client){

    client.on('register', function(registerMsg){
        let userId = registerMsg.userId;
        let chatId = registerMsg.chatId;
        let messageReceived = false;

        client.on('message', function(msg) {
            messageReceived = true;
            io.emit(chatId + "-" + userId, msg);
            sendTelegramMessage(chatId, userId + ": " + msg.text);
        });

        client.on('disconnect', function(){
            if (messageReceived) {
                sendTelegramMessage(chatId, userId + " has left");
            }
        });
    });

});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on port:' + (process.env.PORT || 3000));
});

app.get("/.well-known/acme-challenge/:content", (req, res) => {
    res.send(process.env.CERTBOT_RESPONSE);
});
