# Half-Intergram
This project is a fork of the great https://github.com/idoco/intergram live chat widget. It aims to be only a client, meaning it is a minimal HTML+JS widget for web bots, but it could also be used with any compatible server as a live chat widget.

## Web Widget Usage
To include the widget in your website: 
    
* Look at the [demo](http://cdn.rawgit.com/bloogram/half-intergram/master/dist/demo.html) and `app.py` to see how to include the widget in your server. Note that the demo won't work unless you have a server running on `http://localhost:3000`

* Look at the configuration options [here](https://github.com/bloogram/half-intergram/blob/master/src/widget/default-configuration.js)

* Add to your webpage the widget with your configuration options:

`<script id="intergramWidget" src='http://cdn.rawgit.com/bloogram/half-intergram/master/dist/js/widget.js?settings={"chatServer":"http://localhost:3000"}'></script>`

## Developers Usage
To see your code modifications in action :
    
* Run `npm install`, files will then compile in `/dist`
* Run `pip3 install -r requirements.txt && python3 app.py`, for more info look at the provided sample python server `app.py`.
* Open your browser to see the [demo](http://localhost:3000/)


