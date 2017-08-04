# Half-Intergram
This project is a fork of the great https://github.com/idoco/intergram live chat widget. It aims to be only a client, meaning it is a minimal HTML+JS widget for web bots, but it could also be used with any compatible server as a live chat widget.

## Web Widget Usage
To include the widget in your website: 
    
* Add to your webpage:

`<script id="intergramWidget" src='http://rawgit.com/bloogram/half-intergram/master/dist/js/widget.js?settings={"chatServer":"http://localhost:3000"}'></script>`

* Look at [demo](http://rawgit.com/bloogram/half-intergram/master/dist/) and `app.py` to see how to include the widget in your server.

## Developers Usage
To see your code modifications in action :
    
* Run `npm install`, files will then compile in `/dist`
* Run `pip3 install -r requirements.txt && python3 app.py`, for more info look at the provided sample python server `app.py`.
* Open your browser to see the [demo](http://localhost:3000/)


