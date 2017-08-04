import datetime
import os

from sanic import Sanic
from sanic.response import redirect
import socketio
import asyncio

STATIC_FOLDER = os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__))), 'dist')
CONFIG_SERVER = dict(
    host="0.0.0.0", port=3000, workers=1,
)
NAMESPACE = '/socket.io'
NAMESPACE = None
app = Sanic(__name__)
sio = socketio.AsyncServer(async_mode='sanic', logger=True)
sio.attach(app)
# Serves files from the static folder to the URL /static
app.static('', file_or_directory=STATIC_FOLDER)
USERS = {}


@app.route("/", methods=['GET', 'POST'])
async def root(request):
    return redirect("demo.html")


@sio.on('connect', namespace=NAMESPACE)
def connect(sid, environ):
    print("connect ", sid, environ)


@sio.on('register', namespace=NAMESPACE)
def register(sid, data):
    print("register ", sid, data)
    USERS[sid] = data


@sio.on('message', namespace=NAMESPACE)
async def message(sid, data):
    print("message received ", sid, data)
    chatId, userId = USERS[sid]['chatId'], USERS[sid]['userId']
    eventname = chatId + '-' + userId
    message_time = datetime.datetime.utcnow()
    message_time_str = message_time.strftime('%Y-%m-%dT%H:%M:%S.') + ("%03d" % (message_time.microsecond / 1000)) + 'Z'
    # asyncio.ensure_future(slow_operation())
    await asyncio.gather(sio.emit(eventname, data),
                         sio.emit(eventname, {**data, 'from': 'admin', 'time': message_time_str}),
                         # sio.emit(chatId, data['from'], data['text'], **{'from': 'admin'})
                         )
    # await sio.emit('reply', room=sid)


@sio.on('disconnect', namespace=NAMESPACE)
def disconnect(sid):
    print('disconnect ', sid)


if __name__ == '__main__':
    app.run(**CONFIG_SERVER)
