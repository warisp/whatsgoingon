from flask import Blueprint, jsonify

import spotipy
import spotipy.util as util
import requests

from .eventful import get_event
from .bandsintown import *


api = Blueprint('api', __name__)

username = "118545015"
scope = 'user-library-read'
client_id = "84e1993e6e244b11b45ddef8f9c0638f"
client_secret = "971bf901ea224c03ab9fa2865a4dc0da"
redirect_url = "https://www.google.com/"
token = util.prompt_for_user_token(username, scope, client_id, client_secret, redirect_url)
sp = spotipy.Spotify(auth=token)


@api.route('/')
def index():
    return "API"

@api.route('/toptracks/<string:artist>', methods=['GET'])
def top_tracks(artist):
    results = sp.search(q=artist, limit=1)
    for i, t in enumerate(results['tracks']['items']):
        print(i, artist + ":" + t['name'] + '\t' + ' - ' + t['uri'])

    uri = results['tracks']['items'][0]['uri']
    code = re.split('\\b:\\b', uri)[-1]

    preview = sp.track(code)
    print(preview['preview_url'])
    return jsonify(preview)


@api.route('/events/<latitude>/<longitude>', methods=['GET'])
def eventsearch2(latitude, longitude):
    user_key = "2jqTDt57X8DGdsHW"
    content = get_event(user_key, latitude, longitude)
    return json.dumps(content, ensure_ascii=False, indent=4, separators=(',', ': '))


@api.route('/bands', methods=['GET'])
def bands():
    response = requests.get("http://rest.bandsintown.com/artists/Radiohead?app_id=f614912873e83658d6de740a720d419c", verify=False)
    print(response.text)
    return True
