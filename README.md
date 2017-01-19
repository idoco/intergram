# Intergram

**Free** live chat widget linked to your telegram messenger.
![](docs/intergram-demo.gif)

#### Embed Intergram in your website with these 2 simple steps

1. Open Telegram, search for `@Intergram` and hit `/start` to get your unique chat ID.

<p align="center">
  <img src="docs/bot-start.gif"/>
</p>

2. Paste this snippet right before the closing body tag of every page where you want the chat to appear 
(Don't forget to add your real chat ID). 

```html
<script> window.intergramId = <Your unique chat ID> </script>
<script id="intergram" type="text/javascript" src="https://www.intergram.xyz/js/widget.js"></script>
```

#### Deploy your own Intergram instance (The hard way)
1. Talk to Telegram [@BotFather](https://telegram.me/botfather), create a new bot and get its API Token.

2. Deploy this repo to your own chat server. 
  - Clone it locally or if you use Heroku, fork this repository and point the new app to it.
  - Set an .env varible named `TELEGRAM_TOKEN` with the value you got from @BotFather

3. Setup the webhook for the bot server by making a `GET` request to the following url
  `https://api.telegram.org/bot<TOKEN>/setWebhook?url=<Server url>/hook`
  (Don't forget to replace with your token and server url)

4. Open a chat with your bot and hit `/start` to get your unique chat ID

5. Embed this sinpet in your website
  ```html
  <script> 
    window.intergramId = <Your unique chat ID>
    window.intergramIFrameSrc = <Server url> + '/chat.html'
  </script>
  <script id="intergram" type="text/javascript" src="<Server url>/js/widget.js"></script>
  ```
6. :tada:
