#!/usr/bin/env python
import webapp2
from webapp2_extras import jinja2
from google.appengine.ext.webapp import util
from google.appengine.ext import db


class Property(db.Model):
    address = db.StringProperty()
    price = db.FloatProperty()


class BaseHandler(webapp2.RequestHandler):

    @webapp2.cached_property
    def jinja2(self):
        # Returns a Jinja2 renderer cached in the app registry.
        return jinja2.get_jinja2(app=self.app)

    def render_response(self, _template, **context):
        # Renders a template and writes the result to the response.
        rv = self.jinja2.render_template(_template, **context)
        self.response.write(rv)


class MainHandler(BaseHandler):
    def get(self):
        context = {
            'API_KEY': 'AIzaSyAWT-4e0uWKB4LFa-wWXJCWKNQ2lPk_aEs',
            'coordinate':{'lat':1.35188,'lng':103.820114},
            'zoom':11
        }
        self.render_response('index.html', **context)


app = webapp2.WSGIApplication([('/', MainHandler)],
                                         debug=True)

def main():
    app.run()


if __name__ == '__main__':
    main()
