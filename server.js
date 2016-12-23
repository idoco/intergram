const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const request = require('request');
const useEnvFile = require("node-env-file");

if (process.env.USE_ENV_FILE) {
    useEnvFile(".env");
}

const topicOwner = {};
const ownerTopic = {};

app.use(bodyParser.json()); // for parsing application/json

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

function sendMessage(chatId, text) {
    console.log(chatId + " : " + text);
    request
        .post('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage')
        .form({
            "chat_id": chatId,
            "text": text
        });
}

app.post('/hook', function(req, res){
    let chatId = req.body.message.chat.id;
    let text = req.body.message.text;

    if (text && text.startsWith("/register")) {
        let topic = text.split(' ')[1];

        if (!topic) {
            sendMessage(chatId, "Could not register");
        } else if (!topicOwner[topic]) {
            topicOwner[topic] = chatId;
            ownerTopic[chatId] = topic;
            sendMessage(chatId, "You have registered " + topic);
        } else {
            sendMessage(chatId, "The topic " + topic + " is already taken");
        }
    } else {
        io.emit(ownerTopic[chatId], text);
    }

    res.statusCode = 200;
    res.end();
});

io.on('connection', function(client){

    client.on('register', function(topic){
        console.log("web client " + client.id + " registered to " + topic);
        if (topicOwner[topic]) {
            sendMessage(topicOwner[topic], "new visitor " + client.id);
        }

        client.on(topic, function(msg) {
            if (topicOwner[topic]) {
                sendMessage(topicOwner[topic], "message from " + client.id + " : " + msg);
            }

            io.emit(topic, msg);
        });
    });

    client.on('disconnect', function(){
        console.log("client " + client.id + " left");
    });
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:' + process.env.PORT || 3000);
});
