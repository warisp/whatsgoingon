from flask import Flask
from flask_cors import CORS

from whatsgoingon.web.web import web
from whatsgoingon.api.api import api


app = Flask(__name__, static_folder=None)
CORS(app)


app.register_blueprint(web, url_prefix='/')
app.register_blueprint(api, url_prefix='/api')
