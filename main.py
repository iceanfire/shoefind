#!/usr/bin/python
#hello

import os
import webapp2
import jinja2

config = {}
config['webapp2_extras.jinja2'] = {
  'template_path':'/',
  'environment_args': {
    'autoescape': True,
    'extensions': [
        'jinja2.ext.autoescape']}
}

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

class authHandler(webapp2.RequestHandler):
	def render_response(self, template_path, **template_values):
		template = jinja_environment.get_template(template_path)
		self.response.write(template.render(**template_values))


class HomePage(authHandler):
	def get(self):
		template_values = {}
		self.render_response('index.html', **template_values)

application = webapp2.WSGIApplication([('/', HomePage)],
                                     debug=True)

def main():
    application.run()

if __name__ == "__main__":
    main()
