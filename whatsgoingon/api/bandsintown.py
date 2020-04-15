try:
    import cjson as json
except ImportError:
    import json

import re
import urllib.request
import urllib
import ssl


base_url = "http://rest.bandsintown.com"
app_id = "f614912873e83658d6de740a720d419c"


# Helper stuff
def get_args():
    if app_id is None:
        raise Exception("app_id needs to be set!!")
    return [("format", "json"), ("app_id", app_id)]

slashes_re = re.compile('\\\/')


def clean_slashes_for_cjson(data):
    return slashes_re.sub('/', data)


def send_request(url, args =[]):
    g_context = ssl.SSLContext(ssl.PROTOCOL_TLSv1)
    response = urllib.request.urlopen(base_url + "%s?%s" % (url, urllib.parse.urlencode(args + get_args())), context=g_context)
    if response.getcode() != 200:
        raise Exception("Request fail: %s" % response.read())
    if json.__name__ == "cjson":
        return json.decode(clean_slashes_for_cjson(response.read()))
    return json.loads(response.read())

