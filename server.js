const request = require('request')
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const connectedSockets = {}
const messageBuffer = {}

app.use(express.static('dist', { index: 'demo.html', maxage: '4h' }))
app.use(bodyParser.json())

console.log(process.env.TELEGRAM_TOKEN)
console.log(process.env.GEO_KEY)
// handle admin Telegram messages
app.post('/hook', function (req, res) {
  try {
    const message = req.body.message || req.body.channel_post
    const chatId = message.chat.id
    const name = message.chat.first_name || message.chat.title || 'admin'
    const text = message.text || ''
    const reply = message.reply_to_message
    const from = message.from.username
    res.statusCode = 200

    if (text.startsWith('/start')) {
      console.log('/start chatId ' + chatId)
      sendTelegramMessage(
        chatId,
        '*Welcome to Intergram* \n' +
          'Your unique chat id is `' +
          chatId +
          '`\n' +
          'Use it to link between the embedded chat and this telegram chat',
        'Markdown'
      )
    } else if (reply) {
      let replyText = reply.text || ''
      // check if a reply to someone known
      const userIdMatch = replyText.match(/^\[(.+)\]/)
      if (userIdMatch) {
        const userId = userIdMatch[1]
        // TODO check if connected, if not then buffer
        if (connectedSockets[userId]) {
          console.log(`client connected sending message`)
          io.emit(chatId + '-' + userId, {
            name,
            text,
            from: 'admin',
            adminName: from
          })
        }
        else {
          if (!messageBuffer[userId]) {
            messageBuffer[userId] = []
          }
          console.log(`client not connected buffering message`)
          messageBuffer[userId].unshift({
            chatId,
            name,
            text,
            from: 'admin',
            adminName: from
          })
        }
      }
    }
  } catch (e) {
    console.error('hook error', e, req.body)
  } finally {
    res.end()
  }
})

// handle chat visitors websocket messages
io.on('connection', function (client) {
  const address = client.handshake.address.replace('::ffff:', '')
  client.on('register', function (registerMsg) {
    const { isNewUser, chatId, userId, oldId, userData } = registerMsg
    connectedSockets[userId] = true
    let messageReceived = false
    // TODO check the buffer and send anything in there
    if (messageBuffer[userId]) {
      const buffered = messageBuffer[userId]
      let msg = buffered.pop()
      console.log(`sending ${buffered.length} buffered messages`)
      while (msg) {
        const { chatId, name, text, from, adminName } = msg
        io.emit(chatId + '-' + userId, {
          name,
          text,
          from,
          adminName
        })
        msg = buffered.pop()
      }
      delete messageBuffer[userId]
    }

    console.log('useId ' + userId + ' connected to chatId ' + chatId)

    if (oldId) {
      sendMessage(
        chatId,
        userId,
        `Lead ${oldId} has logged in as ${userData.email}`
      ).then(() => {
        return sendStartMessage(chatId, userData)
      })
    }
    client.on('message', function (data) {
      if (data.action === 'typing') {
        return setTyping(chatId)
      }
      const { msg } = data
      return Promise.resolve()
        .then(() => {
          if (isNewUser && !messageReceived) {
            return getIpAddressGeo(address).then(location => {
              console.log('sending start msg')
              return sendStartMessage(chatId, {
                ...userData,
                location
              })
            })
          }
        })
        .then(() => {
          messageReceived = true
          io.emit(chatId + '-' + userId, msg)
          return sendMessage(
            chatId,
            userId,
            msg.text,
            userData ? userData.email : ''
          )
        })
    })

    client.on('disconnect', function () {
      if (messageReceived) {
        sendTelegramMessage(chatId, userId + ' has left')
      }
      delete connectedSockets[userId]
    })
  })
})

function sendStartMessage (chatId, userData = {}) {
  const { id, name, email, provider, location } = userData
  console.log(userData)
  const isLead = !email
  let text = ''

  if (isLead) {
    text = `${text}
<b>New Lead</b>`
  } else {
    text = `A user has started a chat.
<b>ID:</b>\t ${id}
<b>Email:</b>\t ${email}
<b>Location:</b>\t ${location}
<b>Stripe:</b>\t https://dashboard.stripe.com/search?query=${email}
`
  }
  text = `${text}`
  return sendTelegramMessage(chatId, text, 'HTML')
}

function sendMessage (chatId, userId, text, email = '') {
  return sendTelegramMessage(
    chatId,
    `<b>[${userId}]</b> ${email}:\n${text}`,
    'HTML'
  )
}

app.post('/usage-start', cors(), function (req, res) {
  console.log('usage from', req.query.host)
  let unreadCount = 0
  if (messageBuffer[req.query.userId]) {
    unreadCount = messageBuffer[req.query.userId].length
  }
  res.statusCode = 200
  res.status(200).send(unreadCount.toString())
})

app.post('/unreads', cors(), function (req, res) {
  let unreadCount = 0
  if (messageBuffer[req.query.userId]) {
    unreadCount = messageBuffer[req.query.userId].length
  }
  res.statusCode = 200
  res.status(200).send(unreadCount.toString())
})

// left here until the cache expires
app.post('/usage-end', cors(), function (req, res) {
  res.statusCode = 200
  res.end()
})

http.listen(process.env.PORT || 3000, function () {
  console.log('listening on port:' + (process.env.PORT || 3000))
})

app.get('/.well-known/acme-challenge/:content', (req, res) => {
  res.send(process.env.CERTBOT_RESPONSE)
})

function getIpAddressGeo (ip) {
  return new Promise((resolve, reject) => {
    request.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${
        process.env.GEO_KEY
      }&ip=${ip}`,
      (err, resp, body) => {
        if (err) {
          console.log(body)
          return reject(err)
        }
        console.log(body)
        resolve(JSON.parse(body).country_name)
      }
    )
  })
}

function setTyping (chatId) {
  return new Promise((resolve, reject) => {
    request
      .post(
        'https://api.telegram.org/bot' +
          process.env.TELEGRAM_TOKEN +
          '/sendChatAction',
        function (err, resp, body) {
          if (err) {
            console.error(err)
            return reject(err)
          }
          resolve(body)
        }
      )
      .form({
        chat_id: chatId,
        action: 'typing'
      })
  })
}

function sendTelegramMessage (chatId, text, parseMode) {
  console.log('sending message', text)
  return new Promise((resolve, reject) => {
    request
      .post(
        'https://api.telegram.org/bot' +
          process.env.TELEGRAM_TOKEN +
          '/sendMessage',
        function (err, resp, body) {
          if (err) {
            console.error(err)
            return reject(err)
          }
          resolve(body)
        }
      )
      .form({
        chat_id: chatId,
        text: text,
        parse_mode: parseMode
      })
  })
}
