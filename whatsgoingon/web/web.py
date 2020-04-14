from flask import Blueprint, render_template


web = Blueprint('web',
                __name__,
                template_folder='html/templates',
                static_folder='html/static',
                static_url_path="static")


@web.route('/')
def index():
    return render_template("map.html", title="Whats going on?")
