import requests

def get_event(user_key, latitude, longitude):

    url = "http://api.eventful.com/json/events/search?"
    url += "&app_key=" + user_key
    url += "&date=Future"  #+ date
    url += "&page_size=100"
    url += "&sort_order=popularity"
    url += "&sort_direction=descending"
    url += "&q=music"
    url += "&c=music"
    url += "&where=" + latitude + "," + longitude + "&within=10&km"

    data = requests.get(url).json()

    if int(data["total_items"]) > 0:
        return data["events"]["event"]
    else:
        return "404"


