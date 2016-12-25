const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const request = require('request');

app.use(bodyParser.json());

app.get('/', function(req, res){
    res.sendFile(__dirname + '/chat.html');
});

function sendMessage(chatId, text) {
    console.log(chatId + " : " + text);
    request
        .post('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage')
        .form({
            "chat_id": chatId,
            "text": text,
            "parse_mode": "Markdown"
        });
}

app.post('/hook', function(req, res){
    const chatId = req.body.message.chat.id;
    const name = req.body.message.chat.first_name || "admin";
    const text = req.body.message.text || "";

    if (text.startsWith("/start")) {
        sendMessage(chatId, "*Welcome to intergram* \n" +
            "Your unique chat id is `"+chatId+"`\n" +
            "Use it to link between the embedded chat and this telegram chat");
    } else {
        io.emit(chatId, name + ": " + text);
    }

    res.statusCode = 200;
    res.end();
});

io.on('connection', function(client){

    client.on('register', function(registerMsg){
        let name = registerMsg.name;
        let topic = registerMsg.topic;
        console.log("web client " + name + " registered to " + topic);
        sendMessage(topic, "New visitor " + name);

        client.on(topic, function(msg) {
            let text = name + ": " + msg;
            sendMessage(topic, text);
            io.emit(topic, text);
        });

        client.on('disconnect', function(){
            sendMessage(topic, name + " has left");
        });
    });

    client.on('disconnect', function(){
        console.log("unregistered client " + client.id + " left");
    });
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:' + process.env.PORT || 3000);
});
